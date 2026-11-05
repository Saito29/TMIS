import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createApp } from '../backend/server.mjs';

async function fixture(t, options = {}) {
  const dataDir = mkdtempSync(join(tmpdir(), 'tmis-errors-'));
  const server = createApp({ dataDir, origin: 'http://127.0.0.1:0', basePath: '/TMISv1', ...options });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(async () => { await new Promise(resolve => server.close(resolve)); rmSync(dataDir, { recursive: true, force: true }); });
  return { server, origin: `http://127.0.0.1:${server.address().port}` };
}

test('missing pages return branded 404, correct base links, and empty HEAD bodies', async t => {
  const { origin } = await fixture(t);
  const response = await fetch(`${origin}/TMISv1/deep/missing/page`);
  assert.equal(response.status, 404);
  const html = await response.text();
  assert.match(html, /A little off the beaten path/);
  assert.match(html, /href="\/TMISv1\/app\/authentication\/login.html"/);
  assert.match(html, /const serverBase = "\/TMISv1"/);
  const head = await fetch(`${origin}/TMISv1/missing`, { method: 'HEAD' });
  assert.equal(head.status, 404); assert.equal(await head.text(), '');
  const api = await fetch(`${origin}/TMISv1/api/auth/session`);
  assert.equal(api.status, 200); assert.equal((await api.json()).authenticated, false);
});

test('maintenance blocks pages and APIs with 503 without changing API content type', async t => {
  const { origin } = await fixture(t, { maintenance: true });
  const response = await fetch(`${origin}/TMISv1/`);
  assert.equal(response.status, 503);
  assert.equal(response.headers.get('retry-after'), '300');
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.match(await response.text(), /Making space for better/);
  const api = await fetch(`${origin}/TMISv1/api/auth/session`);
  assert.equal(api.status, 503); assert.equal((await api.json()).code, 'MAINTENANCE');
});

test('unexpected page failure returns branded 500', async t => {
  // A throwing clock exercises the actual catch path without a public crash endpoint.
  const { origin } = await fixture(t, { now: () => { throw new Error('private diagnostic'); } });
  const response = await fetch(`${origin}/TMISv1/app/admin/dashboard/dashboard.html`);
  assert.equal(response.status, 500);
  const html = await response.text();
  assert.match(html, /A pause. Not the end/); assert.doesNotMatch(html, /private diagnostic/);
});

test('browser: desktop/mobile pages, retry, back, and standalone assets', async t => {
  const { chromium } = await import('playwright-core');
  const { origin } = await fixture(t);
  const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  t.after(() => browser.close());
  const page = await browser.newPage();
  await page.route('**/*', route => route.request().url().startsWith(origin) ? route.continue() : route.abort());
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    for (const name of ['404', '500', 'maintenance']) {
      await page.goto(`${origin}/TMISv1/app/errors/${name}.html`);
      assert.equal(await page.locator('h1').count(), 1);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      assert.equal(await page.locator('[data-home]').first().getAttribute('href'), '/TMISv1/app/authentication/login.html');
      if (name !== '404') assert.equal(await page.locator('[data-retry]').getAttribute('href'), '/TMISv1/app/authentication/login.html');
      if (process.env.TMIS_ERROR_SCREENSHOTS && width === 1440 && name === '404') await page.screenshot({ path: 'tests/error-page-desktop.png', animations: 'disabled' });
      if (process.env.TMIS_ERROR_SCREENSHOTS && width === 390 && name === 'maintenance') await page.screenshot({ path: 'tests/error-page-mobile.png', animations: 'disabled' });
    }
  }
  await page.goto(`${origin}/TMISv1/app/errors/500.html`);
  await page.goto(`${origin}/TMISv1/app/errors/404.html`, { referer: `${origin}/TMISv1/app/errors/500.html` });
  await page.locator('[data-back]').click();
  await page.waitForURL('**/500.html');
  await page.locator('[data-retry]').click();
  await page.waitForURL('**/authentication/login.html');
  assert.deepEqual(errors, []);
});
