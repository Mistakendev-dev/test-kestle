import { useRef, type MouseEvent, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { usePointerEffects } from '../../hooks/usePointerEffects';
import { cn } from '../../lib/utils';

/**
 * Subtle cursor-driven 3D tilt, scoped to a single visual element. Intended for
 * artwork and media — never for buttons or interface chrome, which should stay
 * put under the cursor.
 *
 * Rotation is deliberately small (a few degrees) so the element reads as a
 * physical object catching the light rather than something flying around.
 */
export function Tilt({
  children,
  className,
  strength = 5,
  perspective = 1100,
}: {
  children: ReactNode;
  className?: string;
  /** Peak rotation in degrees at the element's edge. */
  strength?: number;
  perspective?: number;
}) {
  const enabled = usePointerEffects();
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 160, damping: 22 });
  const sy = useSpring(my, { stiffness: 160, damping: 22 });
  const rotateX = useTransform(sy, [0, 1], [strength, -strength]);
  const rotateY = useTransform(sx, [0, 1], [-strength, strength]);

  function handleMove(e: MouseEvent) {
    if (!enabled || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  }

  function release() {
    mx.set(0.5);
    my.set(0.5);
  }

  if (!enabled) return <div className={className}>{children}</div>;

  return (
    <div className={cn('relative', className)} style={{ perspective }}>
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={release}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="h-full w-full"
      >
        {children}
      </motion.div>
    </div>
  );
}
