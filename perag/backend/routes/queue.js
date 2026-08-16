const express = require('express');
const { pool } = require('../db');
const router = express.Router();

// GET /api/queue — list the saved model queue, in order
router.get('/', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM model_queue ORDER BY position ASC');
    res.json(rows.map((r) => ({
      label: r.label,
      backend: r.backend,
      model: r.model || '',
      apiKeyOverride: r.api_key_override || '',
    })));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PUT /api/queue — replace the whole queue (array of {label, backend, model, apiKeyOverride})
router.put('/', async (req, res) => {
  const queue = Array.isArray(req.body) ? req.body : [];
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM model_queue');
    for (let i = 0; i < queue.length; i++) {
      const q = queue[i];
      await client.query(
        `INSERT INTO model_queue (position, label, backend, model, api_key_override) VALUES ($1,$2,$3,$4,$5)`,
        [i, q.label || '', q.backend || 'groq', q.model || '', q.apiKeyOverride || '']
      );
    }
    await client.query('COMMIT');
    res.status(204).end();
  } catch (e) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: e.message });
  } finally {
    client.release();
  }
});

module.exports = router;
