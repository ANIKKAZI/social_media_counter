/**
 * CRA development proxy – Instagram live follower count lookup.
 *
 * How it works (mirrors exactly what a browser does):
 *
 *  Phase 1 – Bootstrap:
 *    a) GET instagram.com/          → set-cookie: mid, ig_did, csrftoken …
 *    b) GET instagram.com/{user}/   → set-cookie: (more, refreshed csrftoken)
 *    Cookies are accumulated from EVERY redirect hop in both requests.
 *
 *  Phase 2 – Fetch (strategies tried in order until one succeeds):
 *    1. web_profile_info internal API  (exact live DB count)
 *    2. oembed endpoint                (existence check only)
 *
 *  Key headers:
 *    Cookie:       full accumulated session cookie string
 *    X-CSRFToken:  value of the csrftoken cookie (Instagram CSRF guard)
 */

const https = require('https');

// ─────────────────────────────────────────────────────────────────────────────
// Cookie utilities
// ─────────────────────────────────────────────────────────────────────────────

function parseSetCookies(setCookieHeaders) {
  const map = new Map();
  if (!setCookieHeaders) return map;
  const arr = Array.isArray(setCookieHeaders) ? setCookieHeaders : [setCookieHeaders];
  for (const raw of arr) {
    const nameVal = raw.split(';')[0].trim();
    const eq = nameVal.indexOf('=');
    if (eq > 0) map.set(nameVal.slice(0, eq).trim(), nameVal.slice(eq + 1).trim());
  }
  return map;
}

function mergeCookies(cookieMap, setCookieHeaders) {
  for (const [k, v] of parseSetCookies(setCookieHeaders)) cookieMap.set(k, v);
}

function serializeCookies(cookieMap) {
  return [...cookieMap.entries()].map(([k, v]) => `${k}=${v}`).join('; ');
}

// ─────────────────────────────────────────────────────────────────────────────
// HTTPS helper — follows redirects, accumulates Set-Cookie across all hops
// ─────────────────────────────────────────────────────────────────────────────

