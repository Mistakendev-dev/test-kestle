import { useCallback, useMemo, useState } from 'react';
import { launcherPanes, type ControlValue } from '../data/launcher';

function defaults(): Record<string, ControlValue> {
  return Object.fromEntries(
    launcherPanes.flatMap((p) => p.controls.map((c) => [c.id, c.value] as const)),
  );
}

/** Visual state for the launcher showcase, plus a reset back to defaults. */
export function useLauncherDemo() {
  const [values, setValues] = useState<Record<string, ControlValue>>(defaults);
  const [pane, setPane] = useState(launcherPanes[0].id);

  const set = useCallback((id: string, v: ControlValue) => {
    setValues((prev) => ({ ...prev, [id]: v }));
  }, []);

  const reset = useCallback(() => {
    setValues(defaults());
    setPane(launcherPanes[0].id);
  }, []);

  const touched = useMemo(() => {
    const base = defaults();
    return Object.keys(base).some((k) => base[k] !== values[k]);
  }, [values]);

  return { values, set, reset, pane, setPane, touched };
}
