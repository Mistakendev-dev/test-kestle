// Loads key routes in a real browser against the dev server and fails on any
// page error, console error, or router error boundary.
import { chromium } from 'playwright';

const BASE = process.env.BASE ?? 'http://localhost:5173';
const ROUTES = ['/', '/products', '/products/rust', '/resell', '/docs'];

const browser = await chromium.launch({
  executablePath: process.env.CHROME_BIN,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

let failed = 0;
for (const route of ROUTES) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e).split('\n')[0]));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text().slice(0, 200)));

  await page.goto(BASE + route, { waitUntil: 'load' });
  await page.waitForTimeout(1500);

  const boundary = await page
    .getByText(/Cannot read properties|Unexpected Application Error/i)
    .count();
  const cards = await page.locator('article, main').count();
  const ok = errors.length === 0 && boundary === 0 && cards > 0;
  if (!ok) failed++;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${route}`);
  if (!ok) errors.slice(0, 3).forEach((e) => console.log(`       ${e}`));
  await page.close();
}

await browser.close();
console.log(failed ? `\n${failed} route(s) failed` : '\nall routes clean in the browser');
process.exit(failed ? 1 : 0);
