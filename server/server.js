const http = require('http');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');

function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) return {};
  return Object.fromEntries(fs.readFileSync(filePath, 'utf8').split(/\r?\n/).filter(line => line && !line.trim().startsWith('#')).map(line => {
    const index = line.indexOf('=');
    return [line.slice(0, index).trim(), line.slice(index + 1).trim().replace(/^['"]|['"]$/g, '')];
  }).filter(([key]) => key));
}

const env = { ...loadEnv(envPath), ...process.env };
const PORT = Number(env.PORT || 4000);
const POLL_INTERVAL_MS = Number(env.META_POLL_INTERVAL_MS || 30_000);
const FRONTEND_FALLBACK_POLL_INTERVAL_MS = Number(env.FRONTEND_FALLBACK_POLL_INTERVAL_MS || 1_000);
const SSE_HEARTBEAT_INTERVAL_MS = Number(env.SSE_HEARTBEAT_INTERVAL_MS || 15_000);
const accessToken = env.META_ACCESS_TOKEN;
let latest = null;
let lastError = null;
const clients = new Set();

async function fetchFollowers() {
  if (!accessToken || accessToken === 'your_meta_access_token_here') throw new Error('META_ACCESS_TOKEN is missing in the root .env file.');
  const url = `https://graph.instagram.com/v25.0/me?fields=id,username,followers_count&access_token=${encodeURIComponent(accessToken)}`;
  const response = await fetch(url);
  const data = await response.json();
  if (!response.ok || data.error) throw new Error(data.error?.message || `Meta API HTTP ${response.status}`);
  return { id: data.id, username: data.username, followers: Number(data.followers_count) || 0, updatedAt: new Date().toISOString() };
}

function broadcast(profile) {
  const message = `data: ${JSON.stringify(profile)}\n\n`;
  for (const client of clients) client.write(message);
}

async function refresh() {
  try { latest = await fetchFollowers(); lastError = null; broadcast(latest); console.log(`[Meta] ${latest.username}: ${latest.followers}`); }
  catch (error) { lastError = error; console.error(`[Meta] ${error.message}`); }
}

function sendJson(response, status, body) {
  response.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' });
  response.end(JSON.stringify(body));
}

const server = http.createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  if (url.pathname === '/api/health') return sendJson(response, 200, { ok: true, metaConfigured: Boolean(accessToken) });
  if (url.pathname === '/api/config') return sendJson(response, 200, { fallbackPollIntervalMs: FRONTEND_FALLBACK_POLL_INTERVAL_MS });
  if (url.pathname === '/api/followers') return latest ? sendJson(response, 200, latest) : sendJson(response, 503, { error: lastError?.message || 'Follower data is not ready.' });
  if (url.pathname === '/api/events') {
    response.writeHead(200, { 'Content-Type': 'text/event-stream; charset=utf-8', 'Cache-Control': 'no-cache, no-transform', Connection: 'keep-alive', 'Access-Control-Allow-Origin': '*', 'X-Accel-Buffering': 'no', 'Content-Encoding': 'identity' });
    if (response.flushHeaders) response.flushHeaders();
    response.write(': connected\n\n');
    if (latest) response.write(`data: ${JSON.stringify(latest)}\n\n`);
    clients.add(response);
    request.on('close', () => clients.delete(response));
    return;
  }
  sendJson(response, 404, { error: 'Not found' });
});

server.listen(PORT, async () => { console.log(`Follower backend listening on http://localhost:${PORT}`); await refresh(); setInterval(refresh, POLL_INTERVAL_MS); });

setInterval(() => {
  for (const client of clients) client.write(': heartbeat\n\n');
}, SSE_HEARTBEAT_INTERVAL_MS);
