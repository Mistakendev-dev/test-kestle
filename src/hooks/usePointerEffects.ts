import { useEffect, useState } from 'react';

/**
 * True only when the device has a precise pointer and the user has not asked
 * for reduced motion. Gates every tilt / parallax / cursor effect in the app.
 */
export function usePointerEffects() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!window.matchMedia) return;
    const fine = window.matchMedia('(pointer: fine)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setEnabled(fine.matches && !reduced.matches);
    update();
    fine.addEventListener('change', update);
    reduced.addEventListener('change', update);
    return () => {
      fine.removeEventListener('change', update);
      reduced.removeEventListener('change', update);
    };
  }, []);

  return enabled;
}
