import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { History } from 'lucide-react';
import { getRecentlyViewed } from '../lib/recentlyViewed';
import { getProduct, type Product } from '../data/products';
import { formatPrice } from '../lib/utils';
import { ProductArt } from '../components/ProductArt';
import { Reveal } from '../components/anim/Reveal';

export function RecentlyViewed({ showEmptyState = false }: { showEmptyState?: boolean }) {
  const location = useLocation();
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    // Never list the product the user is already looking at.
    const currentId = location.pathname.match(/^\/product\/(.+)$/)?.[1];
    const load = () =>
      setItems(
        getRecentlyViewed()
          .filter((id) => id !== currentId)
          .map(getProduct)
          .filter((p): p is Product => Boolean(p))
          .slice(0, 6),
      );
    load();
    window.addEventListener('nfa:recently-viewed', load);
    return () => window.removeEventListener('nfa:recently-viewed', load);
  }, [location.pathname]);

  if (items.length === 0 && !showEmptyState) return null;

  return (
    <section className="border-t border-edge bg-panel/20 py-14">
      <div className="container-wide">
        <Reveal>
          <div className="mb-6 flex items-center gap-2.5">
            <History className="h-4 w-4 text-accent-bright" />
            <h2 className="font-display text-lg font-semibold text-white">Recently Viewed</h2>
          </div>

          {items.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-edge bg-white/[0.02] px-6 py-12 text-center">
              <History className="h-8 w-8 text-zinc-700" />
              <p className="font-display text-base font-semibold text-white">No history yet</p>
              <p className="max-w-sm text-sm text-zinc-500">
                Products you open will appear here so you can jump straight back to them.
              </p>
              <Link to="/products" className="btn-ghost mt-1 !px-5 !py-2.5 text-xs">
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="no-scrollbar -mx-4 overflow-x-auto px-4 pb-2">
              <div className="flex gap-3">
                {items.map((p) => (
                  <Link
                    key={p.id}
                    to={`/products/${p.slug}`}
                    className="group flex w-[248px] shrink-0 items-center gap-3 rounded-2xl border border-edge bg-white/[0.02] p-3 transition-all duration-300 hover:border-accent-light/40 hover:bg-white/[0.04]"
                  >
                    <ProductArt
                      gameId={p.id}
                      image={p.image}
                      alt={p.name}
                      size="sm"
                      className="h-12 w-16 shrink-0 rounded-lg"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-zinc-200 group-hover:text-white">{p.name}</p>
                      <p className="font-display text-sm font-bold text-accent-bright">{formatPrice(p.price)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
