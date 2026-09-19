import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, PackageSearch, Search, SlidersHorizontal, X } from 'lucide-react';
import { matchesQuery, products, type ProductCategory } from '../data/products';
import { games } from '../data/games';
import { cn, formatPrice } from '../lib/utils';
import { ProductGrid } from '../components/ProductGrid';
import { CategoryRail, type RailOption } from '../components/CategoryRail';
import { Reveal } from '../components/anim/Reveal';

type SortKey = 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'popular';

const sortOptions: { key: SortKey; label: string }[] = [
  { key: 'featured', label: 'Featured' },
  { key: 'newest', label: 'Newest' },
  { key: 'price-asc', label: 'Price: Low to High' },
  { key: 'price-desc', label: 'Price: High to Low' },
  { key: 'popular', label: 'Popular' },
];

const types: (ProductCategory | 'All')[] = ['All', 'NFA', 'FA', 'Ranked', 'Stacked'];
const MAX_PRICE = 120;

const railOptions: RailOption[] = [
  { id: 'all', label: 'All', count: products.length },
  ...games.map((g) => ({
    id: g.id,
    label: g.name,
    count: products.filter((p) => p.game === g.id).length,
  })),
];

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState<SortKey>('featured');
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [query, setQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  const selectedGame = searchParams.get('game') ?? 'all';
  const selectedType = (searchParams.get('type') ?? 'All') as ProductCategory | 'All';

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const setParam = (key: string, value: string, fallback: string) => {
    const next = new URLSearchParams(searchParams);
    if (value === fallback) next.delete(key);
    else next.set(key, value);
    setSearchParams(next, { replace: true });
  };

  const filtered = useMemo(() => {
    let list = products.filter((p) => matchesQuery(p, query));
    if (selectedGame !== 'all') list = list.filter((p) => p.game === selectedGame);
    if (selectedType !== 'All') list = list.filter((p) => p.category === selectedType);
    list = list.filter((p) => p.price <= maxPrice);
    if (inStockOnly) list = list.filter((p) => p.stock > 0);

    const sorted = [...list];
    switch (sort) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        sorted.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case 'popular':
        sorted.sort((a, b) => b.popularity - a.popularity);
        break;
      default:
        sorted.sort(
          (a, b) => Number(b.featured) - Number(a.featured) || b.popularity - a.popularity,
        );
    }
    return sorted;
  }, [query, selectedGame, selectedType, maxPrice, inStockOnly, sort]);

  const activeFilters =
    (selectedGame !== 'all' ? 1 : 0) +
    (selectedType !== 'All' ? 1 : 0) +
    (maxPrice < MAX_PRICE ? 1 : 0) +
    (inStockOnly ? 1 : 0);

  const clearFilters = () => {
    setSearchParams({}, { replace: true });
    setMaxPrice(MAX_PRICE);
    setInStockOnly(false);
    setQuery('');
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
              selectedGame === 'all'
                ? 'bg-accent/20 font-medium text-white'
                : 'text-zinc-400 hover:bg-white/[0.04] hover:text-white',
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
                selectedGame === g.id
                  ? 'bg-accent/20 font-medium text-white'
                  : 'text-zinc-400 hover:bg-white/[0.04] hover:text-white',
              )}
            >
              {g.name}
              <span className="text-xs text-zinc-600">
                {products.filter((p) => p.game === g.id).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Product Type</h4>
        <div className="flex flex-wrap gap-2">
          {types.map((c) => (
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
          aria-label="Maximum price"
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
          aria-pressed={inStockOnly}
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
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-edge py-2.5 text-xs font-medium text-zinc-400 transition-colors hover:border-rose-400/40 hover:text-rose-300"
        >
          <X className="h-3.5 w-3.5" /> Clear all filters ({activeFilters})
        </button>
      )}
    </div>
  );

  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] overflow-hidden"
      >
        <div className="bg-grid absolute inset-0 opacity-[0.55]" />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 60% at 50% -10%, rgba(46,48,106,0.4) 0%, transparent 70%)',
          }}
        />
        <motion.div
          animate={{ x: ['-10%', '10%', '-10%'] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-24 left-1/2 h-72 w-[46rem] -translate-x-1/2 rounded-full opacity-40 blur-[110px]"
          style={{ background: 'radial-gradient(ellipse, rgba(74,79,158,0.45), transparent 70%)' }}
        />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-void" />
      </div>

      <div className="container-wide relative pb-24 pt-28 md:pt-36">
        <Reveal>
          <div className="max-w-2xl">
            <p className="section-label">Marketplace</p>
            <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              EXPLORE PRODUCTS
            </h1>
            <p className="mt-3 text-zinc-400">Browse our collection of gaming products.</p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="group relative mt-8 max-w-xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-accent-bright" />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products or games..."
              aria-label="Search products or games"
              className="h-12 w-full rounded-xl border border-edge bg-white/[0.03] pl-11 pr-24 text-sm text-white placeholder-zinc-600 outline-none transition-all duration-300 focus:border-accent-light/70 focus:bg-white/[0.05] focus:shadow-[0_0_30px_-8px_rgba(74,79,158,0.9)]"
            />
            <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
              {query && (
                <button
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="flex h-6 w-6 items-center justify-center rounded-md text-zinc-500 transition-colors hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
              <kbd className="hidden rounded-md border border-edge bg-white/[0.04] px-1.5 py-0.5 font-body text-[10px] font-medium text-zinc-500 sm:block">
                ⌘K
              </kbd>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.14}>
          <div className="mt-8">
            <CategoryRail
              options={railOptions}
              value={selectedGame}
              onChange={(id) => setParam('game', id, 'all')}
            />
          </div>
        </Reveal>

        <div className="mt-10 grid gap-10 lg:grid-cols-[250px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-edge bg-panel/40 p-6">{filterPanel}</div>
          </aside>

          <div className="min-w-0">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
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
                <p className="text-sm text-zinc-500">
                  <span className="font-semibold text-white">{filtered.length}</span> of {products.length}
                  <span className="hidden sm:inline"> products</span>
                </p>
              </div>

              <div className="relative ml-auto">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  aria-label="Sort products"
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
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-edge bg-white/[0.02] px-6 py-20 text-center"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-edge bg-white/[0.03]">
                  <PackageSearch className="h-7 w-7 text-zinc-600" />
                </div>
                <div>
                  <p className="font-display text-lg font-semibold text-white">
                    {query ? `No results for “${query}”` : 'No products match your filters'}
                  </p>
                  <p className="mx-auto mt-1 max-w-sm text-sm text-zinc-500">
                    Try a different search term, widen the price range, or clear a filter to see more.
                  </p>
                </div>
                <button onClick={clearFilters} className="btn-ghost !px-5 !py-2.5 text-xs">
                  Reset everything
                </button>
              </motion.div>
            ) : (
              <ProductGrid products={filtered} className="2xl:grid-cols-4" />
            )}
          </div>
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
