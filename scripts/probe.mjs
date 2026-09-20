import { chromium } from 'playwright';

const browser = await chromium.launch({
  executablePath: process.env.CHROME_BIN,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 375, height: 800 } });
await page.goto(`${process.env.BASE}/products`, { waitUntil: 'networkidle' });
await page.waitForTimeout(400);

const out = await page.evaluate(() => {
  const de = document.documentElement;
  const rows = [];
  for (const el of document.querySelectorAll('body, body *')) {
    const cs = getComputedStyle(el);
    if (cs.overflowX !== 'visible') continue;
    if (el.scrollWidth > el.clientWidth + 0.5 && el.clientWidth > 0) {
      rows.push({
        tag: el.tagName.toLowerCase(),
        cls: (el.className?.baseVal ?? el.className ?? '').toString().slice(0, 80),
        sw: el.scrollWidth,
        cw: el.clientWidth,
        depth: (() => { let d = 0, p = el; while ((p = p.parentElement)) d++; return d; })(),
      });
    }
  }
  rows.sort((a, b) => b.depth - a.depth);
  return { scrollWidth: de.scrollWidth, clientWidth: de.clientWidth, rows: rows.slice(0, 12) };
});

console.log(`doc scrollWidth=${out.scrollWidth} clientWidth=${out.clientWidth}`);
console.log(`propagating elements (deepest first): ${out.rows.length}`);
for (const r of out.rows) console.log(`  d${r.depth} <${r.tag}> sw=${r.sw} cw=${r.cw}  ${r.cls}`);

await browser.close();
