const express = require('express');
const { getDb } = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET all company info
router.get('/', (req, res) => {
  try {
    const db = getDb();
    const rows = db.prepare('SELECT key, value FROM company_info').all();
    const info = {};
    rows.forEach(row => {
      info[row.key] = row.value;
    });
    res.json(info);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update company info (admin)
router.put('/', authMiddleware, (req, res) => {
  try {
    const db = getDb();
    const updates = req.body;

    const upsert = db.prepare(`
      INSERT INTO company_info (key, value, updated_at)
      VALUES (?, ?, datetime('now'))
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
    `);

    const updateMany = db.transaction((data) => {
      for (const [key, value] of Object.entries(data)) {
        upsert.run(key, value);
      }
    });

    updateMany(updates);

    const rows = db.prepare('SELECT key, value FROM company_info').all();
    const info = {};
    rows.forEach(row => {
      info[row.key] = row.value;
    });
    res.json(info);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
