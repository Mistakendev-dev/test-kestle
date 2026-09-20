import { chromium } from 'playwright';
import { expect } from 'playwright/test';

const BASE = process.env.BASE ?? 'http://localhost:4192';
const browser = await chromium.launch({
  executablePath: process.env.CHROME_BIN,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const errors = [];
page.on('pageerror', (e) => errors.push(e.message.slice(0, 100)));

let pass = 0;
let fail = 0;
const check = async (name, fn) => {
  try {
    await fn();
    console.log(`ok   ${name}`);
    pass += 1;
  } catch (e) {
    console.log(`FAIL ${name}\n       ${String(e.message).split('\n')[0].slice(0, 150)}`);
    fail += 1;
  }
};

await page.goto(`${BASE}/products`, { waitUntil: 'networkidle' });
const cards = page.locator('article');

await check('catalog renders the full listing set', async () => {
  await expect(cards).toHaveCount(47);
});

await check('search narrows the grid', async () => {
  await page.getByLabel('Search products or games').fill('valorant');
  await expect(cards).not.toHaveCount(47);
  await expect(cards.first()).toBeVisible();
});

await check('no-match state appears', async () => {
  await page.getByLabel('Search products or games').fill('zzzzqqq');
  await expect(cards).toHaveCount(0);
});

await check('clearing search restores every listing', async () => {
  await page.getByLabel('Search products or games').fill('');
  await expect(cards).toHaveCount(47);
});

await check('category rail filters', async () => {
  const rail = page.getByRole('button', { name: /^Rust\b/ }).first();
  await rail.click();
  await expect(cards).not.toHaveCount(47);
});

await check('sort control reorders without loss', async () => {
  await page.getByRole('button', { name: /^All\b/ }).first().click();
  await expect(cards).toHaveCount(47);
  const before = await cards.first().innerText();
  await page.getByRole('combobox').first().selectOption({ index: 1 });
  await expect(cards).toHaveCount(47);
  const after = await cards.first().innerText();
  if (before === after) throw new Error('sort did not reorder');
});

await check('wishlist toggle works from a card', async () => {
  await page.getByRole('button', { name: /add to wishlist/i }).first().click();
  await expect(page.getByRole('button', { name: /remove from wishlist/i }).first()).toBeVisible();
});

await check('quick view opens and Escape closes', async () => {
  await cards.first().hover();
  await page.getByRole('button', { name: /quick view/i }).first().click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.first()).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
});

await check('card links through to the detail page', async () => {
  await cards.first().getByRole('link').first().click();
  await page.waitForURL(/\/product\//);
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
});

await check('no page errors during the run', async () => {
  if (errors.length) throw new Error(errors.join(' | '));
});

await browser.close();
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
