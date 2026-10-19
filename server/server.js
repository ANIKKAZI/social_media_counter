const http = require('http');
const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const defaultEnvPath = path.join(rootDir, '.env');
const envPath = process.env.SOCIAL_COUNTER_ENV_PATH || defaultEnvPath;
const buildDir = path.join(rootDir, 'build');
const indexHtmlPath = path.join(buildDir, 'index.html');

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
const spinRewards = Array.from({ length: 8 }, (_, index) => {
  const number = index + 1;
  const fallback = [
    ['10% OFF', 'Enjoy 10% off your next visit', '#0879f9'],
    ['15% OFF', 'Enjoy 15% off your next visit', '#00a9a8'],
    ['20% OFF', 'Enjoy 20% off your next visit', '#0862e9'],
    ['FREE GIFT', 'A little gift from us', '#8100e8'],
    ['FREE ADD-ON', 'Choose a complimentary add-on', '#7900eb'],
    ['BUY 1 GET 1', 'Buy one, get one on your next visit', '#e40083'],
    ['BONUS POINTS', 'Bonus points added to your rewards', '#00a9a8'],
    ['TRY AGAIN', 'Thanks for playing—come back soon', '#dc0076'],
  ][index];
  return {
    label: env[`SPIN_REWARD_${number}_LABEL`] || fallback[0],
    description: env[`SPIN_REWARD_${number}_DESCRIPTION`] || fallback[1],
    color: env[`SPIN_REWARD_${number}_COLOR`] || fallback[2],
    active: !/^false|0|no$/i.test(env[`SPIN_REWARD_${number}_ACTIVE`] || 'true'),
  };
});
let latest = null;
let lastError = null;
const clients = new Set();

async function fetchFollowers() {
  if (!accessToken || accessToken === 'your_meta_access_token_here') throw new Error('META_ACCESS_TOKEN is missing in the root .env file.');
  const url = `https://graph.instagram.com/v25.0/me?fields=id,username,followers_count,profile_picture_url&access_token=${encodeURIComponent(accessToken)}`;
  const response = await fetch(url);
  const data = await response.json();
  if (!response.ok || data.error) throw new Error(data.error?.message || `Meta API HTTP ${response.status}`);
  return { id: data.id, username: data.username, followers: Number(data.followers_count) || 0, profilePictureUrl: data.profile_picture_url || null, updatedAt: new Date().toISOString() };
}

const googleApiKey = env.GOOGLE_PLACES_API_KEY;
const googlePlaceId = env.GOOGLE_PLACE_ID;
const GOOGLE_CACHE_MS = Number(env.GOOGLE_POLL_INTERVAL_MS || 300_000);
// Small grace so a client polling on the same period isn't served the previous cache hit
const GOOGLE_CACHE_GRACE_MS = Math.min(5_000, GOOGLE_CACHE_MS / 10);
const publicConfig = {
  fallbackPollIntervalMs: FRONTEND_FALLBACK_POLL_INTERVAL_MS,
  googleReviewUrl: env.GOOGLE_REVIEW_URL || env.REACT_APP_GOOGLE_REVIEW_URL || 'https://g.page/r/google-review',
  googleFallbackCount: Number(env.GOOGLE_REVIEW_COUNT || env.REACT_APP_GOOGLE_REVIEW_COUNT || 0),
  googleFallbackRating: Number(env.GOOGLE_RATING || env.REACT_APP_GOOGLE_RATING || 0),
  spinCallToAction: env.SPIN_CALL_TO_ACTION || 'Follow us or share a review to play',
  spinRedemptionInstructions: env.SPIN_REDEMPTION_INSTRUCTIONS || 'Show this screen to a team member to redeem. Valid for 30 days.',
  spinCampaignEnabled: !/^false|0|no$/i.test(env.SPIN_CAMPAIGN_ENABLED || 'true'),
  spinCampaignStart: env.SPIN_CAMPAIGN_START || '',
  spinCampaignEnd: env.SPIN_CAMPAIGN_END || '',
  spinLimitPerCustomer: Math.max(1, Number(env.SPIN_LIMIT_PER_CUSTOMER || 1)),
  spinRewards,
};
let googleCache = null;

async function fetchGoogleReviews() {
  if (!googleApiKey || !googlePlaceId) throw new Error('GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID must be set in the root .env file.');
  if (googleCache && Date.now() - googleCache.fetchedAt < GOOGLE_CACHE_MS - GOOGLE_CACHE_GRACE_MS) return googleCache.data;
  const response = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(googlePlaceId)}`, {
    headers: { 'X-Goog-Api-Key': googleApiKey, 'X-Goog-FieldMask': 'id,displayName,rating,userRatingCount' },
  });
  const body = await response.json();
  if (!response.ok || body.error) throw new Error(body.error?.message || `Google Places HTTP ${response.status}`);
  const data = { placeId: body.id || googlePlaceId, name: body.displayName?.text || '', rating: Number(body.rating) || 0, reviewCount: Number(body.userRatingCount) || 0, updatedAt: new Date().toISOString() };
  googleCache = { data, fetchedAt: Date.now() };
  console.log(`[Google] ${data.name}: ${data.rating} stars, ${data.reviewCount} reviews`);
  return data;
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

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

function serveStatic(requestPath, response) {
  if (!fs.existsSync(indexHtmlPath)) return false;
  const decodedPath = decodeURIComponent(requestPath);
  const normalizedPath = path.normalize(decodedPath === '/' ? '/index.html' : decodedPath);
  const relativePath = normalizedPath.replace(/^[/\\]+/, '');
  const filePath = path.join(buildDir, relativePath);
  const resolvedPath = path.resolve(filePath);
  const resolvedBuildDir = path.resolve(buildDir);
  const relativeToBuild = path.relative(resolvedBuildDir, resolvedPath);
  const isInsideBuild = relativeToBuild && !relativeToBuild.startsWith('..') && !path.isAbsolute(relativeToBuild);
  const targetPath = isInsideBuild && fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isFile()
    ? resolvedPath
    : indexHtmlPath;
  const ext = path.extname(targetPath).toLowerCase();
  response.writeHead(200, {
    'Content-Type': contentTypes[ext] || 'application/octet-stream',
    'Cache-Control': targetPath === indexHtmlPath ? 'no-store' : 'public, max-age=31536000, immutable',
  });
  fs.createReadStream(targetPath).pipe(response);
  return true;
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  if (url.pathname === '/api/google-reviews') {
    try { return sendJson(response, 200, await fetchGoogleReviews()); }
    catch (error) { console.error(`[Google] ${error.message}`); return sendJson(response, 503, { error: error.message }); }
  }
  if (url.pathname === '/api/health') return sendJson(response, 200, { ok: true, metaConfigured: Boolean(accessToken) });
  if (url.pathname === '/api/config') return sendJson(response, 200, publicConfig);
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
  if (serveStatic(url.pathname, response)) return;
  sendJson(response, 404, { error: 'Not found. Run npm run build before starting the production server.' });
});

server.listen(PORT, async () => {
  console.log(`Follower backend listening on http://localhost:${PORT}`);
  console.log(`Reading local config from ${envPath}`);
  if (!fs.existsSync(indexHtmlPath)) console.warn('React build not found. Run npm run build before using kiosk mode.');
  await refresh();
  setInterval(refresh, POLL_INTERVAL_MS);
});

setInterval(() => {
  for (const client of clients) client.write(': heartbeat\n\n');
}, SSE_HEARTBEAT_INTERVAL_MS);
