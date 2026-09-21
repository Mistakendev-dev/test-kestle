/**
 * Single source of truth for the marketplace.
 *
 * A GAME is the product. The account types sold for that game are its
 * variants, and each variant carries its own price and stock.
 */

export type VariantGroup = 'Standard' | 'Hours' | 'Premium' | 'Rank' | 'Inactive' | 'Inventory';

export interface Variant {
  id: string;
  name: string;
  price: number;
  stock: number;
  available: boolean;
  group: VariantGroup;
}

export interface GameProduct {
  id: string;
  slug: string;
  name: string;
  short: string;
  genre: string;
  description: string;
  /** Optional real artwork. When absent the generated ProductArt is rendered. */
  image?: string;
  color: string;
  colorSoft: string;
  features: string[];
  variants: Variant[];
  /** Cheapest variant price. */
  price: number;
  /** Sum of every variant's stock. */
  stock: number;
  variantCount: number;
  available: boolean;
}

/** Kept so existing imports of `Product` keep working. */
export type Product = GameProduct;

type AuthoredVariant = [name: string, price: number];

interface AuthoredGame {
  id: string;
  name: string;
  short: string;
  genre: string;
  description: string;
  color: string;
  colorSoft: string;
  features: string[];
  variants: AuthoredVariant[];
}

