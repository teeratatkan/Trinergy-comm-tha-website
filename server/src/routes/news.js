const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { getDb } = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
const uploadsDir = path.join(__dirname, '..', '..', 'uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    if (allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files allowed'));
    }
  },
});

// GET all news — ordered by event_date DESC
router.get('/', (req, res) => {
  try {
    const db = getDb();
    const news = db.prepare('SELECT * FROM news ORDER BY event_date DESC, id DESC').all();
    res.json(news);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET single
router.get('/:id', (req, res) => {
  try {
    const db = getDb();
    const item = db.prepare('SELECT * FROM news WHERE id = ?').get(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST create (admin)
router.post('/', authMiddleware, upload.single('image'), (req, res) => {
  try {
    const db = getDb();
    const { title, excerpt, content, category, event_date } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });
    const image_path = req.file ? req.file.filename : null;
    const result = db.prepare(`
      INSERT INTO news (title, excerpt, content, image_path, category, event_date)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(title, excerpt || '', content || '', image_path, category || 'news', event_date || null);
    const created = db.prepare('SELECT * FROM news WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(created);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT update (admin)
router.put('/:id', authMiddleware, upload.single('image'), (req, res) => {
  try {
    const db = getDb();
    const item = db.prepare('SELECT * FROM news WHERE id = ?').get(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    const { title, excerpt, content, category, event_date } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });
    let image_path = item.image_path;
    if (req.file) {
      image_path = req.file.filename;
      if (item.image_path) {
        const oldPath = path.join(uploadsDir, item.image_path);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
    }
    db.prepare(`
      UPDATE news SET title=?, excerpt=?, content=?, image_path=?, category=?, event_date=?, updated_at=datetime('now')
      WHERE id=?
    `).run(title, excerpt || '', content || '', image_path, category || 'news', event_date || null, req.params.id);
    res.json(db.prepare('SELECT * FROM news WHERE id = ?').get(req.params.id));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE (admin)
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const db = getDb();
    const item = db.prepare('SELECT * FROM news WHERE id = ?').get(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    if (item.image_path) {
      const imgPath = path.join(uploadsDir, item.image_path);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }
    db.prepare('DELETE FROM news WHERE id = ?').run(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
