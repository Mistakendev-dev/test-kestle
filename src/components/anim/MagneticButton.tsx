import { useRef, type ReactNode, type MouseEvent } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '../../lib/utils';

export function MagneticButton({
  children,
  className,
  strength = 0.25,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18 });
  const sy = useSpring(y, { stiffness: 200, damping: 18 });

  const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

  function handleMove(e: MouseEvent) {
    if (isTouch || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * strength);
    y.set((e.clientY - rect.top - rect.height / 2) * strength);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={onClick}
      style={{ x: sx, y: sy }}
      className={cn('inline-block', className)}
    >
      {children}
    </motion.div>
  );
}
