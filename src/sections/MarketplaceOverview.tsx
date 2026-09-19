import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { games } from '../data/games';
import { products } from '../data/products';
import { ProductArt } from '../components/ProductArt';
import { Reveal } from '../components/anim/Reveal';
import { MagneticButton } from '../components/anim/MagneticButton';

/** Derived from the catalogue, so the panel can never drift from the data. */
const stats = [
  { value: String(games.length), label: 'Games' },
  { value: String(products.length), label: 'Options' },
  { value: products.reduce((n, p) => n + p.stock, 0).toLocaleString('en-US'), label: 'Available' },
];

/** A spread of titles for the backdrop collage. */
const collage = games.slice(0, 6);

export function MarketplaceOverview() {
  return (
    <section className="relative py-20 md:py-28">
      <div className="container-wide">
        <Reveal>
          <div className="pane-hero lit-edge overflow-hidden">
            {/* Cinematic artwork collage, pushed far back so the copy leads. */}
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 flex opacity-[0.16]">
                {collage.map((g) => (
                  <ProductArt key={g.id} gameId={g.id} size="lg" className="h-full flex-1" />
                ))}
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-surface-0 via-surface-0/80 to-surface-0/40" />
              <div
                className="absolute inset-0"
                style={{
                  background: 'radial-gradient(90% 120% at 20% 0%, rgba(46,48,106,0.4), transparent 62%)',
                }}
              />
            </div>

            <div className="relative grid gap-10 p-8 sm:p-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16 lg:p-16">
              <div>
                <p className="section-label">Marketplace</p>
                <h2 className="mt-4 font-display text-3xl font-bold leading-[1.08] tracking-tight text-white sm:text-4xl lg:text-5xl">
                  Everything available
                  <br />
                  in one place.
                </h2>
                <p className="mt-5 max-w-md text-[15px] leading-relaxed text-zinc-400">
                  Every listing across every supported title, filterable by game, price and
                  availability. Browse the whole catalogue in one view.
                </p>

                <div className="mt-9 flex flex-wrap items-center gap-4">
                  <MagneticButton>
                    <Link to="/products" className="btn-primary btn-shine !px-8 !py-3.5 text-[15px]">
                      Browse marketplace
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </MagneticButton>
                  <Link to="/games" className="btn-ghost !py-3.5">
                    View games
                  </Link>
                </div>
              </div>

              <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.06] lg:w-[380px]">
                {stats.map((s) => (
                  <div key={s.label} className="bg-surface-1/80 px-4 py-6 text-center lg:px-6 lg:py-8">
                    <dt className="sr-only">{s.label}</dt>
                    <dd>
                      <span className="block font-display text-2xl font-bold tracking-tight text-white lg:text-3xl">
                        {s.value}
                      </span>
                      <span className="mt-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                        {s.label}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
