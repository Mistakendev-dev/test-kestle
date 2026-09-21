import { cn } from '../lib/utils';

/**
 * States the stock a variant or game actually has. Deliberately plain — it
 * reports a count rather than manufacturing urgency.
 */
export function StockBadge({
  stock,
  soldOutLabel = 'Out of stock',
  className,
}: {
  stock: number;
  soldOutLabel?: string;
  className?: string;
}) {
  const inStock = stock > 0;
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs font-medium', className)}>
      <span
        aria-hidden
        className={cn('h-1.5 w-1.5 rounded-full', inStock ? 'bg-emerald-400 live-dot' : 'bg-zinc-600')}
      />
      <span className={inStock ? 'text-emerald-400' : 'text-zinc-500'}>
        {inStock ? `${stock.toLocaleString()} available` : soldOutLabel}
      </span>
    </span>
  );
}
