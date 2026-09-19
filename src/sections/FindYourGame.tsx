import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { games } from '../data/games';
import { productsByGame } from '../data/products';
import { ProductArt } from '../components/ProductArt';
import { Reveal, Stagger } from '../components/anim/Reveal';

/** The six titles with the deepest catalogue get the large treatment. */
const featured = [...games]
  .sort((a, b) => productsByGame(b.id).length - productsByGame(a.id).length)
  .slice(0, 6);

export function FindYourGame() {
  return (
    <section className="relative py-24">
      <div className="container-wide">
        <Reveal>
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="section-label">Browse by title</p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
                Find your game
              </h2>
              <p className="mt-3 max-w-md text-zinc-400">
                Jump straight into the catalogue for the title you actually play.
              </p>
            </div>
            <Link
              to="/games"
              className="btn-ghost group shrink-0 !py-2.5 text-sm"
            >
              All {games.length} games
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>

        {/* Horizontal browsing on phones, poster grid from tablet up. The child
            selectors size the Stagger wrappers without changing its API. */}
        <Stagger
          className="snap-row no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 [&>*]:w-[76vw] [&>*]:shrink-0 [&>*]:snap-start sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3 [&>*]:sm:w-auto"
          step={0.08}
        >
          {featured.map((game) => {
            const count = productsByGame(game.id).length;
            return (
              <Link
                key={game.id}
                to={`/games/${game.id}`}
                className="group relative overflow-hidden rounded-2xl border border-edge transition-all duration-500 hover:-translate-y-1.5 hover:border-accent-light/45 hover:shadow-[0_0_60px_-18px_rgba(74,79,158,0.9)]"
              >
                <ProductArt
                  gameId={game.id}
                  size="lg"
                  className="aspect-[4/3] w-full transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]"
                />

                {/* Overlay deepens on hover so the copy stays readable. */}
                <div
                  aria-hidden
                  className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-0"
                  style={{ background: 'linear-gradient(to top, rgba(5,5,7,0.55), transparent 55%)' }}
                />
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: `linear-gradient(to top, ${game.color}26, transparent 60%)` }}
                />

                {/* Copy lifts on hover, so the card reads as responding rather
                    than just brightening. */}
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 transition-transform duration-500 ease-out group-hover:-translate-y-1">
                  <div className="min-w-0">
                    <h3 className="truncate font-display text-xl font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-accent-bright">
                      {game.name}
                    </h3>
                    <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
                      {game.genre} · {count} products
                    </p>
                  </div>
                  <span className="flex h-10 w-10 shrink-0 translate-x-2 items-center justify-center rounded-full border border-edge bg-void/70 text-accent-bright opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                    <ArrowUpRight className="h-5 w-5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
