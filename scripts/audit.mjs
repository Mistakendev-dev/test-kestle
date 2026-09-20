import { chromium } from 'playwright';

const BASE = process.env.AUDIT_BASE ?? 'http://127.0.0.1:4173';
const WIDTHS = (process.env.AUDIT_WIDTHS ?? '1440').split(',').map(Number);
const ROUTES = [
  '/',
  '/products',
  '/product/rust-nfa',
  '/games',
  '/games/rust',
  '/resell',
  '/docs',
  '/how-it-works',
  '/faq',
  '/not-a-real-route',
];

const probe = () => {
  const docWidth = document.documentElement.clientWidth;
  const offenders = [];
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    if (r.right <= docWidth + 1 && r.left >= -1) continue;
    const style = getComputedStyle(el);
    if (style.position === 'fixed') continue;
    let clipped = false;
    for (let p = el.parentElement; p; p = p.parentElement) {
      const ps = getComputedStyle(p);
      if (ps.overflowX !== 'visible' || ps.overflow !== 'visible') { clipped = true; break; }
    }
    if (clipped) continue;
    offenders.push(`${el.tagName.toLowerCase()}.${(el.className || '').toString().split(' ').slice(0, 3).join('.')} [${Math.round(r.left)}..${Math.round(r.right)}]`);
  }
  return { scrollWidth: document.documentElement.scrollWidth, docWidth, offenders: offenders.slice(0, 5) };
};

const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN ?? '/usr/bin/chromium' });
let failures = 0;

for (const width of WIDTHS) {
  console.log(`\n=== ${width}px ===`);
  for (const route of ROUTES) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    const errors = [];
    const failed = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text().slice(0, 140)));
    page.on('pageerror', (e) => errors.push(`pageerror: ${e.message.slice(0, 140)}`));
    page.on('requestfailed', (r) => failed.push(r.url()));
    page.on('response', (r) => r.status() >= 400 && failed.push(`${r.status()} ${r.url()}`));

    await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 45000 });
    await page.waitForTimeout(400);
    const result = await page.evaluate(probe);

    const overflow = result.scrollWidth > result.docWidth + 1;
    const bad = overflow || errors.length || failed.length;
    if (bad) failures++;
    console.log(`${bad ? 'FAIL' : ' ok '} ${route.padEnd(22)} sw=${result.scrollWidth}/${result.docWidth}`);
    if (overflow && result.offenders.length) result.offenders.forEach((o) => console.log(`      overflow: ${o}`));
    errors.forEach((e) => console.log(`      console: ${e}`));
    failed.forEach((f) => console.log(`      request: ${f}`));

    await context.close();
  }
}

await browser.close();
console.log(`\n${failures === 0 ? 'ALL CLEAN' : `${failures} route/viewport combos with issues`}`);
process.exit(failures === 0 ? 0 : 1);
