import { games } from '../data/games';
import { GameCard } from '../components/GameCard';
import { Reveal, Stagger } from '../components/anim/Reveal';

export function GamesPage() {
  return (
    <div className="container-wide pb-24 pt-28 md:pt-36">
      <Reveal>
        <div className="mb-12">
          <p className="section-label">Games</p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-white md:text-5xl">
            Supported Games
          </h1>
          <p className="mt-3 max-w-lg text-zinc-400">
            Accounts in stock across {games.length} major titles. Select a game to browse its listings.
          </p>
        </div>
      </Reveal>
      <Stagger className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4" step={0.05}>
        {games.map((g) => (
          <GameCard key={g.id} game={g} />
        ))}
      </Stagger>
    </div>
  );
}