const authored: AuthoredGame[] = [
  {
    id: 'rust',
    name: 'Rust',
    short: 'RUST',
    genre: 'Survival',
    description:
      'Steam accounts with full Rust ownership, offered across hour brackets, premium status and inactivity windows. Pick the version that clears the servers you play on.',
    color: '#b7410e',
    colorSoft: 'rgba(183,65,14,0.25)',
    features: ['Full Rust game license', 'Clean VAC history', 'Instant delivery', 'Region free'],
    variants: [
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
  },
  {
    id: 'cs2',
    name: 'Counter-Strike 2',
    short: 'CS2',
    genre: 'Tactical FPS',
    description:
      'Prime and Premier ready Counter-Strike 2 accounts, sorted by rating, medals and inventory value. Every option is matchmaking ready on delivery.',
    color: '#e8a33d',
    colorSoft: 'rgba(232,163,61,0.22)',
    features: ['Matchmaking ready', 'Clean VAC history', 'Instant delivery', 'Region free'],
    variants: [
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
  },
  {
    id: 'dayz',
    name: 'DayZ',
    short: 'DAYZ',
    genre: 'Survival',
    description:
      'Steam accounts with the full DayZ licence. Available fresh, with played hours on record, or aged out to clear inactivity checks.',
    color: '#6a7a5a',
    colorSoft: 'rgba(106,122,90,0.25)',
    features: ['Full DayZ licence', 'Clean history', 'Instant delivery', 'Region free'],
    variants: [
      ['DayZ', 0.56],
      ['DayZ 500 Hours', 1.32],
      ['DayZ Inactive', 1.32],
      ['DayZ 1000 Hours', 1.86],
    ],
  },
  {
    id: 'arc-raiders',
    name: 'ARC Raiders',
    short: 'ARC',
    genre: 'Extraction Shooter',
    description:
      'ARC Raiders accounts across hour brackets, with inactive options for servers and squads that check recent activity.',
    color: '#4a90d9',
    colorSoft: 'rgba(74,144,217,0.22)',
    features: ['Full game access', 'Instant delivery', 'Region free', 'Clean history'],
    variants: [
      ['0–100 Hours', 0.67],
      ['100–200 Hours', 0.99],
      ['200+ Hours', 1.32],
      ['Inactive 15d, 0–99 Hours', 1.47],
      ['Inactive 15d, 100–200 Hours', 2.15],
      ['Inactive 15d, 200+ Hours', 2.54],
    ],
  },
  {
    id: 'apex',
    name: 'Apex Legends',
    short: 'APEX',
    genre: 'Battle Royale',
    description:
      'Apex Legends accounts graded by hours played, so you can match the profile history your lobby or squad expects.',
    color: '#d43d3d',
    colorSoft: 'rgba(212,61,61,0.22)',
    features: ['Ranked eligible', 'Instant delivery', 'Clean history', 'All platforms'],
    variants: [
      ['0–100 Hours', 0.67],
      ['100–200 Hours', 0.99],
      ['200+ Hours', 1.32],
    ],
  },
  {
    id: 'battlefield-6',
    name: 'Battlefield 6',
    short: 'BF6',
    genre: 'FPS',
    description:
      'Battlefield 6 accounts with full multiplayer access, delivered instantly with login credentials.',
    color: '#4a6a8a',
    colorSoft: 'rgba(74,106,138,0.25)',
    features: ['Full multiplayer access', 'Instant delivery', 'Region free'],
    variants: [['Battlefield 6', 0.56]],
  },
  {
    id: 'r6',
    name: 'Rainbow Six Siege',
    short: 'R6',
    genre: 'Tactical FPS',
    description:
      'Rainbow Six Siege accounts on Ubisoft Connect with ranked placement available and base operators ready to unlock.',
    color: '#4a6fd9',
    colorSoft: 'rgba(74,111,217,0.22)',
    features: ['Ubisoft Connect', 'Ranked eligible', 'Instant delivery', 'Region free'],
    variants: [['Rainbow Six Siege', 0.56]],
  },
  {
    id: 'wardogs',
    name: 'WarDogs',
    short: 'WD',
    genre: 'Shooter',
    description: 'WarDogs accounts with full game access, delivered instantly after checkout.',
    color: '#8a7a4a',
    colorSoft: 'rgba(138,122,74,0.25)',
    features: ['Full game access', 'Instant delivery', 'Region free'],
    variants: [['WarDogs', 2.07]],
  },
  {
    id: 'arma-reforger',
    name: 'Arma Reforger',
    short: 'ARMA',
    genre: 'Military Sim',
    description:
      'Arma Reforger accounts with the full licence, ready for official and community servers.',
    color: '#5a7a5f',
    colorSoft: 'rgba(90,122,95,0.24)',
    features: ['Full Arma Reforger licence', 'Instant delivery', 'Region free'],
    variants: [['Arma Reforger', 0.81]],
  },
];

/* ---------------------------------------------------------------- grouping */

const GROUP_RULES: [RegExp, VariantGroup][] = [
  [/inventory/i, 'Inventory'],
  [/inactive/i, 'Inactive'],
  [/medal|rating|last season|premier|knife|glove/i, 'Rank'],
  [/premium|prime/i, 'Premium'],
  [/hours?/i, 'Hours'],
];

export const GROUP_ORDER: VariantGroup[] = [
  'Standard',
  'Hours',
  'Premium',
  'Rank',
  'Inactive',
  'Inventory',
];

function groupOf(name: string): VariantGroup {
  for (const [re, group] of GROUP_RULES) if (re.test(name)) return group;
  return 'Standard';
}

/**
 * Rank used to order hour brackets logically (0–250 before 250–500 before
 * 7000+) rather than alphabetically. Reads the last number written before the
 * word "hours" so "Inactive 5 Days, 500+ Hours" resolves to 500, not 5.
 */
function hourRank(name: string): number {
  const match = /^(.*?)hours?/i.exec(name);
  if (!match) return -1;
  const numbers = match[1].match(/\d[\d,]*/g);
  if (!numbers) return -1;
  return Number(numbers[numbers.length - 1].replace(/,/g, ''));
}

/* ------------------------------------------------------------------- stock */

/**
 * Placeholder inventory for UI development only — not live stock. Values are
 * derived from the variant id so they stay stable across reloads, and roughly
 * one in fourteen lands at zero so the sold-out states are reachable.
 * Replace `demoStock` with a real inventory lookup to go live.
 */
export const STOCK_SOURCE: 'demo' | 'live' = 'demo';

function demoStock(id: string): number {
  let hash = 2166136261;
  for (let i = 0; i < id.length; i++) {
    hash ^= id.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const n = Math.abs(hash);
  if (n % 14 === 0) return 0;
  return (n % 180) + 1;
}

/* ------------------------------------------------------------------- build */

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/\+/g, '-plus')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

function buildVariants(game: AuthoredGame): Variant[] {
  return game.variants
    .map(([name, price]) => {
      const id = `${game.id}-${slugify(name)}`;
      const stock = demoStock(id);
      return { id, name, price, stock, available: stock > 0, group: groupOf(name) };
    })
    .sort((a, b) => {
      const groupDelta = GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group);
      if (groupDelta !== 0) return groupDelta;
      const hourDelta = hourRank(a.name) - hourRank(b.name);
      if (hourDelta !== 0) return hourDelta;
      return a.price - b.price;
    });
}

function build(game: AuthoredGame): GameProduct {
  const variants = buildVariants(game);
  const stock = variants.reduce((sum, v) => sum + v.stock, 0);
  return {
    ...game,
    slug: game.id,
    variants,
    price: Math.min(...variants.map((v) => v.price)),
    stock,
    variantCount: variants.length,
    available: stock > 0,
  };
}

export const products: GameProduct[] = authored.map(build);

/* ----------------------------------------------------------------- helpers */

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export const getVariant = (product: GameProduct, variantId: string | null | undefined) =>
  product.variants.find((v) => v.id === variantId);

/** First in-stock variant, falling back to the cheapest when all are sold out. */
export const defaultVariant = (product: GameProduct): Variant =>
  product.variants.find((v) => v.available) ?? product.variants[0];

/** Resolves a variant id from a URL or cart entry, never returning undefined. */
export const resolveVariant = (product: GameProduct, variantId: string | null | undefined) =>
  getVariant(product, variantId) ?? defaultVariant(product);

export const findVariant = (variantId: string) => {
  for (const product of products) {
    const variant = getVariant(product, variantId);
    if (variant) return { product, variant };
  }
  return undefined;
};

/** Variants of a product bucketed by group, in display order, empties dropped. */
export function variantGroups(product: GameProduct) {
  return GROUP_ORDER.map((group) => ({
    group,
    variants: product.variants.filter((v) => v.group === group),
  })).filter((entry) => entry.variants.length > 0);
}

export const totalVariants = products.reduce((sum, p) => sum + p.variantCount, 0);
export const totalStock = products.reduce((sum, p) => sum + p.stock, 0);

/** Variants whose own name matches the query — used to explain a game result. */
export function matchingVariants(product: GameProduct, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return product.variants.filter((v) => v.name.toLowerCase().includes(q));
}

/** Shared matcher so global search, page search and filters stay consistent. */
export function matchesQuery(product: GameProduct, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    product.name.toLowerCase().includes(q) ||
    product.short.toLowerCase().includes(q) ||
    product.genre.toLowerCase().includes(q) ||
    product.description.toLowerCase().includes(q) ||
    product.variants.some((v) => v.name.toLowerCase().includes(q))
  );
}
