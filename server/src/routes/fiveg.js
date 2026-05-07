const express = require('express');
const { getDb } = require('../db');

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const db = getDb();
    const specs = db.prepare('SELECT * FROM fiveg_specs ORDER BY display_order ASC').all();
    res.json(specs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
