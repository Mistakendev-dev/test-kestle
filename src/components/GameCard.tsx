import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { Game } from '../data/games';
import { productsByGame } from '../data/products';

export function GameCard({ game }: { game: Game }) {
  const count = productsByGame(game.id).length;

  return (
    <Link to={`/games/${game.id}`} className="group block h-full">
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className="relative h-full overflow-hidden rounded-2xl border border-edge bg-panel/60 transition-all duration-300 group-hover:border-accent-light/40 group-hover:shadow-[0_0_40px_-12px_rgba(74,79,158,0.85)]"
      >
        <div
          className="relative flex h-32 items-center justify-center overflow-hidden transition-transform duration-500 group-hover:scale-105 md:h-36"
          style={{
            background: `radial-gradient(110% 110% at 50% 0%, ${game.colorSoft} 0%, rgba(5,5,7,0.95) 70%)`,
          }}
        >
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `linear-gradient(${game.color}20 1px, transparent 1px), linear-gradient(90deg, ${game.color}20 1px, transparent 1px)`,
              backgroundSize: '28px 28px',
            }}
          />
          <span
            className="font-display text-3xl font-bold tracking-tight transition-all duration-300 group-hover:brightness-125 md:text-4xl"
            style={{ color: game.color, textShadow: `0 0 30px ${game.color}60` }}
          >
            {game.short}
          </span>
          <div
            className="absolute inset-x-0 bottom-0 h-12 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: `linear-gradient(to top, ${game.color}25, transparent)` }}
          />
        </div>
        <div className="flex items-center justify-between p-4">
          <div>
            <div className="text-sm font-semibold text-white transition-colors group-hover:text-accent-bright">
              {game.name}
            </div>
            <div className="mt-0.5 text-xs text-zinc-500">
              {game.genre} · {count} products
            </div>
          </div>
          <ArrowUpRight className="h-4 w-4 -translate-x-1 text-accent-bright opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
        </div>
      </motion.div>
    </Link>
  );
}
