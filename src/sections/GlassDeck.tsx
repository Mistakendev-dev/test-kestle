import { Link } from 'react-router-dom';
import { ArrowUpRight, Sparkles, TrendingUp } from 'lucide-react';
import { featuredProducts, newProducts, popularProducts, products } from '../data/products';
import { games, getGame } from '../data/games';
import { formatPrice } from '../lib/utils';
import { ProductArt } from '../components/ProductArt';
import { Reveal } from '../components/anim/Reveal';

const hero = featuredProducts[0];
const secondary = featuredProducts.slice(1, 3);
const trending = popularProducts.slice(0, 4);
const fresh = newProducts.slice(0, 3);
const topGames = [...games].sort((a, b) => b.productCount - a.productCount).slice(0, 4);

const categories = ['NFA', 'FA', 'Ranked', 'Stacked'] as const;

/**
 * The marketplace shown as one physical object: a single glass deck holding
 * tiles of different weights. Hovering a tile lifts it and recedes the rest,
 * so the collection reads as objects rather than a grid of divs.
 */
export function GlassDeck() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(46,48,106,0.28), transparent 70%)',
        }}
      />

      <div className="container-wide relative">
        <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="section-label">The Marketplace</span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white md:text-5xl">
              Everything in one place
            </h2>
            <p className="mt-3 max-w-md text-zinc-400">
              Featured drops, trending titles and the newest additions — laid out so you can scan it
              all at a glance.
            </p>
          </div>
          <Link
            to="/products"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-zinc-300 transition-colors hover:text-white"
          >
            Open full catalogue
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="pane-raised bevel lit-surface overflow-hidden p-3 sm:p-4 md:p-5">
            <div className="deck grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
              {/* Anchor tile — the heaviest object on the deck. */}
              <Link
                to={`/product/${hero.id}`}
                className="deck-tile group relative col-span-1 overflow-hidden rounded-2xl border border-white/[0.07] bg-surface-2 md:col-span-2 md:row-span-2"
              >
                <ProductArt
                  gameId={hero.game}
                  image={hero.image}
                  alt={hero.name}
                  label={hero.category}
                  size="lg"
                  className="aspect-[16/10] w-full transition-transform duration-700 ease-out group-hover:scale-[1.04] md:aspect-[16/11]"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background: 'linear-gradient(180deg, transparent 35%, rgba(5,5,7,0.92) 92%)',
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-4 p-5 md:p-6">
                  <div className="min-w-0">
                    <span className="meta">{getGame(hero.game)?.name}</span>
                    <h3 className="mt-1 font-display text-2xl font-bold text-white md:text-3xl">
                      {hero.name}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="meta">From</span>
                    <p className="font-display text-2xl font-bold text-white md:text-3xl">
                      {formatPrice(hero.price)}
                    </p>
                  </div>
                </div>
              </Link>

              {/* Trending list. */}
              <div className="deck-tile rounded-2xl border border-white/[0.07] bg-surface-1/80 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-accent-bright" />
                  <span className="meta">Trending now</span>
                </div>
                <ul className="space-y-1">
                  {trending.map((p, i) => (
                    <li key={p.id}>
                      <Link
                        to={`/product/${p.id}`}
                        className="group flex items-center gap-3 rounded-xl px-2 py-2 transition-colors duration-300 hover:bg-white/[0.04]"
                      >
                        <span className="w-5 shrink-0 font-display text-xs font-bold text-zinc-600">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <ProductArt
                          gameId={p.game}
                          image={p.image}
                          alt=""
                          size="sm"
                          className="h-9 w-12 shrink-0 rounded-md"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-zinc-200 transition-colors group-hover:text-white">
                            {p.name}
                          </span>
                          <span className="block truncate text-[11px] text-zinc-500">
                            {getGame(p.game)?.name}
                          </span>
                        </span>
                        <span className="shrink-0 font-display text-xs font-bold text-accent-bright">
                          {formatPrice(p.price)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recently added. */}
              <div className="deck-tile rounded-2xl border border-white/[0.07] bg-surface-1/80 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-accent-bright" />
                  <span className="meta">Recently added</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {fresh.map((p) => (
                    <Link key={p.id} to={`/product/${p.id}`} className="group block">
                      <ProductArt
                        gameId={p.game}
                        image={p.image}
                        alt={p.name}
                        size="sm"
                        className="aspect-[4/3] w-full rounded-lg transition-transform duration-500 group-hover:scale-[1.05]"
                      />
                      <p className="mt-1.5 truncate text-[11px] font-medium text-zinc-400 transition-colors group-hover:text-white">
                        {getGame(p.game)?.short}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Two mid-weight featured tiles. */}
              {secondary.map((p) => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  className="deck-tile group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-surface-2"
                >
                  <ProductArt
                    gameId={p.game}
                    image={p.image}
                    alt={p.name}
                    label={p.category}
                    className="aspect-[16/10] w-full transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(5,5,7,0.9))' }}
                  />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
                    <div className="min-w-0">
                      <span className="meta">{getGame(p.game)?.short}</span>
                      <p className="truncate text-sm font-semibold text-white">{p.name}</p>
                    </div>
                    <span className="shrink-0 font-display text-sm font-bold text-white">
                      {formatPrice(p.price)}
                    </span>
                  </div>
                </Link>
              ))}

              {/* Games + categories, the lightest tile. */}
              <div className="deck-tile rounded-2xl border border-white/[0.07] bg-surface-1/80 p-4">
                <span className="meta">Biggest catalogues</span>
                <ul className="mt-3 space-y-1.5">
                  {topGames.map((g) => (
                    <li key={g.id}>
                      <Link
                        to={`/games/${g.id}`}
                        className="group flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 transition-colors duration-300 hover:bg-white/[0.04]"
                      >
                        <span className="flex min-w-0 items-center gap-2.5">
                          <span
                            aria-hidden
                            className="h-2 w-2 shrink-0 rounded-full"
                            style={{ background: g.color }}
                          />
                          <span className="truncate text-sm text-zinc-300 transition-colors group-hover:text-white">
                            {g.name}
                          </span>
                        </span>
                        <span className="shrink-0 text-xs text-zinc-600">{g.productCount}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-1.5 border-t border-white/[0.06] pt-4">
                  {categories.map((c) => (
                    <Link
                      key={c}
                      to={`/products?type=${c}`}
                      className="rounded-full border border-white/[0.08] px-2.5 py-1 text-[11px] font-medium text-zinc-400 transition-colors duration-300 hover:border-accent-light/50 hover:text-white"
                    >
                      {c}
                    </Link>
                  ))}
                  <span className="ml-auto self-center text-[11px] text-zinc-600">
                    {products.length} total
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
