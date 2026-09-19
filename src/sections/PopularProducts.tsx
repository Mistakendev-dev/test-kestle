import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { popularProducts } from '../data/products';
import { getGame } from '../data/games';
import { formatPrice, formatSold } from '../lib/utils';
import { ProductArt } from '../components/ProductArt';
import { Reveal } from '../components/anim/Reveal';

export function PopularProducts() {
  return (
    <section className="relative border-t border-edge bg-panel/20 py-24">
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

        <Reveal delay={0.1}>
          <div className="-mx-4 overflow-x-auto px-4 pb-4 [scrollbar-width:thin]">
            <div className="flex gap-4">
              {popularProducts.map((p, i) => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  className="group w-[240px] shrink-0 overflow-hidden rounded-2xl border border-edge bg-white/[0.02] transition-all duration-500 hover:-translate-y-1 hover:border-accent-light/40"
                >
                  <div className="relative">
                    <ProductArt gameId={p.game} className="aspect-[16/9] w-full transition-transform duration-500 group-hover:scale-105" />
                    <span className="absolute left-3 top-3 rounded-md bg-void/70 px-2 py-0.5 font-display text-[10px] font-bold text-accent-bright backdrop-blur-sm">
                      #{i + 1}
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                      {getGame(p.game)?.name}
                    </p>
                    <p className="mt-1 truncate text-sm font-semibold text-white transition-colors group-hover:text-accent-bright">
                      {p.name}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-display text-base font-bold text-white">{formatPrice(p.price)}</span>
                      <span className="text-[11px] text-zinc-600">{formatSold(p.sold)} sold</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
