import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { games } from '../data/games';
import { GameCard } from '../components/GameCard';
import { Reveal, Stagger } from '../components/anim/Reveal';

export function GameCategories() {
  return (
    <section className="relative py-24">
      <div className="container-wide">
        <Reveal>
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="section-label">Game Discovery</p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
                What are you playing?
              </h2>
              <p className="mt-3 max-w-lg text-zinc-400">
                Fresh stock across 15+ games. Pick your title and get playing in minutes.
              </p>
            </div>
            <Link
              to="/games"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-accent-bright transition-colors hover:text-white"
            >
              View All Games
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>

        <Stagger className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5" step={0.05}>
          {games.map((g) => (
            <GameCard key={g.id} game={g} />
          ))}
        </Stagger>
      </div>
    </section>
  );
}
