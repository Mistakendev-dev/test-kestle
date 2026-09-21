import { Link } from 'react-router-dom';
import type { Product } from '../data/products';
import { featuredProducts, newProducts, popularProducts, products } from '../data/products';
import { getGame } from '../data/games';
import { formatPrice } from '../lib/utils';
import { ProductArt } from '../components/ProductArt';

function Poster({ product }: { product: Product }) {
  const game = getGame(product.id);
  const low = product.stock <= 10;

  return (
    <Link
      to={`/product/${product.id}`}
      tabIndex={-1}
      className="group mr-4 block h-[260px] w-[170px] shrink-0 sm:mr-5 sm:h-[330px] sm:w-[210px] lg:h-[386px] lg:w-[250px]"
      style={{ perspective: '900px' }}
    >
      <div className="relative h-full overflow-hidden rounded-2xl border border-white/[0.09] shadow-rest transition-[transform,border-color,box-shadow] duration-500 ease-out group-hover:-translate-y-2 group-hover:border-accent-light/45 group-hover:shadow-lift group-hover:[transform:translateY(-8px)_rotateX(3deg)]">
        {/* Artwork dominates the poster; copy sits in the lower gradient. */}
        <ProductArt
          gameId={product.id}
          image={product.image}
          alt={product.name}
          size="lg"
          className="absolute inset-0 h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(5,5,7,0.94) 8%, rgba(5,5,7,0.55) 38%, transparent 68%)',
          }}
        />

        {/* Glass highlight across the upper edge. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.09), transparent 30%)' }}
        />

        <span className="absolute left-3 top-3 rounded-md border border-white/10 bg-void/65 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-300 backdrop-blur-sm">
          {product.category}
        </span>

        <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-4">
          <p className="truncate text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-400">
            {game?.name}
          </p>
          <p className="mt-1.5 line-clamp-2 text-sm font-semibold leading-snug text-white transition-colors group-hover:text-accent-bright sm:text-[15px]">
            {product.name}
          </p>
          <div className="mt-2.5 flex items-center justify-between gap-2">
            <span className="font-display text-lg font-bold text-white">{formatPrice(product.price)}</span>
            <span className="flex items-center gap-1.5 text-[10px] font-medium text-zinc-400">
              <span className={`h-1.5 w-1.5 rounded-full ${low ? 'bg-amber-400' : 'bg-emerald-400'}`} />
              {low ? 'Low stock' : 'In stock'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

/** De-duplicated so a title never appears twice in the belt. */
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

const belt = pick([featuredProducts, popularProducts, newProducts, products], 14);

/**
 * One continuous poster belt. Two identical halves translated by -50% give a
 * seamless loop; the whole thing is a single CSS transform, so it never
 * touches the main thread while scrolling.
 */
export function ProductBelt() {
  return (
    <section aria-label="Browse the catalogue" className="relative overflow-hidden py-16 md:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 h-[420px] -translate-y-1/2 opacity-70 blur-[110px]"
        style={{
          background: 'radial-gradient(ellipse 45% 100% at 50% 50%, rgba(46,48,106,0.42), transparent 72%)',
        }}
      />

      <div className="marquee-viewport mask-fade-x relative overflow-hidden">
        <div className="marquee-track marquee-track--left" style={{ animationDuration: '90s' }}>
          {[0, 1].map((half) => (
            <div key={half} className="flex" aria-hidden={half === 1}>
              {belt.map((p) => (
                <Poster key={`${half}-${p.id}`} product={p} />
              ))}
            </div>
          ))}
        </div>

        {/* Edge depth: posters toward the rim sit back into the dark. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(5,5,7,0.9) 0%, transparent 18%, transparent 82%, rgba(5,5,7,0.9) 100%)',
          }}
        />
      </div>
    </section>
  );
}
