import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { launcherCallouts, type ControlValue } from '../../data/launcher';
import { usePointerEffects } from '../../hooks/usePointerEffects';
import { cn } from '../../lib/utils';
import { LauncherWindow } from './LauncherWindow';

interface DemoState {
  values: Record<string, ControlValue>;
  set: (id: string, v: ControlValue) => void;
  pane: string;
  setPane: (id: string) => void;
}

/**
 * The launcher plus its guided tour. The frame rests at a slight perspective
 * and levels out when approached, so the tilt never fights the controls.
 */
export function LauncherStage({ demo, immersive = false }: { demo: DemoState; immersive?: boolean }) {
  const rich = usePointerEffects();
  const [near, setNear] = useState(false);
  const [tour, setTour] = useState<string | null>(null);

  const active = launcherCallouts.find((c) => c.id === tour) ?? null;

  return (
    <div>
      <div
        className="relative"
        style={{ perspective: 1600 }}
        onMouseEnter={() => setNear(true)}
        onMouseLeave={() => {
          setNear(false);
          setTour(null);
        }}
      >
        {/* Ambient pool of light beneath the frame. */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-x-10 -bottom-12 -top-8 -z-10 blur-[80px]"
          style={{
            background:
              'radial-gradient(ellipse 55% 50% at 50% 55%, rgba(46,48,106,0.6), transparent 70%)',
          }}
        />

        <motion.div
          animate={
            rich && !immersive
              ? { rotateX: near ? 0 : 2.6, rotateY: near ? 0 : -2.2, scale: near ? 1 : 0.985 }
              : undefined
          }
          transition={{ type: 'spring', stiffness: 150, damping: 24 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <LauncherWindow
            activePane={demo.pane}
            onPaneChange={demo.setPane}
            values={demo.values}
            onChange={demo.set}
            highlight={active?.rect ?? null}
          />

          {/* Hotspots — pointer devices only, they would crowd a small screen. */}
          <div className="pointer-events-none absolute inset-0 z-30 hidden lg:block">
            {launcherCallouts.map((c) => {
              const on = tour === c.id;
              return (
                <div
                  key={c.id}
                  className="pointer-events-auto absolute"
                  style={{ left: `${c.dot.x}%`, top: `${c.dot.y}%` }}
                >
                  <button
                    type="button"
                    onMouseEnter={() => setTour(c.id)}
                    onFocus={() => setTour(c.id)}
                    onBlur={() => setTour(null)}
                    aria-label={`${c.label}: ${c.text}`}
                    className="relative -ml-2.5 -mt-2.5 flex h-5 w-5 items-center justify-center rounded-full outline-none"
                  >
                    <span
                      className={cn(
                        'absolute inset-0 rounded-full border transition-all duration-300',
                        on
                          ? 'scale-125 border-accent-bright bg-accent-bright/40'
                          : 'border-accent-light/70 bg-accent/50',
                      )}
                    />
                    <span className="relative h-1.5 w-1.5 rounded-full bg-white" />
                    {!on && (
                      <span
                        aria-hidden
                        className="absolute inset-0 animate-ping rounded-full bg-accent-bright/25"
                        style={{ animationDuration: '2.6s' }}
                      />
                    )}
                  </button>

                  <AnimatePresence>
                    {on && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.96 }}
                        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className={cn(
                          'absolute top-5 w-60 rounded-xl border border-accent-light/40 bg-panel/95 p-3.5 shadow-[0_24px_50px_-20px_rgba(0,0,0,0.95)] backdrop-blur-xl',
                          c.side === 'left' ? 'left-4' : 'right-4',
                        )}
                      >
                        <p className="text-xs font-semibold uppercase tracking-wider text-accent-bright">
                          {c.label}
                        </p>
                        <p className="mt-1.5 text-xs leading-relaxed text-zinc-300">{c.text}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Touch-friendly equivalent of the hotspots. */}
      <div className="mt-5 flex flex-wrap justify-center gap-2 lg:hidden">
        {launcherCallouts.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setTour(tour === c.id ? null : c.id)}
            className={cn(
              'rounded-full border px-3.5 py-2 text-xs font-medium transition-colors duration-300',
              tour === c.id
                ? 'border-accent-light/60 bg-accent/30 text-white'
                : 'border-edge bg-white/[0.03] text-zinc-400',
            )}
          >
            {c.label}
          </button>
        ))}
      </div>
      <AnimatePresence>
        {active && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 text-center text-xs text-zinc-400 lg:hidden"
          >
            {active.text}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
