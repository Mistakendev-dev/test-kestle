import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Search, X } from 'lucide-react';
import { products } from '../../data/products';
import { games, getGame } from '../../data/games';
import { formatPrice } from '../../lib/utils';
import { ProductArt } from '../ProductArt';

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      const t = setTimeout(() => inputRef.current?.focus(), 80);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const q = query.trim().toLowerCase();
  const matchedProducts = useMemo(
    () =>
      q
        ? products
            .filter(
              (p) =>
                p.name.toLowerCase().includes(q) ||
                getGame(p.game)?.name.toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q),
            )
            .slice(0, 6)
        : [],
    [q],
  );
  const matchedGames = useMemo(
    () => (q ? games.filter((g) => g.name.toLowerCase().includes(q)).slice(0, 4) : []),
    [q],
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[70] flex items-start justify-center bg-void/80 px-4 pt-24 backdrop-blur-md md:pt-32"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="glass-strong w-full max-w-2xl overflow-hidden rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-edge px-5">
              <Search className="h-5 w-5 shrink-0 text-accent-bright" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, games..."
                className="h-14 w-full bg-transparent text-base text-white placeholder-zinc-600 outline-none"
              />
              <button
                onClick={onClose}
                aria-label="Close search"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-white/[0.05] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[55vh] overflow-y-auto p-3">
              {q === '' && (
                <div className="px-3 py-8 text-center">
                  <p className="text-sm text-zinc-500">Start typing to search across {products.length} products and {games.length} games.</p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {['Rust', 'CS2', 'Valorant', 'NFA', 'Ranked'].map((s) => (
                      <button
                        key={s}
                        onClick={() => setQuery(s)}
                        className="rounded-lg border border-edge bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:border-accent-light/50 hover:text-white"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {q !== '' && matchedGames.length === 0 && matchedProducts.length === 0 && (
                <p className="px-3 py-8 text-center text-sm text-zinc-500">
                  No results for &ldquo;{query}&rdquo;
                </p>
              )}

              {matchedGames.length > 0 && (
                <div className="mb-2">
                  <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
                    Games
                  </p>
                  {matchedGames.map((g) => (
                    <Link
                      key={g.id}
                      to={`/games/${g.id}`}
                      onClick={onClose}
                      className="group flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors hover:bg-white/[0.04]"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="flex h-8 w-8 items-center justify-center rounded-lg font-display text-[10px] font-bold"
                          style={{ background: g.colorSoft, color: g.color }}
                        >
                          {g.short}
                        </span>
                        <span className="text-sm font-medium text-zinc-200 group-hover:text-white">{g.name}</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-zinc-600 transition-all group-hover:translate-x-0.5 group-hover:text-accent-bright" />
                    </Link>
                  ))}
                </div>
              )}

              {matchedProducts.length > 0 && (
                <div>
                  <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
                    Products
                  </p>
                  {matchedProducts.map((p) => (
                    <Link
                      key={p.id}
                      to={`/product/${p.id}`}
                      onClick={onClose}
                      className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-white/[0.04]"
                    >
                      <ProductArt gameId={p.game} className="h-10 w-14 shrink-0 rounded-lg" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-zinc-200 group-hover:text-white">{p.name}</p>
                        <p className="text-xs text-zinc-500">{getGame(p.game)?.name}</p>
                      </div>
                      <span className="font-display text-sm font-semibold text-white">{formatPrice(p.price)}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
