#!/bin/bash

# ============================================================
#   Trinergy Comm-THA Website Installer
#   Domain: www.trinergycomm-tha.com
#   Author: Trinergy Comm-THA Co., Ltd.
# ============================================================

set -e  # Exit immediately if any command fails

DOMAIN="trinergycomm-tha.com"
WWW_DOMAIN="www.trinergycomm-tha.com"
APP_DIR="/var/www/trinergy-webapp"
NGINX_CONF="/etc/nginx/sites-available/trinergy"

# ── Colors ──────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m' # No Color

print_step() { echo -e "\n${BLUE}${BOLD}▶ $1${NC}"; }
print_ok()   { echo -e "  ${GREEN}✓ $1${NC}"; }
print_warn() { echo -e "  ${YELLOW}⚠ $1${NC}"; }
print_err()  { echo -e "  ${RED}✗ $1${NC}"; }

# ── Banner ───────────────────────────────────────────────────
echo -e "${GREEN}${BOLD}"
echo "╔══════════════════════════════════════════════════╗"
echo "║     Trinergy Comm-THA Website Installer          ║"
echo "║     www.trinergycomm-tha.com                     ║"
echo "╚══════════════════════════════════════════════════╝"
echo -e "${NC}"

# ── Check root ───────────────────────────────────────────────
if [ "$EUID" -ne 0 ]; then
  print_err "Please run as root: sudo bash install.sh"
  exit 1
fi

# ── Check if project files exist ─────────────────────────────
print_step "Checking project files..."
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ ! -d "$SCRIPT_DIR/server" ] || [ ! -d "$SCRIPT_DIR/client" ]; then
  print_err "Project files not found. Make sure install.sh is inside the trinergy-webapp folder."
  exit 1
fi
print_ok "Project files found at $SCRIPT_DIR"

# ── Update system ────────────────────────────────────────────
print_step "Updating system packages..."
apt-get update -qq
print_ok "System packages updated"

# ── Install Node.js 20 ───────────────────────────────────────
print_step "Installing Node.js 20..."
if command -v node &>/dev/null && node -v | grep -q "v20\|v21\|v22"; then
  print_ok "Node.js $(node -v) already installed"
else
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash - -qq
  apt-get install -y nodejs -qq
  print_ok "Node.js $(node -v) installed"
fi

# ── Install PM2 ──────────────────────────────────────────────
print_step "Installing PM2 (process manager)..."
npm install -g pm2 --quiet
print_ok "PM2 $(pm2 -v) installed"

# ── Install Nginx ────────────────────────────────────────────
print_step "Installing Nginx..."
apt-get install -y nginx -qq
print_ok "Nginx installed"

# ── Install Certbot ──────────────────────────────────────────
print_step "Installing Certbot (SSL)..."
apt-get install -y certbot python3-certbot-nginx -qq
print_ok "Certbot installed"

# ── Copy project to /var/www ─────────────────────────────────
print_step "Copying project files to $APP_DIR..."
mkdir -p "$APP_DIR"
cp -r "$SCRIPT_DIR/." "$APP_DIR/"
print_ok "Project copied to $APP_DIR"

# ── Install server dependencies ───────────────────────────────
print_step "Installing backend dependencies..."
cd "$APP_DIR/server"
npm install --production --silent
print_ok "Backend dependencies installed"

# ── Initialize database ───────────────────────────────────────
print_step "Initializing database..."
cd "$APP_DIR/server"
node src/init-db.js
print_ok "Database initialized with all products and company info"

# ── Build React frontend ──────────────────────────────────────
print_step "Building React frontend (this may take a minute)..."
cd "$APP_DIR/client"
npm install --silent
npm run build --silent
print_ok "Frontend built → $APP_DIR/client/dist"

# ── Set folder permissions ────────────────────────────────────
print_step "Setting file permissions..."
chown -R www-data:www-data "$APP_DIR"
chmod -R 755 "$APP_DIR"
chmod -R 775 "$APP_DIR/server/uploads"
print_ok "Permissions set"

# ── Configure Nginx ───────────────────────────────────────────
print_step "Configuring Nginx..."

cat > "$NGINX_CONF" <<EOF
server {
    listen 80;
    server_name $DOMAIN $WWW_DOMAIN;

    # Serve React frontend (built static files)
    root $APP_DIR/client/dist;
    index index.html;

    # Max upload size for product images (10MB)
    client_max_body_size 15M;

    # React Router — serve index.html for all frontend routes
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Proxy API calls to Node.js backend
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Serve uploaded product images
    location /uploads/ {
        alias $APP_DIR/server/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
}
EOF

# Enable site
ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/trinergy

# Remove default site if it exists
rm -f /etc/nginx/sites-enabled/default

nginx -t
systemctl restart nginx
print_ok "Nginx configured and restarted"

# ── Start backend with PM2 ────────────────────────────────────
print_step "Starting backend API with PM2..."

# Stop existing instance if running
pm2 stop trinergy-api 2>/dev/null || true
pm2 delete trinergy-api 2>/dev/null || true

cd "$APP_DIR/server"
pm2 start src/index.js \
  --name trinergy-api \
  --env production \
  --restart-delay 3000 \
  --max-restarts 10

pm2 save
pm2 startup systemd -u root --hp /root | tail -1 | bash 2>/dev/null || true

print_ok "Backend API started with PM2"

# ── Get SSL certificate ───────────────────────────────────────
print_step "Obtaining SSL certificate for $DOMAIN and $WWW_DOMAIN..."
echo ""
print_warn "Make sure your domain DNS A records point to this server's public IP before continuing."
echo ""
read -p "  Do you want to get the SSL certificate now? (y/n): " ssl_confirm

if [[ "$ssl_confirm" == "y" || "$ssl_confirm" == "Y" ]]; then
  certbot --nginx \
    -d "$DOMAIN" \
    -d "$WWW_DOMAIN" \
    --non-interactive \
    --agree-tos \
    --email admin@trinergycomm-tha.com \
    --redirect
  print_ok "SSL certificate obtained! Site is now on HTTPS."
else
  print_warn "Skipped SSL. Run this later to enable HTTPS:"
  echo "  sudo certbot --nginx -d $DOMAIN -d $WWW_DOMAIN"
fi

# ── Auto-renew SSL ────────────────────────────────────────────
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -
print_ok "SSL auto-renewal scheduled"

# ── Final status check ────────────────────────────────────────
print_step "Checking services..."

echo ""
if systemctl is-active --quiet nginx; then
  print_ok "Nginx is running"
else
  print_err "Nginx is NOT running — check: sudo systemctl status nginx"
fi

sleep 2
if curl -s http://localhost:3001/api/health | grep -q "ok"; then
  print_ok "Backend API is responding"
else
  print_warn "Backend API not responding yet — check: pm2 logs trinergy-api"
fi

# ── Done ─────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}${BOLD}"
echo "╔══════════════════════════════════════════════════╗"
echo "║            Installation Complete!               ║"
echo "╠══════════════════════════════════════════════════╣"
echo "║                                                  ║"
echo "║  Website:  https://www.trinergycomm-tha.com      ║"
echo "║  Admin:    https://www.trinergycomm-tha.com/admin║"
echo "║                                                  ║"
echo "║  Useful commands:                                ║"
echo "║    pm2 status           → check backend          ║"
echo "║    pm2 logs trinergy-api → view backend logs     ║"
echo "║    pm2 restart trinergy-api → restart backend    ║"
echo "║    sudo nginx -t        → test nginx config      ║"
echo "║                                                  ║"
echo "╚══════════════════════════════════════════════════╝"
echo -e "${NC}"
