import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { popularProducts } from '../data/products';
import { getGame } from '../data/games';
import { formatPrice } from '../lib/utils';
import { ProductArt } from '../components/ProductArt';
import { StockIndicator } from '../components/Badge';
import { Reveal } from '../components/anim/Reveal';

export function PopularProducts() {
  const list = popularProducts.slice(0, 5);

  return (
    <section className="relative border-t border-edge bg-panel/20 py-20 md:py-24">
      <div className="container-wide">
        <Reveal>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="section-label flex items-center gap-2">
                <TrendingUp className="h-3.5 w-3.5" /> Trending
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
                Popular right now
              </h2>
              <p className="mt-3 max-w-md text-zinc-400">See what gamers are browsing.</p>
            </div>
            <Link
              to="/products"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-accent-bright transition-colors hover:text-white"
            >
              View All
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>

        <div className="grid gap-3 lg:grid-cols-2">
          {list.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.06}>
              <Link
                to={`/product/${p.id}`}
                className="group flex items-center gap-4 rounded-2xl border border-edge bg-white/[0.02] p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent-light/40 hover:bg-white/[0.04] sm:p-4"
              >
                <span className="w-9 shrink-0 text-center font-display text-xl font-bold text-zinc-700 transition-colors group-hover:text-accent-bright sm:text-2xl">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <ProductArt
                  gameId={p.game}
                  image={p.image}
                  alt={p.name}
                  className="h-16 w-24 shrink-0 rounded-xl sm:h-[70px] sm:w-28"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                    {getGame(p.game)?.name}
                  </p>
                  <p className="mt-0.5 truncate text-sm font-semibold text-white transition-colors group-hover:text-accent-bright">
                    {p.name}
                  </p>
                  <StockIndicator stock={p.stock} className="mt-1.5" />
                </div>
                <div className="shrink-0 pr-1 text-right">
                  <span className="font-display text-base font-bold text-white sm:text-lg">
                    {formatPrice(p.price)}
                  </span>
                  <ArrowRight className="ml-auto mt-1 h-4 w-4 text-zinc-700 transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent-bright" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-zinc-600">
          Demo ranking — not based on real sales data.
        </p>
      </div>
    </section>
  );
}
