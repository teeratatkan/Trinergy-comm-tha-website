require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes    = require('./routes/auth');
const productRoutes = require('./routes/products');
const infoRoutes    = require('./routes/info');
const fivegRoutes   = require('./routes/fiveg');
const newsRoutes    = require('./routes/news');
const contactRoutes = require('./routes/contact');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'https://www.trinergycomm-tha.com',
  'https://trinergycomm-tha.com',
  'http://www.trinergycomm-tha.com',
  'http://trinergycomm-tha.com',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/info', infoRoutes);
app.use('/api/5g-specs', fivegRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/contact', contactRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Trinergy API running' });
});

app.listen(PORT, () => {
  console.log(`Trinergy API server running on http://localhost:${PORT}`);
});
