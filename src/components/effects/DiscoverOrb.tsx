import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { usePointerEffects } from '../../hooks/usePointerEffects';

/** Cursor distance at which the orb starts reacting. */
const FIELD = 190;

/**
 * A quiet light that drifts in the hero and wakes up when the cursor comes
 * near — it swells, then opens into a shortcut. Nothing depends on finding it,
 * which is the point: it rewards a wandering pointer.
 */
export function DiscoverOrb({ className = '' }: { className?: string }) {
  const rich = usePointerEffects();
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const proximity = useMotionValue(0);
  const eased = useSpring(proximity, { stiffness: 180, damping: 22 });
  const scale = useTransform(eased, [0, 1], [1, 1.9]);
  const haloScale = useTransform(eased, [0, 1], [1, 2.6]);
  const haloOpacity = useTransform(eased, [0, 1], [0.25, 0.75]);

  useEffect(() => {
    if (!rich) return;
    let frame = 0;
    let px = 0;
    let py = 0;

    const measure = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = px - (r.left + r.width / 2);
      const dy = py - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy);
      proximity.set(Math.max(0, 1 - d / FIELD));
    };

    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (!frame) frame = requestAnimationFrame(measure);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
    };
  }, [rich, proximity]);

  // Touch devices get the shortcut outright rather than a hidden affordance.
  if (!rich) return null;

  return (
    <div ref={ref} className={`pointer-events-none absolute z-30 ${className}`}>
      <div className="pointer-events-auto relative">
        <motion.span
          aria-hidden
          style={{ scale: haloScale, opacity: haloOpacity }}
          className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-bright/30 blur-xl"
        />
        <motion.button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Reveal marketplace shortcut"
          style={{ scale }}
          className="relative flex h-3 w-3 items-center justify-center rounded-full bg-accent-bright shadow-glow outline-none ring-offset-2 ring-offset-void focus-visible:ring-2 focus-visible:ring-accent-bright"
        >
          <span className="absolute inset-0 animate-ping rounded-full bg-accent-bright/40 [animation-duration:2.8s]" />
        </motion.button>

        <motion.div
          initial={false}
          animate={{
            opacity: open ? 1 : 0,
            y: open ? 0 : 6,
            pointerEvents: open ? 'auto' : 'none',
          }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-1/2 top-7 w-max -translate-x-1/2"
        >
          <Link
            to="/products"
            className="pane bevel flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:border-accent-light/50"
          >
            Explore the marketplace
            <ArrowUpRight className="h-3.5 w-3.5 text-accent-bright" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
