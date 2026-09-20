import { chromium } from 'playwright';
import { expect } from 'playwright/test';

const BASE = process.env.AUDIT_BASE ?? 'http://127.0.0.1:4173';
const WIDTH = Number(process.env.AUDIT_WIDTH ?? 1440);

const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN ?? '/usr/bin/chromium' });
const context = await browser.newContext({ viewport: { width: WIDTH, height: 900 } });
const page = await context.newPage();

const errors = [];
page.on('console', (m) => m.type() === 'error' && errors.push(m.text().slice(0, 160)));
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message.slice(0, 160)}`));

let failed = 0;
async function check(name, fn) {
  const before = errors.length;
  try {
    await fn();
    const fresh = errors.slice(before);
    if (fresh.length) throw new Error(`console: ${fresh.join(' | ')}`);
    console.log(` ok  ${name}`);
  } catch (e) {
    failed++;
    console.log(`FAIL ${name}\n       ${e.message.split('\n')[0].slice(0, 200)}`);
  }
}

const cards = () => page.locator('article');
const search = () => page.getByLabel('Search products or games');

await page.goto(`${BASE}/products`, { waitUntil: 'networkidle' });

await check('products grid renders cards', async () => {
  await expect(cards().first()).toBeVisible();
  const n = await cards().count();
  if (n < 4) throw new Error(`only ${n} cards`);
});

await check('search filters the grid', async () => {
  const all = await cards().count();
  await search().fill('valorant');
  await expect.poll(() => cards().count()).toBeLessThan(all);
  const hits = await cards().count();
  if (hits === 0) throw new Error('search returned nothing');
  const text = (await cards().first().innerText()).toLowerCase();
  if (!text.includes('valorant')) throw new Error(`irrelevant hit: ${text.slice(0, 60)}`);
});

await check('empty state on no match', async () => {
  await search().fill('zzzzqqq');
  await expect.poll(() => cards().count()).toBe(0);
  const body = await page.locator('main').innerText();
  if (!/no|nothing|clear/i.test(body)) throw new Error('no empty-state copy');
});

await check('clear search restores grid', async () => {
  await page.getByLabel('Clear search').click();
  await expect.poll(() => cards().count()).toBeGreaterThan(4);
});

await check('category rail filters', async () => {
  const all = await cards().count();
  await page.getByRole('button', { name: /^Rust\b/ }).first().click();
  await expect.poll(() => cards().count()).toBeLessThan(all);
  await page.getByRole('button', { name: /^All\b/ }).first().click();
  await expect.poll(() => cards().count()).toBe(all);
});

await check('sort control changes order', async () => {
  const first = await cards().first().innerText();
  await page.getByLabel('Sort products').selectOption({ label: 'Price: High to Low' });
  await expect.poll(async () => (await cards().first().innerText()) !== first).toBe(true);
  await page.getByLabel('Sort products').selectOption({ index: 0 });
});

await check('wishlist toggle announces and opens drawer', async () => {
  const card = cards().first();
  await card.hover();
  await card.getByLabel('Add to wishlist').click();
  await expect(page.locator('[role="status"]')).not.toBeEmpty();
  await page.getByLabel('Wishlist', { exact: true }).click();
  await expect(page.getByLabel('Close wishlist')).toBeVisible();
});

await check('Escape closes the wishlist drawer', async () => {
  await page.keyboard.press('Escape');
  await expect(page.getByLabel('Close wishlist')).toBeHidden();
});

await check('quick view opens and Escape closes', async () => {
  const card = cards().first();
  await card.hover();
  await card.getByText('Quick View').click();
  const close = page.getByLabel('Close quick view');
  await expect(close).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(close).toBeHidden();
});

await check('add to cart from quick view lands in the drawer', async () => {
  const card = cards().first();
  await card.hover();
  await card.getByText('Quick View').click();
  await expect(page.getByLabel('Close quick view')).toBeVisible();
  await page.getByRole('button', { name: /Add to Cart/i }).click();
  await page.keyboard.press('Escape');
  await expect(page.getByLabel('Close quick view')).toBeHidden();
  await page.getByLabel('Cart', { exact: true }).click();
  await expect(page.getByLabel('Close cart')).toBeVisible();
  await expect(page.getByLabel('Increase quantity').first()).toBeVisible();
});

await check('cart quantity increases then item removes', async () => {
  await page.getByLabel('Increase quantity').first().click();
  await page.getByLabel('Remove item').first().click();
  await expect(page.getByLabel('Increase quantity')).toHaveCount(0);
});

await check('Escape closes the cart drawer', async () => {
  await page.keyboard.press('Escape');
  await expect(page.getByLabel('Close cart')).toBeHidden();
});

await check('body scroll unlocked after every overlay', async () => {
  await expect.poll(() => page.evaluate(() => getComputedStyle(document.body).overflow)).not.toBe('hidden');
});

await page.goto(`${BASE}/product/rust-nfa`, { waitUntil: 'networkidle' });

await check('product lightbox opens, advances, Escape closes', async () => {
  await page.getByRole('button', { name: /preview$/i }).first().click();
  const close = page.getByLabel('Close preview');
  await expect(close).toBeVisible();
  await page.getByLabel('Next image').click();
  await page.keyboard.press('Escape');
  await expect(close).toBeHidden();
});

await check('product page add to cart announces', async () => {
  await page.getByRole('button', { name: /Add to Cart/i }).first().click();
  await expect(page.locator('[role="status"]')).not.toBeEmpty();
});

await check('recently viewed persists across navigation', async () => {
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  const stored = await page.evaluate(() => localStorage.getItem('nfa-recently-viewed'));
  if (!stored) {
    const keys = await page.evaluate(() => Object.keys(localStorage));
    throw new Error(`no recently-viewed key; have ${keys.join(',')}`);
  }
  if (!JSON.parse(stored).includes('rust-nfa')) throw new Error(`visited product not recorded: ${stored}`);
});

await check('global search overlay opens via keyboard', async () => {
  await page.keyboard.press('Control+k');
  const input = page.getByPlaceholder('Search products, games...');
  await expect(input).toBeVisible();
  await input.fill('rust');
  await page.keyboard.press('Escape');
  await expect(input).toBeHidden();
});

await check('product belt pauses on hover', async () => {
  const belt = page.locator('.marquee-track').first();
  await expect(belt).toBeVisible();
  const before = await belt.evaluate((el) => getComputedStyle(el).animationPlayState);
  await belt.hover();
  await expect
    .poll(() => belt.evaluate((el) => getComputedStyle(el).animationPlayState))
    .toBe('paused');
  if (before !== 'running') throw new Error(`belt was not animating to begin with (${before})`);
});

await browser.close();
console.log(`\n${failed === 0 ? 'ALL INTERACTIONS OK' : `${failed} interaction check(s) failed`} @ ${WIDTH}px`);
process.exit(failed === 0 ? 0 : 1);
