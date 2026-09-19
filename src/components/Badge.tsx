import { cn } from '../lib/utils';

const styles: Record<string, string> = {
  'Best Seller': 'bg-accent/90 text-white',
  New: 'bg-emerald-500/90 text-white',
  'Low Stock': 'bg-amber-500/90 text-black',
};

export function Badge({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
        styles[label] ?? 'bg-zinc-700 text-white',
        className,
      )}
    >
      {label}
    </span>
  );
}

export function StockIndicator({ stock, className }: { stock: number; className?: string }) {
  const low = stock <= 10;
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs font-medium', className)}>
      <span
        className={cn('h-1.5 w-1.5 rounded-full', low ? 'bg-amber-400' : 'bg-emerald-400 live-dot')}
      />
      <span className={low ? 'text-amber-400' : 'text-emerald-400'}>
        {low ? `LOW STOCK — ${stock} LEFT` : 'IN STOCK'}
      </span>
    </span>
  );
}
