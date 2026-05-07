const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { getDb } = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// GET all products
router.get('/', (req, res) => {
  try {
    const db = getDb();
    const products = db.prepare('SELECT * FROM products ORDER BY display_order ASC, id ASC').all();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single product
router.get('/:id', (req, res) => {
  try {
    const db = getDb();
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create product (admin)
router.post('/', authMiddleware, upload.single('image'), (req, res) => {
  try {
    const db = getDb();
    const { name, category, short_description, description, tags, specs, display_order, theme } = req.body;

    if (!name || !category) {
      return res.status(400).json({ error: 'Name and category are required' });
    }

    const image_path = req.file ? req.file.filename : null;

    const stmt = db.prepare(`
      INSERT INTO products (name, category, short_description, description, tags, specs, image_path, theme, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(name, category, short_description || '', description || '', tags || '', specs || '', image_path, theme || 'default', display_order || 0);
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update product (admin)
router.put('/:id', authMiddleware, upload.single('image'), (req, res) => {
  try {
    const db = getDb();
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const { name, category, short_description, description, tags, specs, display_order, theme } = req.body;
    if (!name || !category) {
      return res.status(400).json({ error: 'Name and category are required' });
    }

    let image_path = product.image_path;
    if (req.file) {
      image_path = req.file.filename;
      if (product.image_path) {
        const oldPath = path.join(uploadsDir, product.image_path);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
    }

    db.prepare(`
      UPDATE products
      SET name = ?, category = ?, short_description = ?, description = ?, tags = ?, specs = ?, image_path = ?, theme = ?, display_order = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(name, category, short_description || '', description || '', tags || '', specs || '', image_path, theme || 'default', display_order || 0, req.params.id);

    const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE product (admin)
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const db = getDb();
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Delete image file if exists
    if (product.image_path) {
      const imgPath = path.join(uploadsDir, product.image_path);
      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
      }
    }

    db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
