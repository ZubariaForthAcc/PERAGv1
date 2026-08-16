const express = require('express');
const { pool } = require('../db');
const router = express.Router();

// GET /api/results — list all stored batch-matrix rows, newest first
router.get('/', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM eval_results ORDER BY id DESC');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/results — append one completed benchmark×model×variant row
router.post('/', async (req, res) => {
  const { benchmark, modelLabel, backend, model, variant, pollutionPct, metrics } = req.body || {};
  if (!benchmark || !modelLabel || !backend || !metrics) {
    return res.status(400).json({ error: 'benchmark, modelLabel, backend and metrics are required' });
  }
  try {
    const { rows } = await pool.query(
      `INSERT INTO eval_results (benchmark, model_label, backend, model, variant, pollution_pct, metrics)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [benchmark, modelLabel, backend, model || null, variant || null, pollutionPct ?? null, metrics]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE /api/results — clear all stored rows
router.delete('/', async (_req, res) => {
  try {
    await pool.query('DELETE FROM eval_results');
    res.status(204).end();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
