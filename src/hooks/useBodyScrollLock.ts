import { useEffect } from 'react';

/**
 * Freezes page scroll while an overlay is open. Reference-counted so nested
 * overlays (search on top of a drawer) don't unlock the page early, and pads
 * for the scrollbar so the layout doesn't jump.
 */
let locks = 0;
let previousOverflow = '';
let previousPadding = '';

export function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;

    if (locks === 0) {
      const { body } = document;
      const gap = window.innerWidth - document.documentElement.clientWidth;
      previousOverflow = body.style.overflow;
      previousPadding = body.style.paddingRight;
      body.style.overflow = 'hidden';
      if (gap > 0) body.style.paddingRight = `${gap}px`;
    }
    locks++;

    return () => {
      locks--;
      if (locks === 0) {
        document.body.style.overflow = previousOverflow;
        document.body.style.paddingRight = previousPadding;
      }
    };
  }, [active]);
}
