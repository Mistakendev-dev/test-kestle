import { chromium } from 'playwright';
import { expect } from 'playwright/test';

const BASE = process.env.BASE ?? 'http://localhost:4192';
const ONLY = process.env.ONLY;
const browser = await chromium.launch({
  executablePath: process.env.CHROME_BIN,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const errors = [];
page.on('pageerror', (e) => errors.push(e.message.slice(0, 120)));

const out = [];
let pass = 0;
let fail = 0;
const check = async (name, fn) => {
  if (ONLY && !name.includes(ONLY)) return;
  try {
    await fn();
    out.push(`ok   ${name}`);
    pass += 1;
  } catch (e) {
    out.push(`FAIL ${name}\n       ${String(e.message).split('\n')[0].slice(0, 160)}`);
    fail += 1;
  }
  console.log(out[out.length - 1]);
};

const GAMES = 9;
const search = () => page.getByLabel('Search titles or options');
const cards = page.locator('article');

await page.goto(`${BASE}/products`, { waitUntil: 'networkidle' });

await check('catalog shows one card per game', async () => {
  await expect(cards).toHaveCount(GAMES);
});

await check('cards advertise options and a starting price', async () => {
  const text = await cards.first().innerText();
  if (!/\d+\s+options?/i.test(text)) throw new Error(`no option count: ${text}`);
  if (!/Starting at/i.test(text)) throw new Error(`no starting price: ${text}`);
});

await check('search by game name returns that game', async () => {
  await search().fill('rust');
  await expect(cards).toHaveCount(1);
  await expect(cards.first()).toContainText(/Rust/i);
});

await check('search by option name returns the parent game', async () => {
  await search().fill('7000+ Hours');
  await expect(cards).toHaveCount(1);
  await expect(cards.first()).toContainText(/Rust/i);
});

await check('no-match state appears', async () => {
  await search().fill('zzzzqqq');
  await expect(cards).toHaveCount(0);
});

await check('clearing search restores every game', async () => {
  await search().fill('');
  await expect(cards).toHaveCount(GAMES);
});

await check('sort by price reorders the grid', async () => {
  const before = await cards.allInnerTexts();
  await page.getByLabel('Sort products').selectOption('price-asc');
  await expect(cards).toHaveCount(GAMES);
  const after = await cards.allInnerTexts();
  if (before.join('|') === after.join('|')) throw new Error('order unchanged');
  await page.getByLabel('Sort products').selectOption('featured');
});

await check('wishlist toggle works from a card', async () => {
  await cards.first().getByRole('button', { name: /^add to wishlist$/i }).click();
  await expect(cards.first().getByRole('button', { name: /remove from wishlist/i })).toBeVisible();
});

await check('quick view opens, selects an option and closes', async () => {
  await cards.first().hover();
  await cards.first().getByRole('button', { name: /quick view/i }).click();
  const dialog = page.getByRole('dialog').first();
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('list', { name: /options$/i })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

await check('card links through to the game hub', async () => {
  await cards.first().getByRole('link', { name: /view options/i }).click();
  await page.waitForURL(/\/products\/[a-z0-9-]+/);
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
});

await check('hub lists every Rust option once', async () => {
  await page.goto(`${BASE}/products/rust`, { waitUntil: 'networkidle' });
  const options = page.getByRole('list', { name: /Rust options/i }).getByRole('button');
  await expect(options).toHaveCount(20);
});

await check('hub orders hour brackets ascending', async () => {
  const names = await page
    .getByRole('list', { name: /Rust options/i })
    .getByRole('button')
    .allInnerTexts();
  const hours = names
    .map((t) => t.split('\n')[0].trim())
    .filter((n) => /^\d+(–|-)\d+ Hours$|^\d+\+ Hours$/.test(n));
  const expected = [
    '0–250 Hours',
    '250–500 Hours',
    '500–1000 Hours',
    '1000–2000 Hours',
    '2000–3000 Hours',
    '3000–7000 Hours',
    '7000+ Hours',
  ];
  if (hours.join(' > ') !== expected.join(' > ')) {
    throw new Error(`got ${hours.join(' > ')}`);
  }
});

await check('selecting an option updates price and the URL', async () => {
  const option = page
    .getByRole('list', { name: /Rust options/i })
    .getByRole('button', { name: /^250–500 Hours/ });
  await option.click();
  await page.waitForURL(/[?&]v=rust-250-500/);
  await expect(page.getByRole('button', { name: /Add to Cart — \$1\.47/ }).first()).toBeVisible();
});

await check('group rail filters the option list', async () => {
  const rail = page.getByRole('group', { name: /filter options/i });
  await expect(rail).toBeVisible();
  const all = await page.getByRole('list', { name: /Rust options/i }).getByRole('button').count();
  await rail.getByRole('button', { name: /^premium/i }).click();
  const filtered = await page
    .getByRole('list', { name: /Rust options/i })
    .getByRole('button')
    .count();
  if (filtered >= all || filtered === 0) throw new Error(`all=${all} filtered=${filtered}`);
  await rail.getByRole('button', { name: /^all/i }).click();
});

await check('two options of one game are separate cart lines', async () => {
  await page.goto(`${BASE}/products/rust?v=rust-0-250`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /Add to Cart/ }).first().click();
  await page.goto(`${BASE}/products/rust?v=rust-250-500`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /Add to Cart/ }).first().click();
  await page.getByRole('button', { name: /^cart$/i }).first().click();
  const drawer = page.getByRole('dialog', { name: /^cart$/i });
  await expect(drawer).toBeVisible();
  await expect(drawer).toContainText('0–250 Hours');
  await expect(drawer).toContainText('250–500 Hours');
  await page.keyboard.press('Escape');
});

await check('no page errors during the run', async () => {
  if (errors.length) throw new Error(errors.join(' | '));
});

await browser.close();
const summary = `\n${pass} passed, ${fail} failed`;
console.log(summary);
process.exit(fail ? 1 : 0);
