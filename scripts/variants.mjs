/**
 * Diffs every option rendered on every game hub against the authored spec.
 * Names and prices only — stock is demo data and deliberately not asserted.
 */
import { chromium } from 'playwright';

const BASE = process.env.BASE ?? 'http://localhost:4192';

const SPEC = {
  rust: [
    ['0–250 Hours', 1.07],
    ['250–500 Hours', 1.47],
    ['Premium', 1.56],
    ['500–1000 Hours', 1.67],
    ['Inactive (5 Days)', 1.76],
    ['1000–2000 Hours', 1.86],
    ['2000–3000 Hours', 2.15],
    ['Premium, 500+ Hours', 2.15],
    ['Premium, 1000+ Hours', 2.54],
    ['Premium, Inactive 5 Days', 2.54],
    ['Inactive (15 Days)', 2.54],
    ['Inactive 5 Days, 500+ Hours', 2.54],
    ['3000–7000 Hours', 2.74],
    ['Premium (50+ Inventory)', 2.74],
    ['Inactive 5 Days, 1000+ Hours', 2.74],
    ['Premium (100+ Inventory)', 3.04],
    ['Inactive 15 Days, 500+ Hours', 3.04],
    ['Inactive 15 Days, 1000+ Hours', 3.43],
    ['Premium (Inactive)', 4.01],
    ['7000+ Hours', 4.8],
  ],
  cs2: [
    ['Prime Ready', 0.44],
    ['Premier Ready', 0.62],
    ['Premier Ready (4+ Medals)', 0.95],
    ['Premier Ready (10+ Medals)', 1.0],
    ['5k Last Season', 1.08],
    ['10k Last Season', 1.17],
    ['Premier Ready (10,000 Rating)', 1.2],
    ['Prime (Inactive)', 1.38],
    ['15k Last Season', 1.67],
    ['Premier Ready (15,000 Rating)', 1.86],
    ['$500+ Inventory', 1.86],
    ['4 Medals (Inactive)', 1.86],
    ['Premier (Inactive)', 1.86],
    ['20k Last Season', 2.45],
    ['1000+ Inventory', 2.54],
    ['Premier Ready (20,000 Rating)', 2.74],
    ['Premier Ready (Knife or Glove)', 3.12],
    ['10 Medals (Inactive)', 3.43],
    ['Knives & Gloves, $2000+ Inventory', 5.06],
  ],
  dayz: [
    ['DayZ', 0.56],
    ['DayZ 500 Hours', 1.32],
    ['DayZ Inactive', 1.32],
    ['DayZ 1000 Hours', 1.86],
  ],
  'arc-raiders': [
    ['0–100 Hours', 0.67],
    ['100–200 Hours', 0.99],
    ['200+ Hours', 1.32],
    ['Inactive 15d, 0–99 Hours', 1.47],
    ['Inactive 15d, 100–200 Hours', 2.15],
    ['Inactive 15d, 200+ Hours', 2.54],
  ],
  'apex-legends': [
    ['0–100 Hours', 0.67],
    ['100–200 Hours', 0.99],
    ['200+ Hours', 1.32],
  ],
  'battlefield-6': [['Battlefield 6', 0.56]],
  'rainbow-six-siege': [['Rainbow Six Siege', 0.56]],
  wardogs: [['WarDogs', 2.07]],
  'arma-reforger': [['Arma Reforger', 0.81]],
};

const money = (n) => `$${n.toFixed(2)}`;

const browser = await chromium.launch({
  executablePath: process.env.CHROME_BIN,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });

let bad = 0;
for (const [slug, spec] of Object.entries(SPEC)) {
  await page.goto(`${BASE}/products/${slug}`, { waitUntil: 'networkidle' });
  const list = page.getByRole('list', { name: /options$/i }).first();
  const labels = await list.getByRole('button').evaluateAll((els) =>
    els.map((el) => el.getAttribute('aria-label') ?? ''),
  );

  const got = labels.map((l) => {
    const i = l.lastIndexOf(' — ');
    return [l.slice(0, i), l.slice(i + 3)];
  });

  const problems = [];
  if (got.length !== spec.length) {
    problems.push(`count ${got.length} expected ${spec.length}`);
  }
  for (const [name, price] of spec) {
    const hit = got.find((g) => g[0] === name);
    if (!hit) problems.push(`missing "${name}"`);
    else if (hit[1] !== money(price)) problems.push(`"${name}" ${hit[1]} expected ${money(price)}`);
  }
  for (const [name] of got) {
    if (!spec.some((s) => s[0] === name)) problems.push(`unexpected "${name}"`);
  }

  if (problems.length) {
    bad += 1;
    console.log(`FAIL ${slug}`);
    problems.slice(0, 8).forEach((p) => console.log(`       ${p}`));
  } else {
    console.log(`ok   ${slug} — ${got.length} options match spec`);
  }
}

await browser.close();
console.log(`\n${Object.keys(SPEC).length - bad}/${Object.keys(SPEC).length} games match the spec`);
process.exit(bad ? 1 : 0);
