import { Link } from 'react-router-dom';
import type { Product } from '../data/products';
import { featuredProducts, popularProducts, products } from '../data/products';
import { getGame } from '../data/games';
import { formatPrice } from '../lib/utils';
import { ProductArt } from '../components/ProductArt';

function MarqueeCard({ product }: { product: Product }) {
  const game = getGame(product.game);
  const low = product.stock <= 10;

  return (
    <Link
      to={`/product/${product.id}`}
      className="group mr-3 flex w-[248px] shrink-0 items-center gap-3 rounded-2xl border border-edge bg-white/[0.025] p-2.5 backdrop-blur-sm transition-colors duration-300 hover:border-accent-light/40 hover:bg-white/[0.05]"
    >
      <ProductArt
        gameId={product.game}
        image={product.image}
        alt={product.name}
        className="h-12 w-14 shrink-0 rounded-xl"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
          {game?.name}
        </p>
        <p className="truncate text-sm font-semibold text-white transition-colors group-hover:text-accent-bright">
          {product.category} Account
        </p>
        <div className="mt-0.5 flex items-center gap-2">
          <span className="font-display text-xs font-bold text-white">{formatPrice(product.price)}</span>
          <span className="flex items-center gap-1 text-[10px] font-medium text-zinc-500">
            <span className={`h-1.5 w-1.5 rounded-full ${low ? 'bg-amber-400' : 'bg-emerald-400'}`} />
            {low ? 'Low' : 'In stock'}
          </span>
        </div>
      </div>
    </Link>
  );
}

function Row({ items, direction, duration }: { items: Product[]; direction: 'left' | 'right'; duration: number }) {
  // The track holds two identical halves; translating by -50% loops seamlessly.
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

const rowOne = [...featuredProducts, ...products.slice(0, 4)].slice(0, 10);
const rowTwo = [...popularProducts, ...products.slice(20, 24)].slice(0, 10);

export function ProductMarquee() {
  return (
    <section className="relative overflow-hidden border-y border-edge bg-panel/25 py-8">
      <div className="flex flex-col gap-3">
        <Row items={rowOne} direction="left" duration={58} />
        <Row items={rowTwo} direction="right" duration={68} />
      </div>
    </section>
  );
}
