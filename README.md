# Trinergy Comm-THA Co., Ltd. — Company Website

Full-stack company website built with React + Vite (frontend) and Node.js + Express (backend).

## Quick Start

```bash
# 1. Install all dependencies
cd /Users/teeratatkanokpattanangkul/Desktop/trinergy-webapp
npm install
cd server && npm install
cd ../client && npm install

# 2. Initialize the database (seeds products, company info, 5G specs)
cd ../server && node src/init-db.js

# 3. Start both servers (from root)
cd ..
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## Admin Access

- URL: http://localhost:5173/admin/login
- Username: `admin`
- Password: `trinergy2024`

## Tech Stack

- **Frontend**: React 18 + Vite, React Router v6, Axios
- **Backend**: Node.js + Express.js
- **Database**: SQLite via better-sqlite3
- **Image uploads**: Multer
- **Auth**: JWT (jsonwebtoken)

## Project Structure

```
trinergy-webapp/
├── client/              React Vite frontend
│   ├── public/logo.png  Company logo
│   └── src/
│       ├── pages/       Public + Admin pages
│       ├── components/  Navbar, Footer
│       └── context/     Auth context
├── server/              Express API
│   ├── src/
│   │   ├── index.js     Entry point
│   │   ├── db.js        SQLite connection
│   │   ├── init-db.js   Database seeder
│   │   ├── middleware/  JWT auth
│   │   └── routes/      API routes
│   └── uploads/         Product images
└── package.json         Root with concurrently
```

## API Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/products | — | All products |
| GET | /api/products/:id | — | Single product |
| POST | /api/products | JWT | Create product |
| DELETE | /api/products/:id | JWT | Delete product |
| GET | /api/info | — | Company info |
| PUT | /api/info | JWT | Update company info |
| GET | /api/5g-specs | — | 5G specifications |
| POST | /api/auth/login | — | Get JWT token |
