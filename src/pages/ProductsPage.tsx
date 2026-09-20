import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { PackageSearch, X } from 'lucide-react';
import { matchesQuery, products, type ProductCategory } from '../data/products';
import { games } from '../data/games';
import { cn, formatPrice } from '../lib/utils';
import { ProductGrid } from '../components/ProductGrid';
import { type RailOption } from '../components/CategoryRail';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { CatalogHero } from '../sections/catalog/CatalogHero';
import { CatalogControls, type Chip } from '../sections/catalog/CatalogControls';
import { CatalogSpotlight } from '../sections/catalog/CatalogSpotlight';
import { CatalogGames } from '../sections/catalog/CatalogGames';
import { CatalogOutro } from '../sections/catalog/CatalogOutro';

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

/** Strongest listing in the catalogue — the one the spotlight band presents. */
const spotlight = [...products].sort(
  (a, b) => Number(b.featured) - Number(a.featured) || b.popularity - a.popularity,
)[0];

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState<SortKey>('featured');
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  // Seeded from ?q= so links in from the homepage search land pre-filtered.
  const [query, setQuery] = useState(() => searchParams.get('q') ?? '');

  const selectedGame = searchParams.get('game') ?? 'all';
  const selectedType = (searchParams.get('type') ?? 'All') as ProductCategory | 'All';

  useBodyScrollLock(filtersOpen);
  useEscapeKey(filtersOpen, () => setFiltersOpen(false));

  // Re-sync when ?q= changes while the page stays mounted. Typing only touches
  // local state, so this never fights the input.
  const urlQuery = searchParams.get('q') ?? '';
  useEffect(() => setQuery(urlQuery), [urlQuery]);

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

  // The spotlight presents a listing the visitor did not ask for. Once they
  // have narrowed the catalogue down, that is noise — so it steps aside.
  const browsing = activeFilters === 0 && !query.trim();

  const clearFilters = () => {
    setSearchParams({}, { replace: true });
    setMaxPrice(MAX_PRICE);
    setInStockOnly(false);
    setQuery('');
  };

  const selectGame = (id: string) => {
    setParam('game', id, 'all');
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const chips: Chip[] = [];
  if (query.trim())
    chips.push({ key: 'q', label: `“${query.trim()}”`, clear: () => setQuery('') });
  if (selectedGame !== 'all')
    chips.push({
      key: 'game',
      label: games.find((g) => g.id === selectedGame)?.name ?? selectedGame,
      clear: () => setParam('game', 'all', 'all'),
    });
  if (selectedType !== 'All')
    chips.push({ key: 'type', label: selectedType, clear: () => setParam('type', 'All', 'All') });
  if (maxPrice < MAX_PRICE)
    chips.push({
      key: 'price',
      label: `Under ${formatPrice(maxPrice)}`,
      clear: () => setMaxPrice(MAX_PRICE),
    });
  if (inStockOnly)
    chips.push({ key: 'stock', label: 'In stock', clear: () => setInStockOnly(false) });

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
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Product Type
        </h4>
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
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Max Price
        </h4>
        <input
          type="range"
          min={3}
          max={MAX_PRICE}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          aria-label="Maximum price"
          className="range-accent w-full"
          style={{ '--pct': `${((maxPrice - 3) / (MAX_PRICE - 3)) * 100}%` } as never}
        />
        <div className="mt-2 flex justify-between text-xs text-zinc-500">
          <span>{formatPrice(3)}</span>
          <span className="font-semibold text-accent-bright">
            {maxPrice >= MAX_PRICE ? 'Any' : `Up to ${formatPrice(maxPrice)}`}
          </span>
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Availability
        </h4>
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
      <CatalogHero />

      {/* Console, showcase and grid share one stacking context so the controls
          stay docked for the whole browsing stretch. */}
      <div className="relative">
        <div className="container-wide">
          <CatalogControls
            query={query}
            onQuery={setQuery}
            searchRef={searchRef}
            railOptions={railOptions}
            selectedGame={selectedGame}
            onGame={(id) => setParam('game', id, 'all')}
            sort={sort}
            onSort={(v) => setSort(v as SortKey)}
            sortOptions={sortOptions}
            resultCount={filtered.length}
            totalCount={products.length}
            activeFilters={activeFilters}
            onOpenFilters={() => setFiltersOpen(true)}
            chips={chips}
            onClearAll={clearFilters}
          />
        </div>

        {browsing && spotlight && <CatalogSpotlight product={spotlight} />}

        <div ref={gridRef} className={cn('container-wide scroll-mt-40', browsing ? 'pt-0' : 'pt-12')}>
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel flex flex-col items-center gap-4 rounded-2xl px-6 py-20 text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.03]">
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
            <ProductGrid products={filtered} columns="catalog" />
          )}
        </div>
      </div>

      <CatalogGames onSelect={selectGame} />
      <CatalogOutro />

      <AnimatePresence>
        {filtersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[80] bg-void/70 backdrop-blur-sm"
              onClick={() => setFiltersOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Filters"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 32 }}
              className="fixed inset-y-0 left-0 z-[90] w-full max-w-xs overflow-y-auto border-r border-white/[0.08] bg-[#08080e]/95 p-6 shadow-deep backdrop-blur-2xl"
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
