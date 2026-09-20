import { chromium } from 'playwright';

const BASE = process.env.BASE ?? 'http://localhost:4190';
const ROUTES = (process.env.ROUTES ?? '/products').split(',');
const VIEWPORTS = [
  { name: '375', width: 375, height: 800 },
  { name: '768', width: 768, height: 1024 },
  { name: '1440', width: 1440, height: 900 },
];

const browser = await chromium.launch({
  executablePath: process.env.CHROME_BIN,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

let failures = 0;

for (const route of ROUTES) {
  for (const vp of VIEWPORTS) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    const errors = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text().slice(0, 120)));
    page.on('pageerror', (e) => errors.push(`pageerror: ${e.message.slice(0, 120)}`));
    page.on('requestfailed', (r) => errors.push(`failed: ${r.url().slice(-60)}`));

    await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const m = await page.evaluate(() => {
      const de = document.documentElement;
      const offenders = [];
      if (de.scrollWidth > de.clientWidth) {
        for (const el of document.querySelectorAll('*')) {
          const r = el.getBoundingClientRect();
          if (r.width === 0) continue;
          if (r.right > de.clientWidth + 1 || r.left < -1) {
            offenders.push({
              tag: el.tagName.toLowerCase(),
              cls: (el.className?.baseVal ?? el.className ?? '').toString().slice(0, 70),
              left: Math.round(r.left),
              right: Math.round(r.right),
            });
          }
        }
      }
      return {
        scrollWidth: de.scrollWidth,
        clientWidth: de.clientWidth,
        cards: document.querySelectorAll('article').length,
        offenders: offenders.slice(0, 6),
      };
    });

    const overflow = m.scrollWidth - m.clientWidth;
    const ok = overflow <= 0 && errors.length === 0;
    if (!ok) failures += 1;
    console.log(
      `${ok ? 'ok  ' : 'FAIL'} ${route} @${vp.name}  scroll=${m.scrollWidth}/${m.clientWidth}` +
        ` overflow=${overflow} cards=${m.cards} errors=${errors.length}`,
    );
    for (const o of m.offenders) console.log(`       offender <${o.tag}> ${o.left}..${o.right} ${o.cls}`);
    for (const e of errors.slice(0, 4)) console.log(`       ${e}`);
    await page.close();
  }
}

await browser.close();
console.log(failures === 0 ? '\nALL CLEAN' : `\n${failures} viewport(s) failing`);
