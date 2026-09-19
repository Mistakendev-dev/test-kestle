import { Link } from 'react-router-dom';
import type { Product } from '../data/products';
import { featuredProducts, newProducts, popularProducts, products } from '../data/products';
import { getGame } from '../data/games';
import { formatPrice } from '../lib/utils';
import { ProductArt } from '../components/ProductArt';

function MarqueeCard({ product }: { product: Product }) {
  const game = getGame(product.game);
  const low = product.stock <= 10;

  return (
    <Link
      to={`/product/${product.id}`}
      className="group mr-4 block w-[196px] shrink-0 overflow-hidden rounded-2xl border border-edge bg-panel/70 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.9)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent-light/45 hover:shadow-[0_0_44px_-14px_rgba(74,79,158,0.75)] sm:w-[240px] lg:w-[268px]"
    >
      <div className="relative overflow-hidden">
        <ProductArt
          gameId={product.game}
          image={product.image}
          alt={product.name}
          size="md"
          className="aspect-[16/10] w-full transition-transform duration-500 group-hover:scale-[1.06]"
        />
        <span className="absolute left-2.5 top-2.5 rounded-md border border-white/10 bg-void/70 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-300 backdrop-blur-sm">
          {product.category}
        </span>
      </div>

      <div className="p-3.5">
        <p className="truncate text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
          {game?.name}
        </p>
        <p className="mt-1 truncate text-sm font-semibold text-white transition-colors group-hover:text-accent-bright">
          {product.name}
        </p>
        <div className="mt-2.5 flex items-center justify-between gap-2">
          <span className="font-display text-base font-bold text-white">{formatPrice(product.price)}</span>
          <span className="flex items-center gap-1.5 text-[10px] font-medium text-zinc-400">
            <span className={`h-1.5 w-1.5 rounded-full ${low ? 'bg-amber-400' : 'bg-emerald-400'}`} />
            {low ? 'Low stock' : 'In stock'}
          </span>
        </div>
      </div>
    </Link>
  );
}

function Row({ items, direction, duration }: { items: Product[]; direction: 'left' | 'right'; duration: number }) {
  // Two identical halves; translating the track by -50% loops seamlessly.
  return (
    <div className="marquee-viewport mask-fade-x overflow-hidden">
      <div
        className={`marquee-track marquee-track--${direction}`}
        style={{ animationDuration: `${duration}s` }}
      >
        {[0, 1].map((half) => (
          <div key={half} className="flex" aria-hidden={half === 1}>
            {items.map((p) => (
              <MarqueeCard key={`${half}-${p.id}`} product={p} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** De-duplicated so a title never appears twice in the same row. */
function pick(pools: Product[][], count: number) {
  const out: Product[] = [];
  const seen = new Set<string>();
  for (const pool of pools) {
    for (const p of pool) {
      if (out.length >= count) return out;
      if (seen.has(p.id)) continue;
      seen.add(p.id);
      out.push(p);
    }
  }
  return out;
}

const rowOne = pick([featuredProducts, popularProducts, products], 9);
const rowTwo = pick([newProducts, [...products].reverse()], 9).filter(
  (p) => !rowOne.some((q) => q.id === p.id),
);

export function ProductMarquee() {
  return (
    <section
      aria-label="Browse the catalogue"
      className="relative overflow-hidden border-y border-edge bg-panel/25 py-10 md:py-14"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 h-64 -translate-y-1/2 opacity-60 blur-[90px]"
        style={{ background: 'radial-gradient(ellipse 50% 100% at 50% 50%, rgba(46,48,106,0.4), transparent 70%)' }}
      />
      <div className="relative flex flex-col gap-4">
        <Row items={rowOne} direction="left" duration={64} />
        <Row items={rowTwo} direction="right" duration={76} />
      </div>
    </section>
  );
}
