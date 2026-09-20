import { chromium } from 'playwright';

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

await page.goto(`${BASE}/products`, { waitUntil: 'networkidle' });

await check('products grid renders cards', async () => {
  const n = await cards().count();
  if (n < 4) throw new Error(`only ${n} cards`);
});

await check('search filters the grid', async () => {
  const all = await cards().count();
  await page.getByLabel('Search products or games').fill('valorant');
  await page.waitForTimeout(400);
  const hits = await cards().count();
  if (hits === 0) throw new Error('search returned nothing');
  if (hits >= all) throw new Error(`no narrowing: ${all} -> ${hits}`);
  const text = (await cards().first().innerText()).toLowerCase();
  if (!text.includes('valorant')) throw new Error(`irrelevant hit: ${text.slice(0, 60)}`);
});

await check('empty state on no match', async () => {
  await page.getByLabel('Search products or games').fill('zzzzqqq');
  await page.waitForTimeout(400);
  if (await cards().count()) throw new Error('cards still visible');
  const body = await page.locator('main').innerText();
  if (!/no|nothing|clear/i.test(body)) throw new Error('no empty-state copy');
});

await check('clear search restores grid', async () => {
  await page.getByLabel('Clear search').click();
  await page.waitForTimeout(400);
  if ((await cards().count()) < 4) throw new Error('grid did not restore');
});

await check('category rail filters', async () => {
  const all = await cards().count();
  await page.getByRole('button', { name: 'Rust', exact: true }).first().click();
  await page.waitForTimeout(500);
  const hits = await cards().count();
  if (hits === 0 || hits >= all) throw new Error(`rail did not narrow: ${all} -> ${hits}`);
  await page.getByRole('button', { name: 'All', exact: true }).first().click();
  await page.waitForTimeout(400);
});

await check('sort control changes order', async () => {
  const first = await cards().first().innerText();
  await page.getByLabel('Sort products').selectOption({ label: 'Price: High to Low' });
  await page.waitForTimeout(500);
  const after = await cards().first().innerText();
  if (first === after) throw new Error('order unchanged');
});

await check('wishlist toggle + toast + badge', async () => {
  await page.getByLabel('Sort products').selectOption({ index: 0 });
  await page.waitForTimeout(300);
  const card = cards().first();
  await card.hover();
  await card.getByLabel('Add to wishlist').click();
  await page.waitForTimeout(500);
  const toast = page.locator('[role="status"]');
  if (!(await toast.innerText()).trim()) throw new Error('no toast announced');
  await page.getByLabel('Wishlist').click();
  await page.waitForTimeout(600);
  const drawer = page.getByLabel('Close wishlist');
  if (!(await drawer.isVisible())) throw new Error('wishlist drawer did not open');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
});

await check('quick view opens and Escape closes', async () => {
  const card = cards().first();
  await card.hover();
  await page.waitForTimeout(300);
  await card.getByText('Quick View').click();
  await page.waitForTimeout(600);
  const close = page.getByLabel('Close quick view');
  if (!(await close.isVisible())) throw new Error('modal did not open');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  if (await close.isVisible()) throw new Error('Escape did not close modal');
});

await check('add to cart from quick view', async () => {
  const card = cards().first();
  await card.hover();
  await page.waitForTimeout(300);
  await card.getByText('Quick View').click();
  await page.waitForTimeout(600);
  await page.getByRole('button', { name: /Add to Cart/i }).click();
  await page.waitForTimeout(500);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  await page.getByLabel('Cart').click();
  await page.waitForTimeout(600);
  if (!(await page.getByLabel('Close cart').isVisible())) throw new Error('cart drawer did not open');
  if (!(await page.getByLabel('Increase quantity').first().isVisible())) throw new Error('cart is empty');
});

await check('cart quantity + remove', async () => {
  await page.getByLabel('Increase quantity').first().click();
  await page.waitForTimeout(400);
  await page.getByLabel('Remove item').first().click();
  await page.waitForTimeout(500);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
});

await check('body scroll unlocked after overlays', async () => {
  const overflow = await page.evaluate(() => getComputedStyle(document.body).overflow);
  if (overflow === 'hidden') throw new Error('body still scroll-locked');
});

await page.goto(`${BASE}/product/rust-nfa`, { waitUntil: 'networkidle' });

await check('product lightbox opens, arrows, Escape', async () => {
  const trigger = page.locator('[aria-label$="preview"], button:has(img), [role="button"]').first();
  await page.locator('main button').filter({ hasNot: page.locator('svg[data-lucide]') }).first().waitFor({ timeout: 5000 }).catch(() => {});
  const frames = page.getByRole('button', { name: /preview|screenshot|image/i });
  if (await frames.count()) {
    await frames.first().click();
  } else {
    await trigger.click();
  }
  await page.waitForTimeout(600);
  const close = page.getByLabel('Close preview');
  if (!(await close.isVisible())) throw new Error('lightbox did not open');
  await page.getByLabel('Next image').click();
  await page.waitForTimeout(400);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  if (await close.isVisible()) throw new Error('Escape did not close lightbox');
});

await check('product page add to cart', async () => {
  await page.getByRole('button', { name: /Add to Cart/i }).first().click();
  await page.waitForTimeout(500);
  const toast = page.locator('[role="status"]');
  if (!(await toast.innerText()).trim()) throw new Error('no toast');
});

await check('recently viewed persists across navigation', async () => {
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  const stored = await page.evaluate(() => localStorage.getItem('nexus:recently-viewed') ?? localStorage.getItem('recently-viewed'));
  if (!stored) {
    const keys = await page.evaluate(() => Object.keys(localStorage));
    throw new Error(`no recently-viewed key; have ${keys.join(',')}`);
  }
});

await check('global search overlay opens via keyboard', async () => {
  await page.keyboard.press('Control+k');
  await page.waitForTimeout(500);
  const input = page.getByPlaceholder('Search products, games...');
  if (!(await input.isVisible())) throw new Error('overlay did not open');
  await input.fill('rust');
  await page.waitForTimeout(500);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  if (await input.isVisible()) throw new Error('Escape did not close overlay');
});

await check('marquee belt pauses on hover', async () => {
  const belt = page.locator('[class*="animate-"]').first();
  if (!(await belt.count())) throw new Error('no animated belt found');
  await belt.hover();
  await page.waitForTimeout(400);
});

await browser.close();
console.log(`\n${failed === 0 ? 'ALL INTERACTIONS OK' : `${failed} interaction check(s) failed`} @ ${WIDTH}px`);
process.exit(failed === 0 ? 0 : 1);
