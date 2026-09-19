import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Maximize2, Minimize2, RotateCcw, X } from 'lucide-react';
import type { ControlValue } from '../../data/launcher';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { LauncherStage } from './LauncherStage';

interface DemoState {
  values: Record<string, ControlValue>;
  set: (id: string, v: ControlValue) => void;
  pane: string;
  setPane: (id: string) => void;
}

/** Expands the launcher into a focused, full-screen demonstration. */
export function LauncherImmersive({
  open,
  onClose,
  onReset,
  demo,
}: {
  open: boolean;
  onClose: () => void;
  onReset: () => void;
  demo: DemoState;
}) {
  const shellRef = useRef<HTMLDivElement>(null);
  const [fullscreen, setFullscreen] = useState(false);
  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !document.fullscreenElement) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    const sync = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', sync);
    return () => document.removeEventListener('fullscreenchange', sync);
  }, []);

  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen();
    else shellRef.current?.requestFullscreen();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={shellRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-modal="true"
          aria-label="Interactive launcher demo"
          className="fixed inset-0 z-[70] overflow-y-auto bg-void/95 backdrop-blur-xl"
        >
          <div
            aria-hidden
            className="pointer-events-none fixed inset-0"
            style={{
              background:
                'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(46,48,106,0.35), transparent 70%)',
            }}
          />

          <div className="relative mx-auto flex min-h-full w-full max-w-6xl flex-col px-4 py-5 sm:px-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="min-w-0">
                <p className="section-label">Interactive demo</p>
                <p className="mt-1 truncate text-sm text-zinc-400">
                  Visual demonstration only — nothing here is connected to real software.
                </p>
              </div>

              <div className="ml-auto flex items-center gap-2">
                <button type="button" onClick={onReset} className="btn-ghost !px-4 !py-2.5 text-xs">
                  <RotateCcw className="h-4 w-4" />
                  <span className="hidden sm:inline">Reset demo</span>
                </button>
                {typeof document !== 'undefined' && document.fullscreenEnabled && (
                  <button
                    type="button"
                    onClick={toggleFullscreen}
                    aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                    className="btn-ghost !px-4 !py-2.5 text-xs"
                  >
                    {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                    <span className="hidden sm:inline">Fullscreen</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close demo"
                  className="btn-ghost !px-4 !py-2.5 text-xs"
                >
                  <X className="h-4 w-4" />
                  <span className="hidden sm:inline">Close</span>
                </button>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 pb-6"
            >
              <LauncherStage demo={demo} immersive />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
