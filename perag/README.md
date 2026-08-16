# PERAG — Provenance-Aware RAG Evaluation

A multi-domain benchmark harness for evaluating whether LLMs faithfully cite
sources, resist fabricated ("polluted") context, and recall the correct
answer under different prompting strategies.

## Architecture

```
┌────────────┐      ┌────────────┐      ┌────────────┐
│  frontend  │ ───▶ │  backend   │ ───▶ │     db     │
│  (nginx,   │ /api │ (Node/     │      │ (Postgres, │
│  static UI)│      │  Express)  │      │  results + │
│  :8080     │      │  :4000     │      │  queue)    │
└────────────┘      └─────┬──────┘
                           │
                           ▼
                 Anthropic / Groq / OpenAI /
                 OpenRouter / Ollama / vLLM
                 (cloud keys read from .env,
                  never sent to the browser)
```

- **frontend** — the PERAG single-page app, served as static files by nginx.
  All LLM calls and result/queue persistence go through `/api/*`, which nginx
  proxies to the backend container.
- **backend** — an Express service that (a) proxies LLM requests, attaching
  the correct provider API key from its own environment, and (b) exposes a
  small REST API backed by Postgres for storing batch-matrix results and the
  model queue, so they persist across sessions/machines instead of living
  only in browser `localStorage`.
- **db** — Postgres 16, schema created automatically on first boot from
  `db/init.sql`.

## Prerequisites

- Docker and Docker Compose (Docker Desktop, or `docker` + `docker compose`
  CLI on Linux).
- At least one API key for a cloud LLM provider (Anthropic, Groq, OpenAI, or
  OpenRouter) — or a locally running model server (Ollama / vLLM) reachable
  from the backend container.

## Setup & run

1. **Clone/copy the project**, then `cd` into it.

2. **Configure API keys.**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and fill in keys for whichever providers you'll use (you only
   need one to get started — Groq has a free tier). Leave the rest blank.

3. **Build the images.**
   ```bash
   docker compose build
   ```

4. **Start the stack.**
   ```bash
   docker compose up -d
   ```
   This brings up Postgres first (waiting for its healthcheck), then the
   backend (which connects to Postgres and creates its tables if needed),
   then the frontend.

5. **Check everything is healthy.**
   ```bash
   docker compose ps
   curl http://localhost:8080/api/../healthz   # or: curl http://localhost:4000/healthz from inside the network
   ```
   You should see three containers (`db`, `backend`, `frontend`) in an "up"
   / "healthy" state.

6. **Open the app.**
   Visit **http://localhost:8080** in your browser.

7. **Pick a backend in the sidebar.** For a cloud provider (Anthropic,
   Groq, OpenAI, OpenRouter) the API-key field is hidden — it's already
   configured from `.env` on the server. For a local/self-hosted backend
   (Ollama, Krikri, EuroLLM, FORTH) you can optionally enter a bearer token
   there; it's forwarded to the backend as an override, never stored.

8. **Run an experiment** from the main panel, or configure the **batch
   matrix** in the sidebar to sweep benchmarks × models × prompt variants.
   Batch results and the model queue are now saved to Postgres — inspect
   them directly if you like:
   ```bash
   docker compose exec db psql -U perag -d perag -c "select id, benchmark, model_label, created_at from eval_results order by id desc limit 20;"
   ```

## Stopping / resetting

```bash
docker compose down          # stop containers, keep data
docker compose down -v       # stop containers AND delete the Postgres volume (results, queue)
```

## Local (non-Docker) development

Each piece can also be run directly if you'd rather iterate without
rebuilding images:

```bash
# 1. Postgres (any local instance works — just set DATABASE_URL below)
docker run -d --name perag-db -e POSTGRES_USER=perag -e POSTGRES_PASSWORD=perag \
  -e POSTGRES_DB=perag -p 5432:5432 postgres:16-alpine

# 2. Backend
cd backend
npm install
DATABASE_URL=postgres://perag:perag@localhost:5432/perag \
ANTHROPIC_API_KEY=... GROQ_API_KEY=... \
npm start   # listens on :4000

# 3. Frontend — any static server pointed at frontend/public, proxying
#    /api to http://localhost:4000. E.g. with nginx locally, or:
npx serve frontend/public -l 8080
# (if not proxying /api, edit frontend/public/index.html's fetch('/api/llm', ...)
#  calls to point at http://localhost:4000/api/llm directly)
```

## Notes on the provenance-aware evaluation itself

The evaluation logic (benchmark presets, condition sweeps C1–C6, pollution
sweep, fake-acceptance / recall scoring, gold-answer matching) is unchanged
from the original single-file app — only the LLM transport and result
persistence moved server-side. See the in-app sidebar and comments in
`frontend/public/index.html` for details on each benchmark and condition.
