const { Pool } = require('pg');

// DATABASE_URL is injected by docker-compose from the `db` service, e.g.
// postgres://perag:perag@db:5432/perag
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('error', (err) => {
  console.error('[db] unexpected error on idle client', err);
});

async function withRetry(fn, { attempts = 10, delayMs = 2000 } = {}) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      console.warn(`[db] connection attempt ${i + 1}/${attempts} failed: ${err.message}`);
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw lastErr;
}

async function init() {
  await withRetry(async () => {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS eval_results (
        id SERIAL PRIMARY KEY,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        benchmark TEXT NOT NULL,
        model_label TEXT NOT NULL,
        backend TEXT NOT NULL,
        model TEXT,
        variant TEXT,
        pollution_pct INTEGER,
        metrics JSONB NOT NULL
      );
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS model_queue (
        id SERIAL PRIMARY KEY,
        position INTEGER NOT NULL,
        label TEXT NOT NULL,
        backend TEXT NOT NULL,
        model TEXT,
        api_key_override TEXT
      );
    `);
  });
  console.log('[db] schema ready');
}

module.exports = { pool, init };
