import { useEffect } from 'react';
import { usePointerEffects } from './usePointerEffects';

/**
 * Drives the global virtual light source. Writes the pointer position to two
 * custom properties on :root at most once per frame; every `.lit-edge` /
 * `.lit-surface` reads them through background-attachment: fixed.
 *
 * Mounted once, app-wide — one listener, no React state, no re-renders.
 */
export function useLightSource() {
  const enabled = usePointerEffects();

  useEffect(() => {
    const root = document.documentElement;
    if (!enabled) {
      root.style.setProperty('--light', '0');
      return;
    }

    let frame = 0;
    let x = 0;
    let y = 0;

    const flush = () => {
      frame = 0;
      root.style.setProperty('--px', `${x}px`);
      root.style.setProperty('--py', `${y}px`);
    };

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!frame) frame = requestAnimationFrame(flush);
    };

    const onEnter = () => root.style.setProperty('--light', '1');
    const onLeave = () => root.style.setProperty('--light', '0');

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerenter', onEnter);
    document.addEventListener('pointerleave', onLeave);
    onEnter();

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerenter', onEnter);
      document.removeEventListener('pointerleave', onLeave);
      root.style.setProperty('--light', '0');
    };
  }, [enabled]);
}
