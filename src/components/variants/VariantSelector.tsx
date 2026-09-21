import { useMemo, useState } from 'react';
import { Check } from 'lucide-react';
import type { GameProduct, Variant, VariantGroup } from '../../data/products';
import { variantGroups } from '../../data/products';
import { cn, formatPrice } from '../../lib/utils';
import { StockBadge } from '../Badge';

/**
 * The option list for a game. One row per variant carrying its own price and
 * stock, with a group rail that only appears when a title has enough options
 * to be worth filtering.
 */
export function VariantSelector({
  product,
  selectedId,
  onSelect,
  compact = false,
}: {
  product: GameProduct;
  selectedId: string;
  onSelect: (variant: Variant) => void;
  compact?: boolean;
}) {
  const groups = useMemo(() => variantGroups(product), [product]);
  const showRail = product.variantCount > 6 && groups.length > 1;
  const [filter, setFilter] = useState<VariantGroup | 'all'>('all');

  const visible = useMemo(
    () =>
      filter === 'all'
        ? product.variants
        : product.variants.filter((v) => v.group === filter),
    [product, filter],
  );

  return (
    <div>
      {showRail && (
        <div
          role="group"
          aria-label="Filter options"
          className="-mx-1 mb-4 flex snap-x gap-1.5 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <RailButton active={filter === 'all'} onClick={() => setFilter('all')}>
            All {product.variantCount}
          </RailButton>
          {groups.map(({ group, variants }) => (
            <RailButton key={group} active={filter === group} onClick={() => setFilter(group)}>
              {group} {variants.length}
            </RailButton>
          ))}
        </div>
      )}

      <ul
        className={cn(
          'glass-panel divide-y divide-white/[0.06] overflow-hidden rounded-2xl',
          compact && 'max-h-[19rem] overflow-y-auto',
        )}
      >
        {visible.map((variant) => {
          const selected = variant.id === selectedId;
          return (
            <li key={variant.id}>
              <button
                type="button"
                onClick={() => onSelect(variant)}
                aria-pressed={selected}
                aria-label={`${variant.name} — ${formatPrice(variant.price)}`}
                className={cn(
                  'flex w-full items-center gap-3 px-4 py-3 text-left transition-colors duration-200',
                  selected ? 'bg-accent/25' : 'hover:bg-white/[0.04]',
                  !variant.available && 'opacity-55',
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-200',
                    selected
                      ? 'border-accent-light bg-accent-light text-black'
                      : 'border-white/20 text-transparent',
                  )}
                >
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-white">
                    {variant.name}
                  </span>
                  <StockBadge stock={variant.stock} className="mt-0.5" />
                </span>

                <span className="shrink-0 font-display text-base font-semibold text-white">
                  {formatPrice(variant.price)}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function RailButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'shrink-0 snap-start rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors duration-200',
        active
          ? 'border-accent-light/60 bg-accent/40 text-white'
          : 'border-white/10 bg-white/[0.04] text-zinc-400 hover:border-white/20 hover:text-white',
      )}
    >
      {children}
    </button>
  );
}
