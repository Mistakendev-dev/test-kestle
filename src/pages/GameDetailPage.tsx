import { Link, useParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { getGame } from '../data/games';
import { productsByGame } from '../data/products';
import { ProductGrid } from '../components/ProductGrid';
import { Reveal } from '../components/anim/Reveal';

export function GameDetailPage() {
  const { id } = useParams<{ id: string }>();
  const game = getGame(id ?? '');

  if (!game) {
    return (
      <div className="container-wide flex min-h-[70vh] flex-col items-center justify-center gap-4 pt-24 text-center">
        <p className="font-display text-2xl font-bold text-white">Game not found</p>
        <Link to="/games" className="btn-primary btn-shine mt-2">View All Games</Link>
      </div>
    );
  }

  const list = productsByGame(game.id);
  const inStock = list.filter((p) => p.stock > 0).length;
  const lowest = Math.min(...list.map((p) => p.price));

  return (
    <div className="pb-24 pt-24 md:pt-32">
      <div
        className="relative overflow-hidden border-b border-edge"
        style={{ background: `radial-gradient(80% 120% at 50% 0%, ${game.colorSoft} 0%, transparent 70%)` }}
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `linear-gradient(${game.color}15 1px, transparent 1px), linear-gradient(90deg, ${game.color}15 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
        <div className="container-wide relative py-14">
          <Reveal>
            <nav className="mb-6 flex items-center gap-1.5 text-sm text-zinc-500">
              <Link to="/" className="transition-colors hover:text-white">Home</Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <Link to="/games" className="transition-colors hover:text-white">Games</Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-zinc-300">{game.name}</span>
            </nav>
            <span
              className="font-display text-6xl font-bold tracking-tight md:text-7xl"
              style={{ color: game.color, textShadow: `0 0 60px ${game.color}60` }}
            >
              {game.short}
            </span>
            <h1 className="mt-2 font-display text-2xl font-semibold text-white">{game.name} Accounts</h1>
            <div className="mt-5 flex flex-wrap gap-6 text-sm text-zinc-400">
              <span><span className="font-semibold text-white">{list.length}</span> products</span>
              <span><span className="font-semibold text-white">{inStock}</span> in stock</span>
              <span>from <span className="font-semibold text-white">${lowest.toFixed(2)}</span></span>
              <span className="rounded-md bg-white/[0.05] px-2 py-0.5 text-xs">{game.genre}</span>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="container-wide mt-12">
        <ProductGrid products={list} animateLayout={false} />
      </div>
    </div>
  );
}
