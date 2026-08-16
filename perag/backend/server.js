const express = require('express');
const cors = require('cors');
const { init } = require('./db');

const llmRoute = require('./routes/llm');
const resultsRoute = require('./routes/results');
const queueRoute = require('./routes/queue');

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.get('/healthz', (_req, res) => res.json({ ok: true }));

app.use('/api/llm', llmRoute);
app.use('/api/results', resultsRoute);
app.use('/api/queue', queueRoute);

const PORT = process.env.PORT || 4000;

init()
  .then(() => {
    app.listen(PORT, () => console.log(`[perag-backend] listening on :${PORT}`));
  })
  .catch((err) => {
    console.error('[perag-backend] failed to initialize database, exiting', err);
    process.exit(1);
  });
