import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { Reveal } from '../components/anim/Reveal';

interface Stat {
  value: number;
  format: (n: number) => string;
  label: string;
}

/**
 * Placeholder figures for layout only. Replace with real reporting before
 * launch — they are labelled as sample data in the UI so nothing here reads
 * as a verified claim.
 */
const stats: Stat[] = [
  { value: 10000, format: (n) => `${Math.round(n).toLocaleString()}+`, label: 'Products Sold' },
  { value: 99, format: (n) => `${Math.round(n)}%`, label: 'Customer Satisfaction' },
  { value: 24, format: (n) => `${Math.round(n)}/7`, label: 'Support' },
  { value: 60, format: (n) => (n >= 60 ? 'Instant' : `${Math.round(n)}s`), label: 'Delivery' },
];

function Counter({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [display, setDisplay] = useState(() => stat.format(0));

  useEffect(() => {
    if (!inView) return;
    const duration = 1600;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(stat.format(stat.value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, stat]);

  return <span ref={ref}>{display}</span>;
}

export function Stats() {
  return (
    <section className="relative border-y border-edge bg-panel/30 py-16">
      <div className="container-wide">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.1}>
              <div className="text-center">
                <div className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl">
                  <Counter stat={s} />
                </div>
                <div className="mx-auto mt-3 h-px w-10 bg-gradient-to-r from-transparent via-accent-light to-transparent" />
                <p className="mt-3 text-sm font-medium text-zinc-500">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-10 text-center text-[11px] uppercase tracking-[0.2em] text-zinc-600">
          Sample figures for this demo storefront
        </p>
      </div>
    </section>
  );
}
