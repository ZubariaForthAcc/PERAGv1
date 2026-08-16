const express = require('express');
const router = express.Router();

// Cloud provider keys live ONLY here, read from environment (.env / docker-compose),
// never sent to or stored in the browser.
const ENV_KEYS = {
  anthropic: process.env.ANTHROPIC_API_KEY,
  groq: process.env.GROQ_API_KEY,
  openai: process.env.OPENAI_API_KEY,
  openrouter: process.env.OPENROUTER_API_KEY,
};

const LOCAL_BACKENDS = new Set(['ollama', 'krikri', 'eurollm', 'forth-gemma', 'forth-qwen']);

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

router.post('/', async (req, res) => {
  const { backend, model = '', baseUrl = '', system = '', prompt = '', apiKeyOverride = '' } = req.body || {};

  if (!backend) return res.status(400).json({ error: 'backend is required' });

  const isLocal = LOCAL_BACKENDS.has(backend);
  const key = isLocal ? (apiKeyOverride || '') : ENV_KEYS[backend];

  if (!isLocal && !key) {
    return res.json({
      text: `[No ${backend} API key configured on the server — set ${backend.toUpperCase()}_API_KEY in backend/.env]`,
    });
  }

  await delay(backend === 'groq' ? 2200 : 500);

  const timeoutMs =
    backend === 'forth-qwen' ? 240000 : backend === 'forth-gemma' ? 120000 : 60000;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    let text;

    if (backend === 'anthropic') {
      const body = { model: 'claude-haiku-4-5-20251001', max_tokens: 600, messages: [{ role: 'user', content: prompt }] };
      if (system) body.system = system;
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify(body),
      });
      const data = await r.json();
      text = data.error ? `[Anthropic error: ${data.error.message}]` : data.content[0].text;

    } else if (backend === 'groq') {
      const msgs = system ? [{ role: 'system', content: system }] : [];
      msgs.push({ role: 'user', content: prompt });
      const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + key },
        body: JSON.stringify({ model: 'llama-3.3-70b-versatile', messages: msgs, max_tokens: 600 }),
      });
      const data = await r.json();
      text = data.error ? `[Groq error ${r.status}: ${data.error.message}]` : data.choices[0].message.content;

    } else if (backend === 'openai' || backend === 'openrouter') {
      const msgs = system ? [{ role: 'system', content: system }] : [];
      msgs.push({ role: 'user', content: prompt });
      const url = (baseUrl || (backend === 'openrouter' ? 'https://openrouter.ai/api/v1' : 'https://api.openai.com/v1')) + '/chat/completions';
      const mdl = model || (backend === 'openai' ? 'gpt-4o-mini' : 'deepseek/deepseek-chat-v3-0324:free');
      const headers = { 'Content-Type': 'application/json', Authorization: 'Bearer ' + key };
      if (backend === 'openrouter') {
        headers['HTTP-Referer'] = req.get('origin') || '';
        headers['X-Title'] = 'PERAG Medical';
      }
      const r = await fetch(url, { method: 'POST', signal: controller.signal, headers, body: JSON.stringify({ model: mdl, messages: msgs, max_tokens: 600 }) });
      const data = await r.json();
      text = data.error ? `[Error: ${data.error.message || JSON.stringify(data.error)}]` : data.choices[0].message.content;

    } else if (backend === 'krikri' || backend === 'eurollm') {
      const msgs = system ? [{ role: 'system', content: system }] : [];
      msgs.push({ role: 'user', content: prompt });
      const base = (baseUrl || 'http://localhost:8000/v1').replace(/\/$/, '');
      const mdl = model || (backend === 'krikri' ? 'ilsp/Llama-Krikri-8B-Instruct' : 'utter-project/EuroLLM-9B-Instruct');
      const headers = { 'Content-Type': 'application/json' };
      if (key) headers.Authorization = 'Bearer ' + key;
      const r = await fetch(base + '/chat/completions', { method: 'POST', signal: controller.signal, headers, body: JSON.stringify({ model: mdl, messages: msgs, max_tokens: 600 }) });
      const data = await r.json();
      text = data.error ? `[${backend === 'krikri' ? 'Krikri' : 'EuroLLM'} error: ${data.error.message || JSON.stringify(data.error)}]` : data.choices[0].message.content;

    } else if (backend === 'forth-gemma' || backend === 'forth-qwen') {
      const msgs = system ? [{ role: 'system', content: system }] : [];
      msgs.push({ role: 'user', content: prompt });
      const isQwen = backend === 'forth-qwen';
      const defBase = isQwen ? 'http://139.91.183.23:12345/v1' : 'http://139.91.183.23:1234/v1';
      const defModel = isQwen ? 'QuantTrio/Qwen3.6-35B-A3B-AWQ' : 'RedHatAI/gemma-4-26B-A4B-it-FP8-Dynamic';
      const maxTok = isQwen ? 8192 : 2048;
      const base = (baseUrl || defBase).replace(/\/$/, '');
      const mdl = model || defModel;
      const headers = { 'Content-Type': 'application/json', Authorization: 'Bearer ' + (key || 'amd-pan-pan') };
      const r = await fetch(base + '/chat/completions', { method: 'POST', signal: controller.signal, headers, body: JSON.stringify({ model: mdl, messages: msgs, max_tokens: maxTok, temperature: 0.1 }) });
      const data = await r.json();
      text = data.error ? `[FORTH-ICS error: ${data.error.message || JSON.stringify(data.error)}]` : data.choices[0].message.content;

    } else if (backend === 'ollama') {
      const full = system ? system + '\n\n' + prompt : prompt;
      const mdl = model || 'llama3';
      const base = (baseUrl || process.env.OLLAMA_BASE_URL || 'http://localhost:11434').replace(/\/$/, '');
      const r = await fetch(base + '/api/generate', { method: 'POST', signal: controller.signal, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ model: mdl, prompt: full, stream: false }) });
      const data = await r.json();
      text = data.response;

    } else {
      return res.status(400).json({ error: `unknown backend: ${backend}` });
    }

    res.json({ text });
  } catch (e) {
    const text = e.name === 'AbortError' ? '[Timed out or cancelled]' : `[Request failed: ${e.message}]`;
    res.json({ text });
  } finally {
    clearTimeout(timer);
  }
});

module.exports = router;
