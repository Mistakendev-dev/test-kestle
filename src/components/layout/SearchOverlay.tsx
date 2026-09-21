import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Search, X } from 'lucide-react';
import { matchesQuery, matchingVariants, products, totalVariants } from '../../data/products';
import { formatPrice } from '../../lib/utils';
import { ProductArt } from '../ProductArt';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { useEscapeKey } from '../../hooks/useEscapeKey';

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

  useEscapeKey(open, onClose);
  useBodyScrollLock(open);

  const q = query.trim().toLowerCase();

  // One result per game. Variants never surface as independent results; when a
  // query matches option names we name them under the game instead.
  const results = useMemo(() => {
    if (!q) return [];
    return products
      .filter((p) => matchesQuery(p, q))
      .map((product) => ({ product, matched: matchingVariants(product, q) }));
  }, [q]);

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
            className="pane-raised w-full max-w-2xl overflow-hidden rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-edge px-5">
              <Search className="h-5 w-5 shrink-0 text-accent-bright" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search games and options..."
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
                  <p className="text-sm text-zinc-500">
                    Start typing to search {products.length} titles and {totalVariants} options.
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {['Rust', 'CS2', 'Premium', 'Hours', 'Inactive'].map((s) => (
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

              {q !== '' && results.length === 0 && (
                <p className="px-3 py-8 text-center text-sm text-zinc-500">
                  No results for &ldquo;{query}&rdquo;
                </p>
              )}

              {results.map(({ product, matched }) => (
                <Link
                  key={product.id}
                  to={`/products/${product.slug}`}
                  onClick={onClose}
                  className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-white/[0.04]"
                >
                  <ProductArt
                    gameId={product.id}
                    image={product.image}
                    alt={product.name}
                    size="sm"
                    className="h-11 w-14 shrink-0 rounded-lg"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-zinc-200 group-hover:text-white">
                      {product.name}
                    </p>
                    <p className="truncate text-xs text-zinc-500">
                      {matched.length > 0
                        ? `${matched.length} matching option${matched.length === 1 ? '' : 's'} · ${matched
                            .slice(0, 2)
                            .map((v) => v.name)
                            .join(', ')}`
                        : `${product.variantCount} option${product.variantCount === 1 ? '' : 's'}`}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-600">From</p>
                    <p className="font-display text-sm font-semibold text-white">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-zinc-700 transition-all group-hover:translate-x-0.5 group-hover:text-accent-bright" />
                </Link>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
