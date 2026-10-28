import http from 'node:http';
import { DatabaseSync } from 'node:sqlite';
import { randomBytes, randomUUID, timingSafeEqual } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { resolve, dirname, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import QRCode from 'qrcode';
import { digest, encrypt, decrypt, hashPassword, verifyPassword, validPassword, newSecret, newRecoveryCodes, recoveryHash, verifyTotp } from './services/security.mjs';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const hour = 3600000;
class ApiError extends Error { constructor(status, message, code) { super(message); this.status = status; this.code = code; } }
const fail = (status, message, code) => { throw new ApiError(status, message, code); };
export function createApp({ dataDir = resolve(root, 'backend/.data'), origin = 'http://127.0.0.1:3001', basePath = '/TMIS', now = () => Date.now() } = {}) {
  const publicUrl = new URL(origin); basePath = basePath.replace(/\/$/, '');
  mkdirSync(dataDir, { recursive: true, mode: 0o700 });
  const keyPath = resolve(dataDir, 'auth.key');
  if (!existsSync(keyPath)) writeFileSync(keyPath, randomBytes(32), { mode: 0o600, flag: 'wx' });
  const key = readFileSync(keyPath); if (key.length !== 32) throw new Error('Invalid authentication encryption key');
  const db = new DatabaseSync(resolve(dataDir, 'auth.sqlite'));
  db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;
    CREATE TABLE IF NOT EXISTS users(id TEXT PRIMARY KEY,email TEXT UNIQUE NOT NULL,password TEXT NOT NULL,profile TEXT NOT NULL,mfa_secret TEXT,last_step INTEGER NOT NULL DEFAULT -1,recovery TEXT NOT NULL DEFAULT '[]');
    CREATE TABLE IF NOT EXISTS sessions(id TEXT PRIMARY KEY,user_id TEXT,challenge_user TEXT,csrf TEXT NOT NULL,expires INTEGER NOT NULL,authenticated_at INTEGER,pending_secret TEXT,pending_expires INTEGER);
    CREATE TABLE IF NOT EXISTS limits(id TEXT PRIMARY KEY,count INTEGER NOT NULL,expires INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS audit(id TEXT PRIMARY KEY,user_id TEXT,category TEXT NOT NULL,title TEXT NOT NULL,date TEXT NOT NULL);
  `);
  let dummyPassword;
  const dummy = () => dummyPassword ||= hashPassword(randomBytes(24).toString('hex'));
  const cookieName = 'tmis_sid';
  const cookie = (res, token, seconds = 8 * 3600) => res.setHeader('Set-Cookie', `${cookieName}=${token}; HttpOnly; SameSite=Strict; Path=${basePath || '/'}; Max-Age=${seconds}${publicUrl.protocol === 'https:' ? '; Secure' : ''}`);
  const audit = (userId, category, title) => db.prepare('INSERT INTO audit VALUES(?,?,?,?,?)').run(randomUUID(), userId || null, category, title, new Date(now()).toISOString());
  const safeUser = user => { const profile = JSON.parse(user.profile); return { ...profile, id: user.id, email: user.email }; };
  const getUser = id => db.prepare('SELECT * FROM users WHERE id=?').get(id);
  const available = user => user && /^(active|approved|accepted|approved\s*&\s*accepted)$/i.test(String(safeUser(user).status));
  function session(req, res) {
    const token = /(?:^|;\s*)tmis_sid=([a-f0-9]{64})(?:;|$)/.exec(req.headers.cookie || '')?.[1];
    let current = token ? db.prepare('SELECT * FROM sessions WHERE id=? AND expires>?').get(digest(token), now()) : null;
    if (!current) {
      const raw = randomBytes(32).toString('hex'), id = digest(raw);
      db.prepare('INSERT INTO sessions(id,csrf,expires) VALUES(?,?,?)').run(id, randomBytes(32).toString('hex'), now() + hour);
      cookie(res, raw, 3600); current = db.prepare('SELECT * FROM sessions WHERE id=?').get(id);
    }
    return current;
  }
  function rotate(res, previous, userId, challengeUser = null) {
    const token = randomBytes(32).toString('hex'), id = digest(token), expires = now() + (challengeUser ? 300000 : 8 * hour);
    db.prepare('DELETE FROM sessions WHERE id=?').run(previous.id);
    db.prepare('INSERT INTO sessions(id,user_id,challenge_user,csrf,expires,authenticated_at) VALUES(?,?,?,?,?,?)').run(id, userId, challengeUser, randomBytes(32).toString('hex'), expires, userId ? now() : null);
    cookie(res, token, challengeUser ? 300 : 8 * 3600);
    return db.prepare('SELECT * FROM sessions WHERE id=?').get(id);
  }
  function limit(name, max = 5, duration = 900000) {
    const id = digest(name), entry = db.prepare('SELECT * FROM limits WHERE id=?').get(id);
    if (entry && entry.expires > now() && entry.count >= max) fail(429, 'Too many attempts. Try again in 15 minutes.');
    if (!entry || entry.expires <= now()) db.prepare('INSERT OR REPLACE INTO limits VALUES(?,?,?)').run(id, 1, now() + duration);
    else db.prepare('UPDATE limits SET count=count+1 WHERE id=?').run(id);
  }
  function authenticated(current) {
    const user = current.user_id && getUser(current.user_id);
    if (!available(user)) fail(401, 'Sign in to continue.', 'SIGN_IN_REQUIRED');
    return user;
  }
  async function requirePassword(user, password, req, current) {
    limit(`reauth:${user.id}:${req.socket.remoteAddress}`, 8);
    if (!db.prepare('SELECT id FROM sessions WHERE id=? AND expires>?').get(current.id, now())) fail(401, 'Sign in to continue.');
    if (!await verifyPassword(password, user.password) || getUser(user.id)?.password !== user.password) { audit(user.id, 'security', 'Password verification failed'); fail(400, 'The password could not be verified.'); }
    if (!db.prepare('SELECT id FROM sessions WHERE id=? AND expires>?').get(current.id, now())) fail(401, 'Sign in to continue.');
  }
  function factor(user, code) {
    if (!user.mfa_secret) return false;
    const step = verifyTotp(decrypt(user.mfa_secret, key), code, user.last_step, now());
    if (step !== null) { db.prepare('UPDATE users SET last_step=? WHERE id=?').run(step, user.id); return true; }
    if (typeof code !== 'string' || !/^[a-f0-9-]{20,23}$/i.test(code.replace(/\s/g, ''))) return false;
    const hashes = JSON.parse(user.recovery), index = hashes.indexOf(recoveryHash(code));
    if (index < 0) return false;
    hashes.splice(index, 1); db.prepare('UPDATE users SET recovery=? WHERE id=?').run(JSON.stringify(hashes), user.id);
    audit(user.id, 'security', 'Recovery code used'); return true;
  }
  function newCodes(userId) {
    const codes = newRecoveryCodes(); db.prepare('UPDATE users SET recovery=? WHERE id=?').run(JSON.stringify(codes.map(recoveryHash)), userId); return codes;
  }
  function sessionInfo(current) {
    const user = current.user_id && getUser(current.user_id);
    return { authenticated: !!available(user), user: available(user) ? safeUser(user) : null, csrf: current.csrf, mfaRequired: !!current.challenge_user, setupRequired: !db.prepare('SELECT id FROM users LIMIT 1').get() };
  }
  async function readBody(req) {
    if (!/^application\/json(?:;|$)/i.test(req.headers['content-type'] || '')) fail(415, 'Send JSON data.');
    let size = 0, chunks = [];
    for await (const chunk of req) { size += chunk.length; if (size > 16384) fail(413, 'Request is too large.'); chunks.push(chunk); }
    try { const body = JSON.parse(Buffer.concat(chunks).toString()); if (!body || Array.isArray(body) || typeof body !== 'object') throw new Error(); return body; }
    catch { fail(400, 'Invalid request data.'); }
  }
  function json(res, data, status = 200) { res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' }); res.end(JSON.stringify(data)); }
  async function api(req, res, path) {
    db.prepare('DELETE FROM sessions WHERE expires<=?').run(now()); db.prepare('DELETE FROM limits WHERE expires<=?').run(now());
    const current = session(req, res);
    if (req.method === 'GET' && path === '/session') return json(res, sessionInfo(current));
    let body = {};
    if (req.method !== 'GET') {
      if (req.method !== 'POST') fail(405, 'Method not allowed.');
      if (req.headers.origin !== publicUrl.origin) fail(403, 'Untrusted request origin.');
      const csrf = req.headers['x-csrf-token'];
      if (typeof csrf !== 'string' || csrf.length !== current.csrf.length || !timingSafeEqual(Buffer.from(csrf), Buffer.from(current.csrf))) fail(403, 'Refresh the page and try again.', 'CSRF_INVALID');
      body = await readBody(req);
    }
    if (path === '/setup' && req.method === 'POST') {
      const local = ['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(req.socket.remoteAddress);
      if (!local || !['localhost', '127.0.0.1', '[::1]'].includes(publicUrl.hostname) || db.prepare('SELECT id FROM users LIMIT 1').get()) fail(403, 'Initial account setup is unavailable.');
      limit('initial-setup', 8);
      const email = String(body.email || '').trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 160 || !validPassword(body.password)) fail(400, 'Enter a valid email and a password meeting all five requirements.');
      const profile = {};
      for (const field of ['firstName','middleName','lastName','suffix','dateOfBirth','phone','region','office','position']) profile[field] = String(body[field] || '').trim().slice(0, 160);
      if (!profile.firstName || !profile.lastName) fail(400, 'Enter your first and last name.');
      profile.id = typeof body.id === 'string' && /^[A-Za-z0-9_-]{1,80}$/.test(body.id) ? body.id : randomUUID();
      profile.email = email; profile.role = 'System Administrator'; profile.status = 'Approved & Accepted';
      const originalDate = Date.parse(body.createdAt);
      profile.createdAt = Number.isFinite(originalDate) && originalDate <= now() ? new Date(originalDate).toISOString() : new Date(now()).toISOString();
      profile.updatedAt = new Date(now()).toISOString();
      const password = await hashPassword(body.password);
      // Recheck after asynchronous hashing: only the first request can create the bootstrap account.
      if (db.prepare('SELECT id FROM users LIMIT 1').get()) fail(409, 'Initial setup is already complete. Sign in instead.');
      db.prepare('INSERT INTO users(id,email,password,profile) VALUES(?,?,?,?)').run(profile.id, email, password, JSON.stringify(profile));
      audit(profile.id, 'security', 'Account sign-in created');
      return json(res, sessionInfo(rotate(res, current, profile.id)));
    }
    if (path === '/login' && req.method === 'POST') {
      const email = String(body.email || '').trim().toLowerCase().slice(0, 160);
      limit(`login-ip:${req.socket.remoteAddress}`, 30); limit(`login-account:${email}`, 10);
      let user = db.prepare('SELECT * FROM users WHERE email=?').get(email);
      const validatedHash = user?.password;
      const valid = await verifyPassword(body.password, validatedHash || await dummy());
      if (user) user = getUser(user.id);
      if (!valid || !available(user) || user.password !== validatedHash) { audit(user?.id, 'security', 'Sign-in failed'); fail(401, 'Email or password could not be verified.'); }
      if (user.mfa_secret) return json(res, sessionInfo(rotate(res, current, null, user.id)));
      audit(user.id, 'security', 'Signed in'); return json(res, sessionInfo(rotate(res, current, user.id)));
    }
    if (path === '/login/verify' && req.method === 'POST') {
      const user = current.challenge_user && getUser(current.challenge_user);
      if (!available(user)) fail(401, 'Start sign-in again.');
      limit(`login-factor:${user.id}`);
      if (!factor(user, body.code)) { audit(user.id, 'security', 'Two-step sign-in failed'); fail(400, 'The code is invalid, expired, or already used.'); }
      audit(user.id, 'security', 'Signed in with two-step verification'); return json(res, sessionInfo(rotate(res, current, user.id)));
    }
    if (path === '/logout' && req.method === 'POST') {
      if (current.user_id) audit(current.user_id, 'security', 'Signed out');
      db.prepare('DELETE FROM sessions WHERE id=?').run(current.id); cookie(res, '', 0); return json(res, { success: true });
    }
    let user = authenticated(current);
    if (path === '/security' && req.method === 'GET') return json(res, { enabled: !!user.mfa_secret, recoveryRemaining: JSON.parse(user.recovery).length, sessionExpiresAt: new Date(current.expires).toISOString(), passwordChangeAvailable: now() - current.authenticated_at < 300000 });
    if (path === '/logs' && req.method === 'GET') return json(res, { logs: db.prepare('SELECT id,category,title,date FROM audit WHERE user_id=? ORDER BY date DESC LIMIT 100').all(user.id) });
    if (path === '/mfa/setup' && req.method === 'POST') {
      if (user.mfa_secret) fail(409, 'Two-step verification is already enabled.');
      await requirePassword(user, body.password, req, current);
      user = getUser(user.id);
      if (user.mfa_secret) fail(409, 'Two-step verification is already enabled.');
      const secret = newSecret(), expires = now() + 600000;
      db.prepare('UPDATE sessions SET pending_secret=?,pending_expires=? WHERE id=?').run(encrypt(secret, key), expires, current.id);
      const uri = `otpauth://totp/${encodeURIComponent(`TMIS:${user.email}`)}?secret=${secret}&issuer=TMIS&algorithm=SHA1&digits=6&period=30`;
      const qr = await QRCode.toDataURL(uri, { errorCorrectionLevel: 'M', width: 240, margin: 2 });
      return json(res, { secret, qr, expiresAt: new Date(expires).toISOString() });
    }
    if (path === '/mfa/cancel' && req.method === 'POST') { db.prepare('UPDATE sessions SET pending_secret=NULL,pending_expires=NULL WHERE id=?').run(current.id); return json(res, { success: true }); }
    if (path === '/mfa/enable' && req.method === 'POST') {
      limit(`enable-factor:${user.id}`);
      if (user.mfa_secret || !current.pending_secret || current.pending_expires <= now()) fail(400, 'Setup has expired. Start again.');
      const step = verifyTotp(decrypt(current.pending_secret, key), body.code, -1, now());
      if (step === null) fail(400, 'Enter a current six-digit authenticator code.');
      db.exec('BEGIN IMMEDIATE');
      let codes;
      try {
        db.prepare('UPDATE users SET mfa_secret=?,last_step=? WHERE id=?').run(current.pending_secret, step, user.id);
        codes = newCodes(user.id);
        db.prepare('DELETE FROM sessions WHERE (user_id=? OR challenge_user=?) AND id<>?').run(user.id, user.id, current.id);
        db.prepare('UPDATE sessions SET pending_secret=NULL,pending_expires=NULL,authenticated_at=? WHERE id=?').run(now(), current.id);
        audit(user.id, 'security', 'Two-step verification enabled'); db.exec('COMMIT');
      } catch (error) { db.exec('ROLLBACK'); throw error; }
      return json(res, { enabled: true, recoveryCodes: codes });
    }
    if (['/mfa/disable', '/mfa/recovery'].includes(path) && req.method === 'POST') {
      if (!user.mfa_secret) fail(409, 'Two-step verification is not enabled.');
      await requirePassword(user, body.password, req, current); user = getUser(user.id); limit(`manage-factor:${user.id}`);
      if (!factor(user, body.code)) fail(400, 'The verification or recovery code is invalid, expired, or already used.');
      if (path === '/mfa/recovery') { const codes = newCodes(user.id); audit(user.id, 'security', 'Recovery codes regenerated'); return json(res, { recoveryCodes: codes }); }
      db.prepare("UPDATE users SET mfa_secret=NULL,last_step=-1,recovery='[]' WHERE id=?").run(user.id);
      db.prepare('DELETE FROM sessions WHERE (user_id=? OR challenge_user=?) AND id<>?').run(user.id, user.id, current.id);
      audit(user.id, 'security', 'Two-step verification disabled'); return json(res, { enabled: false });
    }
    if (path === '/password' && req.method === 'POST') {
      if (now() - current.authenticated_at >= 300000) fail(403, 'Sign in again before changing your password.', 'REAUTH_REQUIRED');
      if (!validPassword(body.password)) fail(400, 'The new password must meet all five requirements.');
      if (user.mfa_secret) { limit(`password-factor:${user.id}`); if (!factor(user, body.code)) fail(400, 'Enter a current authenticator or unused recovery code.'); }
      const hash = await hashPassword(body.password);
      if (!db.prepare('SELECT id FROM sessions WHERE id=? AND expires>?').get(current.id, now()) || getUser(user.id)?.password !== user.password) fail(401, 'Sign in again before changing your password.');
      db.prepare('UPDATE users SET password=? WHERE id=?').run(hash, user.id);
      db.prepare('DELETE FROM sessions WHERE (user_id=? OR challenge_user=?) AND id<>?').run(user.id, user.id, current.id);
      audit(user.id, 'security', 'Password changed'); return json(res, sessionInfo(rotate(res, current, user.id)));
    }
    fail(404, 'Endpoint not found.');
  }
  const types = { '.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.woff':'font/woff','.woff2':'font/woff2','.ico':'image/x-icon' };
  const server = http.createServer(async (req, res) => {
    res.setHeader('Cache-Control', 'no-store'); res.setHeader('X-Content-Type-Options', 'nosniff'); res.setHeader('X-Frame-Options', 'DENY'); res.setHeader('Referrer-Policy', 'same-origin');
    try {
      if (req.headers.host !== publicUrl.host) fail(403, 'Untrusted host.');
      const url = new URL(req.url, publicUrl);
      if (!(url.pathname === basePath || url.pathname.startsWith(`${basePath}/`))) fail(404, 'Page not found.');
      const path = decodeURIComponent(url.pathname.slice(basePath.length) || '/');
      if (path.startsWith('/api/auth/')) return await api(req, res, path.slice('/api/auth'.length));
      if (!['GET','HEAD'].includes(req.method)) fail(405, 'Method not allowed.');
      if (path.startsWith('/app/admin/')) {
        const current = session(req, res);
        if (!current.user_id || !available(getUser(current.user_id))) { res.writeHead(302, { Location: `${basePath}/app/authentication/login.html` }); return res.end(); }
      }
      const relative = path === '/' ? 'app/authentication/login.html' : path.replace(/^\//, '');
      if (!/^(app\/|src\/|assets\/)/.test(relative) || relative.split('/').some(part => part.startsWith('.')) || ['.jsx','.php'].includes(extname(relative))) fail(404, 'Page not found.');
      const file = resolve(root, relative);
      if (!file.startsWith(root + sep) || !existsSync(file) || !statSync(file).isFile()) fail(404, 'Page not found.');
      res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream' }); res.end(req.method === 'HEAD' ? undefined : readFileSync(file));
    } catch (error) { json(res, { error: error.status ? error.message : 'The request could not be completed.', code: error.code || null }, error.status || 500); }
  });
  server.on('listening', () => { if (publicUrl.port === '0') publicUrl.port = String(server.address().port); });
  server.requestTimeout = 15000; server.headersTimeout = 10000;
  server.on('close', () => db.close());
  return server;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.env.TMIS_ENABLE_AUTH_BACKEND !== 'true') {
    console.log('Authentication backend is disabled. Set TMIS_ENABLE_AUTH_BACKEND=true when you are ready to enable it.');
  } else {
  const port = Number(process.env.TMIS_PORT || 3001), host = process.env.TMIS_HOST || '127.0.0.1';
  const origin = process.env.TMIS_ORIGIN || `http://${host}:${port}`;
  const server = createApp({ origin, basePath: process.env.TMIS_BASE_PATH || '/TMIS', ...(process.env.TMIS_DATA_DIR ? { dataDir: resolve(process.env.TMIS_DATA_DIR) } : {}) });
  server.listen(port, host, () => console.log(`TMIS authentication server: ${origin}${process.env.TMIS_BASE_PATH || '/TMIS'}/app/authentication/login.html`));
}
}
