import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

export interface RailOption {
  id: string;
  label: string;
  count?: number;
}

/** Swipeable, horizontally scrolling selector with an animated active pill. */
export function CategoryRail({
  options,
  value,
  onChange,
  layoutId = 'rail-indicator',
  className,
}: {
  options: RailOption[];
  value: string;
  onChange: (id: string) => void;
  layoutId?: string;
  className?: string;
}) {
  const scroller = useRef<HTMLDivElement>(null);

  // Keep the active chip visible when the value changes from elsewhere (URL, filters).
  useEffect(() => {
    const el = scroller.current?.querySelector<HTMLElement>(`[data-id="${value}"]`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [value]);

  return (
    <div className={cn('relative', className)}>
      <div ref={scroller} className="no-scrollbar mask-fade-x -mx-1 flex gap-2 overflow-x-auto px-1 py-1">
        {options.map((o) => {
          const active = o.id === value;
          return (
            <button
              key={o.id}
              data-id={o.id}
              onClick={() => onChange(o.id)}
              className={cn(
                'relative shrink-0 rounded-xl border px-4 py-2 text-sm font-medium transition-colors duration-300',
                active
                  ? 'border-accent-light/60 text-white'
                  : 'border-edge text-zinc-400 hover:border-accent-light/40 hover:text-white',
              )}
            >
              {active && (
                <motion.span
                  layoutId={layoutId}
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  className="absolute inset-0 rounded-xl bg-accent/30 shadow-[0_0_24px_-6px_rgba(74,79,158,0.9)]"
                />
              )}
              <span className="relative flex items-center gap-2 whitespace-nowrap">
                {o.label}
                {o.count !== undefined && (
                  <span className={cn('text-[11px]', active ? 'text-accent-bright' : 'text-zinc-600')}>
                    {o.count}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
