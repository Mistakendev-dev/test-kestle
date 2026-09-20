import { type RefObject } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react';
import { CategoryRail, type RailOption } from '../../components/CategoryRail';
import { shortcutLabel } from '../../lib/utils';

export interface Chip {
  key: string;
  label: string;
  clear: () => void;
}

/**
 * The catalogue's control surface. Search, title rail and sort live on a single
 * pane docked below the navbar, so narrowing the results never means scrolling
 * back to the top. Purely presentational — the page owns every piece of state.
 */
export function CatalogControls({
  query,
  onQuery,
  searchRef,
  railOptions,
  selectedGame,
  onGame,
  sort,
  onSort,
  sortOptions,
  resultCount,
  totalCount,
  activeFilters,
  onOpenFilters,
  chips,
  onClearAll,
}: {
  query: string;
  onQuery: (v: string) => void;
  searchRef: RefObject<HTMLInputElement | null>;
  railOptions: RailOption[];
  selectedGame: string;
  onGame: (id: string) => void;
  sort: string;
  onSort: (v: string) => void;
  sortOptions: { key: string; label: string }[];
  resultCount: number;
  totalCount: number;
  activeFilters: number;
  onOpenFilters: () => void;
  chips: Chip[];
  onClearAll: () => void;
}) {
  return (
    <div className="sticky top-[74px] z-30">
      <div className="glass-panel rounded-2xl p-3 sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="group relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-accent-bright" />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => onQuery(e.target.value)}
              placeholder="Search products or games..."
              aria-label="Search products or games"
              className="h-12 w-full rounded-xl border border-white/[0.07] bg-white/[0.03] pl-11 pr-24 text-sm text-white placeholder-zinc-600 outline-none transition-[border-color,background-color,box-shadow] duration-300 focus:border-accent-light/70 focus:bg-white/[0.06] focus:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_0_0_3px_rgba(74,79,158,0.18)]"
            />
            <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
              {query && (
                <button
                  onClick={() => onQuery('')}
                  aria-label="Clear search"
                  className="flex h-6 w-6 items-center justify-center rounded-md text-zinc-500 transition-colors hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
              <kbd className="hidden whitespace-nowrap rounded-md border border-edge bg-white/[0.04] px-1.5 py-0.5 font-body text-[10px] font-medium text-zinc-500 sm:block">
                {shortcutLabel()}
              </kbd>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenFilters}
              className="inline-flex h-12 shrink-0 items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 text-xs font-semibold text-zinc-300 transition-[border-color,background-color,color] duration-300 hover:border-accent-light/50 hover:bg-white/[0.06] hover:text-white"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilters > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
                  {activeFilters}
                </span>
              )}
            </button>

            <div className="relative flex-1 lg:flex-none">
              <select
                value={sort}
                onChange={(e) => onSort(e.target.value)}
                aria-label="Sort products"
                className="h-12 w-full appearance-none rounded-xl border border-white/[0.07] bg-white/[0.03] pl-4 pr-10 text-sm text-zinc-200 outline-none transition-colors duration-300 focus:border-accent-light/60 lg:w-auto"
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
        </div>

        <div className="mt-3 border-t border-white/[0.06] pt-3">
          <CategoryRail options={railOptions} value={selectedGame} onChange={onGame} />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <p className="mr-auto text-xs text-zinc-500">
            <span className="font-semibold text-white">{resultCount}</span> of {totalCount}
            <span className="hidden sm:inline"> listings</span>
          </p>
          <AnimatePresence initial={false}>
            {chips.map((c) => (
              <motion.button
                key={c.key}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.16 }}
                onClick={c.clear}
                className="group flex items-center gap-1.5 rounded-full border border-accent-light/40 bg-accent/20 py-1 pl-3 pr-2 text-xs font-medium text-white transition-colors hover:border-accent-light/70"
              >
                {c.label}
                <X className="h-3.5 w-3.5 text-zinc-400 transition-colors group-hover:text-white" />
              </motion.button>
            ))}
          </AnimatePresence>
          {chips.length > 1 && (
            <button
              onClick={onClearAll}
              className="px-1 text-xs font-medium text-zinc-500 underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              Clear all
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
