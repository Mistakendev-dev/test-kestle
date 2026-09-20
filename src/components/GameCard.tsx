import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { Game } from '../data/games';
import { productsByGame } from '../data/products';
import { ProductArt } from './ProductArt';
import { Tilt } from './anim/Tilt';

/** Shares the visual language of the homepage discovery grid. */
export function GameCard({ game }: { game: Game }) {
  const count = productsByGame(game.id).length;

  return (
    <Tilt strength={4} className="h-full">
    <Link
      to={`/games/${game.id}`}
      className="lit-edge group relative block overflow-hidden rounded-2xl border border-white/[0.07] shadow-rest transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-accent-light/45 hover:shadow-glow-lg"
    >
      <ProductArt
        gameId={game.id}
        size="md"
        className="aspect-[4/3] w-full transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]"
      />

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

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 transition-transform duration-500 ease-out group-hover:-translate-y-1">
        <div className="min-w-0">
          <h3 className="truncate font-display text-base font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-accent-bright md:text-lg">
            {game.name}
          </h3>
          <p className="mt-1 truncate text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-400">
            {game.genre} · {count} products
          </p>
        </div>
        <span className="flex h-9 w-9 shrink-0 translate-x-2 items-center justify-center rounded-full border border-edge bg-void/70 text-accent-bright opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
    </Tilt>
  );
}
