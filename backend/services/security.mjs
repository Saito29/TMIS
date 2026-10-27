import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, timingSafeEqual, scrypt as scryptCallback } from 'node:crypto';
import { promisify } from 'node:util';
const scrypt = promisify(scryptCallback);
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
export const digest = value => createHash('sha256').update(String(value)).digest('hex');
export function base32(bytes) {
  let bits = 0, value = 0, output = '';
  for (const byte of bytes) { value = (value << 8) | byte; bits += 8; while (bits >= 5) { output += alphabet[(value >>> (bits - 5)) & 31]; bits -= 5; } }
  if (bits) output += alphabet[(value << (5 - bits)) & 31];
  return output;
}
export function decode32(text) {
  let bits = 0, value = 0; const bytes = [];
  for (const char of text.toUpperCase().replace(/=+$/, '')) {
    const index = alphabet.indexOf(char); if (index < 0) throw new Error('Invalid authenticator secret');
    value = (value << 5) | index; bits += 5; if (bits >= 8) { bytes.push((value >>> (bits - 8)) & 255); bits -= 8; }
  }
  return Buffer.from(bytes);
}
export function totp(secret, step = Math.floor(Date.now() / 30000), digits = 6, algorithm = 'sha1') {
  const counter = Buffer.alloc(8); counter.writeBigUInt64BE(BigInt(step));
  const hash = createHmac(algorithm, decode32(secret)).update(counter).digest();
  const offset = hash.at(-1) & 15;
  return String((hash.readUInt32BE(offset) & 0x7fffffff) % (10 ** digits)).padStart(digits, '0');
}
export function verifyTotp(secret, code, lastStep = -1, now = Date.now()) {
  if (typeof code !== 'string' || !/^\d{6}$/.test(code)) return null;
  const current = Math.floor(now / 30000);
  for (const step of [current, current - 1, current + 1]) {
    if (step >= 0 && step > lastStep && timingSafeEqual(Buffer.from(totp(secret, step)), Buffer.from(code))) return step;
  }
  return null;
}
export function encrypt(secret, key) {
  const iv = randomBytes(12), cipher = createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(secret, 'utf8'), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString('base64url');
}
export function decrypt(value, key) {
  const bytes = Buffer.from(value, 'base64url'), decipher = createDecipheriv('aes-256-gcm', key, bytes.subarray(0, 12));
  decipher.setAuthTag(bytes.subarray(12, 28)); return Buffer.concat([decipher.update(bytes.subarray(28)), decipher.final()]).toString('utf8');
}
export function validPassword(value) { return typeof value === 'string' && value.length >= 8 && value.length <= 128 && /[A-Z]/.test(value) && /[a-z]/.test(value) && /\d/.test(value) && /[^\p{L}\p{N}\s]/u.test(value); }
export async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = await scrypt(password, salt, 64, { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
  return `scrypt$${salt}$${hash.toString('hex')}`;
}
export async function verifyPassword(password, stored) {
  if (typeof password !== 'string' || password.length > 128) return false;
  const [scheme, salt, hex] = String(stored).split('$'); if (scheme !== 'scrypt' || !salt || !hex) return false;
  const hash = await scrypt(password, salt, 64, { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
  const expected = Buffer.from(hex, 'hex'); return expected.length === hash.length && timingSafeEqual(hash, expected);
}
export const newSecret = () => base32(randomBytes(20));
export const newRecoveryCodes = () => Array.from({ length: 10 }, () => randomBytes(10).toString('hex').match(/.{1,5}/g).join('-'));
export const recoveryHash = code => digest(String(code).replace(/[-\s]/g, '').toLowerCase());
