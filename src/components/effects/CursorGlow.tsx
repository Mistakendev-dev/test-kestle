import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function CursorGlow() {
  const x = useMotionValue(-500);
  const y = useMotionValue(-500);
  const sx = useSpring(x, { stiffness: 60, damping: 20 });
  const sy = useSpring(y, { stiffness: 60, damping: 20 });

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX - 250);
      y.set(e.clientY - 250);
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, [x, y]);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed z-[1] h-[500px] w-[500px] rounded-full"
      style={{
        x: sx,
        y: sy,
        background: 'radial-gradient(circle, rgba(46,48,106,0.12) 0%, transparent 65%)',
      }}
    />
  );
}
