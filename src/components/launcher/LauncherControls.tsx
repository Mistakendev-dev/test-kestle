import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * Control primitives for the launcher showcase. They are presentational only —
 * each one holds a visual state and reports changes upward, nothing more.
 */

function Row({ label, hint, children }: { label: string; hint: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-5 rounded-xl border border-edge/70 bg-white/[0.02] px-4 py-3.5 transition-colors duration-300 hover:border-accent-light/30 hover:bg-white/[0.04]">
      <div className="min-w-0">
        <span className="block truncate text-sm font-medium text-zinc-100">{label}</span>
        <p className="mt-0.5 truncate text-xs text-zinc-500">{hint}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export function LauncherToggle({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <Row label={label} hint={hint}>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        aria-label={label}
        onClick={() => onChange(!value)}
        className={cn(
          'relative flex h-7 w-12 items-center rounded-full border px-0.5 transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-accent-bright/70',
          value ? 'border-accent-light/60 bg-accent' : 'border-edge bg-white/[0.06]',
        )}
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 520, damping: 34 }}
          className={cn(
            'h-5 w-5 rounded-full shadow-sm',
            value ? 'ml-auto bg-white' : 'bg-zinc-500',
          )}
        />
      </button>
    </Row>
  );
}

export function LauncherCheck({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <Row label={label} hint={hint}>
      <button
        type="button"
        role="checkbox"
        aria-checked={value}
        aria-label={label}
        onClick={() => onChange(!value)}
        className={cn(
          'flex h-7 w-7 items-center justify-center rounded-lg border transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-accent-bright/70',
          value
            ? 'border-accent-light/70 bg-accent text-white'
            : 'border-edge bg-white/[0.04] text-transparent hover:border-zinc-600',
        )}
      >
        <motion.span
          initial={false}
          animate={{ scale: value ? 1 : 0.4, opacity: value ? 1 : 0 }}
          transition={{ type: 'spring', stiffness: 520, damping: 30 }}
        >
          <Check className="h-4 w-4" strokeWidth={3} />
        </motion.span>
      </button>
    </Row>
  );
}

export function LauncherSlider({
  id,
  label,
  hint,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  id: string;
  label: string;
  hint: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="rounded-xl border border-edge/70 bg-white/[0.02] px-4 py-3.5 transition-colors duration-300 hover:border-accent-light/30 hover:bg-white/[0.04]">
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-sm font-medium text-zinc-100">
          {label}
        </label>
        <span className="font-display text-sm font-semibold tabular-nums text-accent-bright">
          {value}
          {unit}
        </span>
      </div>
      <p className="mt-0.5 text-xs text-zinc-500">{hint}</p>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range-accent mt-3 w-full"
        style={{ '--pct': `${pct}%` } as React.CSSProperties}
      />
    </div>
  );
}

export function LauncherSelect({
  label,
  hint,
  value,
  options,
  onChange,
}: {
  label: string;
  hint: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(() => Math.max(0, options.indexOf(value)));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  function commit(i: number) {
    onChange(options[i]);
    setActive(i);
    setOpen(false);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      setOpen(false);
      return;
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      const next = e.key === 'ArrowDown' ? active + 1 : active - 1;
      setActive((next + options.length) % options.length);
      return;
    }
    if (open && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      commit(active);
    }
  }

  return (
    <Row label={label} hint={hint}>
      <div ref={ref} className="relative">
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={label}
          onClick={() => setOpen((o) => !o)}
          onKeyDown={onKeyDown}
          className={cn(
            'flex w-44 items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left text-xs font-medium transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-accent-bright/70',
            open
              ? 'border-accent-light/60 bg-accent/20 text-white'
              : 'border-edge bg-white/[0.04] text-zinc-200 hover:border-zinc-600',
          )}
        >
          <span className="truncate">{value}</span>
          <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
          </motion.span>
        </button>

        <AnimatePresence>
          {open && (
            <motion.ul
              role="listbox"
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-full z-30 mt-1.5 w-44 overflow-hidden rounded-lg border border-accent-light/30 bg-panel/95 p-1 shadow-[0_20px_40px_-18px_rgba(0,0,0,0.9)] backdrop-blur-xl"
            >
              {options.map((opt, i) => (
                <li key={opt}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={opt === value}
                    onClick={() => commit(i)}
                    onMouseEnter={() => setActive(i)}
                    className={cn(
                      'flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-2 text-left text-xs transition-colors duration-150',
                      i === active ? 'bg-accent/40 text-white' : 'text-zinc-300',
                    )}
                  >
                    <span className="truncate">{opt}</span>
                    {opt === value && <Check className="h-3.5 w-3.5 shrink-0 text-accent-bright" />}
                  </button>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </Row>
  );
}
