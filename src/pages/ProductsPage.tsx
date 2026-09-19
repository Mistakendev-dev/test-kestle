import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, PackageSearch, SlidersHorizontal, X } from 'lucide-react';
import { products, type ProductCategory } from '../data/products';
import { games } from '../data/games';
import { formatPrice } from '../lib/utils';
import { ProductCard } from '../components/ProductCard';
import { Reveal } from '../components/anim/Reveal';
import { cn } from '../lib/utils';

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'newest';

const sortOptions: { key: SortKey; label: string }[] = [
  { key: 'featured', label: 'Featured' },
  { key: 'price-asc', label: 'Price: Low to High' },
  { key: 'price-desc', label: 'Price: High to Low' },
  { key: 'newest', label: 'Newest' },
];

const categories: (ProductCategory | 'All')[] = ['All', 'NFA', 'FA', 'Ranked', 'Stacked'];
const MAX_PRICE = 120;

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState<SortKey>('featured');
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const selectedGame = searchParams.get('game') ?? 'all';
  const selectedType = (searchParams.get('type') ?? 'All') as ProductCategory | 'All';

  const setParam = (key: string, value: string, fallback: string) => {
    const next = new URLSearchParams(searchParams);
    if (value === fallback) next.delete(key);
    else next.set(key, value);
    setSearchParams(next, { replace: true });
  };

  const filtered = useMemo(() => {
    let list = [...products];
    if (selectedGame !== 'all') list = list.filter((p) => p.game === selectedGame);
    if (selectedType !== 'All') list = list.filter((p) => p.category === selectedType);
    list = list.filter((p) => p.price <= maxPrice);
    if (inStockOnly) list = list.filter((p) => p.stock > 0);
    switch (sort) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        list.sort((a, b) => b.createdAt - a.createdAt);
        break;
      default:
        list.sort((a, b) => b.sold - a.sold);
    }
    return list;
  }, [selectedGame, selectedType, maxPrice, inStockOnly, sort]);

  const activeFilters =
    (selectedGame !== 'all' ? 1 : 0) + (selectedType !== 'All' ? 1 : 0) + (maxPrice < MAX_PRICE ? 1 : 0) + (inStockOnly ? 1 : 0);

  const clearFilters = () => {
    setSearchParams({}, { replace: true });
    setMaxPrice(MAX_PRICE);
    setInStockOnly(false);
  };

  const filterPanel = (
    <div className="space-y-7">
      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Game</h4>
        <div className="max-h-56 space-y-1 overflow-y-auto pr-1">
          <button
            onClick={() => setParam('game', 'all', 'all')}
            className={cn(
              'block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors',
              selectedGame === 'all' ? 'bg-accent/20 font-medium text-white' : 'text-zinc-400 hover:bg-white/[0.04] hover:text-white',
            )}
          >
            All Games
          </button>
          {games.map((g) => (
            <button
              key={g.id}
              onClick={() => setParam('game', g.id, 'all')}
              className={cn(
                'flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors',
                selectedGame === g.id ? 'bg-accent/20 font-medium text-white' : 'text-zinc-400 hover:bg-white/[0.04] hover:text-white',
              )}
            >
              {g.name}
              <span className="text-xs text-zinc-600">{g.productCount}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Product Type</h4>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setParam('type', c, 'All')}
              className={cn(
                'rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-300',
                selectedType === c
                  ? 'border-accent-light/60 bg-accent/25 text-white'
                  : 'border-edge bg-white/[0.02] text-zinc-400 hover:border-accent-light/40 hover:text-white',
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Max Price</h4>
        <input
          type="range"
          min={3}
          max={MAX_PRICE}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-[#4a4f9e]"
        />
        <div className="mt-1 flex justify-between text-xs text-zinc-500">
          <span>{formatPrice(3)}</span>
          <span className="font-semibold text-accent-bright">
            {maxPrice >= MAX_PRICE ? 'Any' : `Up to ${formatPrice(maxPrice)}`}
          </span>
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Availability</h4>
        <button
          onClick={() => setInStockOnly((v) => !v)}
          className="flex w-full items-center justify-between rounded-lg border border-edge bg-white/[0.02] px-3 py-2.5 text-sm text-zinc-300 transition-colors hover:border-accent-light/40"
        >
          In stock only
          <span
            className={cn(
              'relative h-5 w-9 rounded-full transition-colors duration-300',
              inStockOnly ? 'bg-accent-light' : 'bg-zinc-700',
            )}
          >
            <span
              className={cn(
                'absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all duration-300',
                inStockOnly ? 'left-[18px]' : 'left-0.5',
              )}
            />
          </span>
        </button>
      </div>

      {activeFilters > 0 && (
        <button
          onClick={clearFilters}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-edge py-2.5 text-xs font-medium text-zinc-400 transition-colors hover:border-red-400/40 hover:text-red-300"
        >
          <X className="h-3.5 w-3.5" /> Clear all filters ({activeFilters})
        </button>
      )}
    </div>
  );

  return (
    <div className="container-wide pb-24 pt-28 md:pt-36">
      <Reveal>
        <div className="mb-10">
          <p className="section-label">Marketplace</p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-white md:text-5xl">All Products</h1>
          <p className="mt-3 text-zinc-400">
            {filtered.length} of {products.length} accounts
            {selectedGame !== 'all' && ` in ${games.find((g) => g.id === selectedGame)?.name}`}
          </p>
        </div>
      </Reveal>

      <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-edge bg-panel/40 p-6">{filterPanel}</div>
        </aside>

        <div>
          <div className="mb-6 flex items-center justify-between gap-3">
            <button
              onClick={() => setFiltersOpen(true)}
              className="btn-ghost !px-4 !py-2.5 text-xs lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilters > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
                  {activeFilters}
                </span>
              )}
            </button>
            <div className="relative ml-auto">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="appearance-none rounded-xl border border-edge bg-white/[0.03] py-2.5 pl-4 pr-10 text-sm text-zinc-200 outline-none transition-colors focus:border-accent-light/60"
              >
                {sortOptions.map((o) => (
                  <option key={o.key} value={o.key} className="bg-panel">
                    {o.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-edge bg-white/[0.02] py-20 text-center">
              <PackageSearch className="h-10 w-10 text-zinc-600" />
              <div>
                <p className="font-display text-lg font-semibold text-white">No products match your filters</p>
                <p className="mt-1 text-sm text-zinc-500">Try widening the price range or clearing a filter.</p>
              </div>
              <button onClick={clearFilters} className="btn-ghost !px-5 !py-2.5 text-xs">
                Clear filters
              </button>
            </div>
          ) : (
            <motion.div layout className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {filtered.map((p) => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCard product={p} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {filtersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[80] bg-void/70 backdrop-blur-sm lg:hidden"
              onClick={() => setFiltersOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 32 }}
              className="fixed inset-y-0 left-0 z-[90] w-full max-w-xs overflow-y-auto border-r border-edge bg-panel p-6 lg:hidden"
            >
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold text-white">Filters</h3>
                <button
                  onClick={() => setFiltersOpen(false)}
                  aria-label="Close filters"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 hover:bg-white/[0.05] hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              {filterPanel}
              <button onClick={() => setFiltersOpen(false)} className="btn-primary mt-6 w-full">
                Show {filtered.length} results
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