function httpsGet(url, headers = {}, cookieJar = new Map(), maxRedirects = 6) {
  return new Promise((resolve, reject) => {
    const agent = new https.Agent({ keepAlive: false });

    const doRequest = (currentUrl, redirectsLeft) => {
      const parsed = new URL(currentUrl);
      const cookieStr = serializeCookies(cookieJar);
      const reqHeaders = { ...headers, ...(cookieStr ? { Cookie: cookieStr } : {}) };

      const req = https.request(
        { hostname: parsed.hostname, path: parsed.pathname + parsed.search, method: 'GET',
          headers: reqHeaders, timeout: 12_000, agent },
        (res) => {
          mergeCookies(cookieJar, res.headers['set-cookie']);
          if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location && redirectsLeft > 0) {
            res.resume();
            return doRequest(new URL(res.headers.location, currentUrl).href, redirectsLeft - 1);
          }
          let body = '';
          res.setEncoding('utf8');
          res.on('data', (c) => (body += c));
          res.on('end', () => resolve({ statusCode: res.statusCode, body, responseHeaders: res.headers }));
        }
      );
      req.on('error', reject);
      req.on('timeout', () => { req.destroy(); reject(new Error('Request timed out')); });
      req.end();
    };

    doRequest(url, maxRedirects);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Session bootstrap — get anonymous cookies from homepage
// ─────────────────────────────────────────────────────────────────────────────

const BASE_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const BASE_HEADERS = {
  'User-Agent': BASE_UA,
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'identity',
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache',
  'sec-ch-ua': '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Windows"',
};

/**
 * Phase a: hit homepage  → collect mid, ig_did, initial csrftoken
 * Phase b: hit profile    → refresh csrftoken, get session-specific cookies
 *
 * Returns { cookieJar (Map), csrfToken (string) }
 */
async function bootstrapSession(username) {
  const jar = new Map();

  const baseHeaders = {
    ...BASE_HEADERS,
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Upgrade-Insecure-Requests': '1',
  };

  // Phase a: homepage — establishes mid + ig_did + first csrftoken
  try {
    await httpsGet('https://www.instagram.com/', baseHeaders, jar);
  } catch (e) {
    console.warn('[instagram-proxy] homepage fetch failed:', e.message);
  }

  // Phase b: profile page — refreshes csrftoken, adds viewport cookies
  try {
    await httpsGet(`https://www.instagram.com/${encodeURIComponent(username)}/`, baseHeaders, jar);
  } catch (e) {
    console.warn('[instagram-proxy] profile prefetch failed:', e.message);
  }

  const csrfToken = jar.get('csrftoken') || '';
  console.log(`[instagram-proxy] cookies bootstrapped for @${username} | csrftoken=${csrfToken ? csrfToken.slice(0, 8) + '…' : 'MISSING'} | total=${jar.size}`);
  return { cookieJar: jar, csrfToken };
}

// ─────────────────────────────────────────────────────────────────────────────
// Strategy 1 — web_profile_info (exact live count)
// ─────────────────────────────────────────────────────────────────────────────

async function tryWebProfileInfo(username, cookieJar, csrfToken) {
  try {
    const url = `https://www.instagram.com/api/v1/users/web_profile_info/?username=${encodeURIComponent(username)}`;
    const res = await httpsGet(url, {
      ...BASE_HEADERS,
      'Accept': '*/*',
      'X-IG-App-ID': '936619743392459',
      'X-IG-WWW-Claim': '0',
      'X-CSRFToken': csrfToken,
      'X-Requested-With': 'XMLHttpRequest',
      'Sec-Fetch-Site': 'same-origin',
      'Sec-Fetch-Mode': 'cors',
      'Referer': `https://www.instagram.com/${encodeURIComponent(username)}/`,
    }, cookieJar);

    console.log(`[instagram-proxy] web_profile_info → HTTP ${res.statusCode}`);

    if (res.statusCode === 404) {
      return { username, followerCount: null, status: 'not_found', message: 'Instagram account not found.', dataSource: 'none' };
    }
    if (res.statusCode !== 200) return null;

    let json;
    try { json = JSON.parse(res.body); } catch { return null; }

    const user = json?.data?.user;
    if (!user) { console.warn('[instagram-proxy] web_profile_info: unexpected JSON shape'); return null; }

    const isPrivate     = !!user.is_private;
    const followerCount = user.edge_followed_by?.count ?? user.follower_count ?? null;
    const followsCount  = user.edge_follow?.count ?? user.following_count ?? null;
    const mediaCount    = user.edge_owner_to_timeline_media?.count ?? user.media_count ?? null;

    if (isPrivate && followerCount == null) {
      return { username, followerCount: null, status: 'private', message: 'Private account — follower count unavailable.', dataSource: 'web_profile_info' };
    }
    if (followerCount != null) {
      return { username, followerCount, followsCount, mediaCount, status: 'found', message: null, dataSource: 'web_profile_info' };
    }
    return null;
  } catch (e) {
    console.warn('[instagram-proxy] web_profile_info exception:', e.message);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Strategy 2 — oembed (existence check only, no follower count)
// ─────────────────────────────────────────────────────────────────────────────

async function tryOembed(username) {
  try {
    const profileUrl = `https://www.instagram.com/${encodeURIComponent(username)}/`;
    const res = await httpsGet(
      `https://api.instagram.com/oembed/?url=${encodeURIComponent(profileUrl)}`,
      { ...BASE_HEADERS, 'Accept': 'application/json' }
    );
    console.log(`[instagram-proxy] oembed → HTTP ${res.statusCode}`);
    if (res.statusCode === 404) {
      return { username, followerCount: null, status: 'not_found', message: 'Instagram account not found.', dataSource: 'none' };
    }
    if (res.statusCode === 200) {
      return { username, followerCount: null, status: 'unavailable', message: 'Account exists but follower count is unavailable. Try again later.', dataSource: 'oembed' };
    }
    return null;
  } catch (e) {
    console.warn('[instagram-proxy] oembed exception:', e.message);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Express middleware
// ─────────────────────────────────────────────────────────────────────────────

module.exports = function (app) {
  app.get('/api/instagram/lookup/:username', async (req, res) => {
    res.set({
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store',
    });

    try {
      const username = (req.params.username || '').toLowerCase().trim();
      if (!/^[a-z0-9._]{1,30}$/.test(username)) {
        return res.status(400).json({ success: false, error: { message: 'Invalid Instagram username format.' } });
      }

      console.log(`[instagram-proxy] lookup @${username}`);

      const { cookieJar, csrfToken } = await bootstrapSession(username);

      let result = await tryWebProfileInfo(username, cookieJar, csrfToken);
      if (!result) result = await tryOembed(username);
      if (!result) {
        result = {
          username,
          followerCount: null,
          status: 'unavailable',
          message: 'Could not retrieve follower count. Instagram may be blocking requests.',
          dataSource: 'none',
        };
      }

      console.log(`[instagram-proxy] result @${username}: source=${result.dataSource} count=${result.followerCount}`);
      return res.json({ success: true, data: result });
    } catch (err) {
      console.error('[instagram-proxy] unexpected error:', err);
      return res.status(500).json({ success: false, error: { message: 'Internal proxy error.' } });
    }
  });
};

