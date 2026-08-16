-- Executed automatically by the official postgres image on first startup
-- (mounted into /docker-entrypoint-initdb.d/). The backend also creates
-- these tables defensively on boot (CREATE TABLE IF NOT EXISTS), so this
-- file is not strictly required — it just makes the schema explicit and
-- lets you bootstrap the DB without starting the backend first.

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

CREATE TABLE IF NOT EXISTS model_queue (
  id SERIAL PRIMARY KEY,
  position INTEGER NOT NULL,
  label TEXT NOT NULL,
  backend TEXT NOT NULL,
  model TEXT,
  api_key_override TEXT
);
