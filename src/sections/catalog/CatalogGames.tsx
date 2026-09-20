import { Link } from 'react-router-dom';
import { games } from '../../data/games';
import { products } from '../../data/products';
import { ProductArt } from '../../components/ProductArt';
import { Tilt } from '../../components/anim/Tilt';
import { Reveal } from '../../components/anim/Reveal';

const counts = new Map(games.map((g) => [g.id, products.filter((p) => p.game === g.id).length]));

/**
 * Title discovery, kept deliberately narrow. Fifteen games would be a wall if
 * they were laid out as a grid, so they run as tall plates in a single
 * swipeable row — browsable without taking over the page.
 */
export function CatalogGames({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <section className="py-16 md:py-20">
      <div className="container-wide">
        <Reveal>
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="section-label">Browse by title</p>
              <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Pick your game
              </h2>
            </div>
            <Link
              to="/games"
              className="shrink-0 text-xs font-semibold text-zinc-400 underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              All titles
            </Link>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.08}>
        <div className="no-scrollbar snap-row mt-8 flex gap-4 overflow-x-auto px-4 pb-4 sm:px-6 lg:px-8">
          {games.map((g) => (
            <Tilt key={g.id} strength={4} className="snap-item shrink-0">
              <button
                type="button"
                onClick={() => onSelect(g.id)}
                aria-label={`Show ${g.name} listings`}
                className="group block w-[9.5rem] sm:w-[11rem]"
              >
                <div className="glass-card relative aspect-[2/3] overflow-hidden rounded-2xl transition-[border-color,box-shadow] duration-500 group-hover:border-accent-light/35 group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_26px_55px_-26px_rgba(0,0,0,1)]">
                  <ProductArt
                    gameId={g.id}
                    size="md"
                    className="absolute inset-0 h-full w-full transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(to top, rgba(4,4,7,0.95) 0%, rgba(4,4,7,0.6) 34%, transparent 66%)',
                    }}
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-3.5 text-left">
                    <p className="truncate font-display text-sm font-semibold text-white">{g.name}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                      {counts.get(g.id) ?? 0} listings
                    </p>
                  </div>
                </div>
              </button>
            </Tilt>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
