import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Gamepad2,
  KeyRound,
  LayoutGrid,
  MonitorPlay,
  RotateCcw,
  Sparkles,
  Split,
  type LucideIcon,
} from 'lucide-react';
import { launcherFeatures } from '../data/launcher';
import { featuredProducts } from '../data/products';
import { getGame } from '../data/games';
import { useLauncherDemo } from '../hooks/useLauncherDemo';
import { LauncherStage } from '../components/launcher/LauncherStage';
import { LauncherImmersive } from '../components/launcher/LauncherImmersive';
import { ProductArt } from '../components/ProductArt';
import { Reveal } from '../components/anim/Reveal';
import { MagneticButton } from '../components/anim/MagneticButton';
import { cn } from '../lib/utils';

type Mode = 'gameplay' | 'interface' | 'features';

const modes: { id: Mode; label: string }[] = [
  { id: 'gameplay', label: 'Gameplay' },
  { id: 'interface', label: 'Interface' },
  { id: 'features', label: 'Features' },
];

const featureIcons: Record<string, LucideIcon> = {
  vault: LayoutGrid,
  handoff: Split,
  masking: KeyRound,
  sync: Sparkles,
};

function GameplayPanel() {
  const showcase = featuredProducts[0];
  const game = getGame(showcase?.game ?? 'rust');

  return (
    <div className="mx-auto max-w-5xl">
      <div className="relative overflow-hidden rounded-2xl border border-edge bg-panel/60 p-2 shadow-[0_40px_100px_-45px_rgba(0,0,0,1)]">
        <ProductArt
          gameId={showcase?.game ?? 'rust'}
          size="xl"
          priority
          className="aspect-[16/9] w-full rounded-xl"
        />
        <div className="pointer-events-none absolute inset-0 flex items-end p-6 sm:p-9">
          <div>
            <p className="section-label">Now showing</p>
            <h3 className="mt-2 font-display text-2xl font-bold text-white sm:text-4xl">
              {game?.name ?? 'Featured title'}
            </h3>
            <p className="mt-2 max-w-md text-sm text-zinc-400">
              Key art stands in for gameplay capture in this demo build.
            </p>
          </div>
        </div>
        <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-lg border border-edge bg-void/70 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400 backdrop-blur-sm">
          <MonitorPlay className="h-3.5 w-3.5" />
          Placeholder visual
        </div>
      </div>
      <p className="mt-4 text-center text-xs text-zinc-500">
        Gameplay footage is not bundled with this demo — this panel shows where it would sit.
      </p>
    </div>
  );
}

function FeaturesPanel() {
  return (
    <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2">
      {launcherFeatures.map((f, i) => {
        const Icon = featureIcons[f.id] ?? Sparkles;
        return (
          <motion.div
            key={f.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            className="group relative overflow-hidden rounded-2xl border border-edge bg-white/[0.02] p-7 transition-all duration-500 hover:-translate-y-1 hover:border-accent-light/40 hover:bg-white/[0.04]"
          >
            <div
              aria-hidden
              className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-accent/0 blur-2xl transition-all duration-500 group-hover:bg-accent/25"
            />
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-edge bg-accent/15 transition-transform duration-500 group-hover:scale-105">
              <Icon className="h-7 w-7 text-accent-bright" />
            </div>
            <h3 className="relative mt-5 font-display text-lg font-semibold text-white">{f.title}</h3>
            <p className="relative mt-2 text-sm leading-relaxed text-zinc-400">{f.text}</p>
          </motion.div>
        );
      })}
    </div>
  );
}

/**
 * Signature showcase: the delivery client rebuilt as a working interface
 * rather than a screenshot. Every control is a visual demonstration only.
 */
export function SeeItInAction() {
  const [mode, setMode] = useState<Mode>('interface');
  const [immersive, setImmersive] = useState(false);
  const demo = useLauncherDemo();

  return (
    <section className="relative overflow-hidden border-t border-edge py-24">
      <div aria-hidden className="bg-grid absolute inset-0 opacity-[0.35]" />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(46,48,106,0.28) 0%, transparent 70%)',
        }}
      />

      <div className="container-wide relative">
        <Reveal>
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="section-label">See it in action</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white md:text-5xl">
              Experience the delivery client
            </h2>
            <p className="mt-4 text-zinc-400">
              This is the interface your purchase arrives in. Click through it below — the controls
              are live, and everything you change stays on this page.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mb-10 flex flex-col items-center gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-600">
              Product preview
            </p>
            <div
              role="tablist"
              aria-label="Product preview mode"
              className="flex gap-1 rounded-2xl border border-edge bg-white/[0.03] p-1.5"
            >
              {modes.map((m) => {
                const active = mode === m.id;
                return (
                  <button
                    key={m.id}
                    role="tab"
                    aria-selected={active}
                    type="button"
                    onClick={() => setMode(m.id)}
                    className={cn(
                      'relative rounded-xl px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-accent-bright/70 sm:text-sm',
                      active ? 'text-white' : 'text-zinc-500 hover:text-zinc-300',
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="preview-mode"
                        transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                        className="absolute inset-0 -z-10 rounded-xl border border-accent-light/40 bg-accent/30"
                      />
                    )}
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {mode === 'interface' && (
              <div className="mx-auto max-w-5xl">
                <LauncherStage demo={demo} />
              </div>
            )}
            {mode === 'features' && <FeaturesPanel />}
            {mode === 'gameplay' && <GameplayPanel />}
          </motion.div>
        </AnimatePresence>

        {mode === 'interface' && (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <MagneticButton>
              <button
                type="button"
                onClick={() => setImmersive(true)}
                className="btn-primary btn-shine !px-8 !py-3.5 text-sm"
              >
                <Gamepad2 className="h-4 w-4" />
                Interact with demo
              </button>
            </MagneticButton>
            <button
              type="button"
              onClick={demo.reset}
              disabled={!demo.touched}
              className="btn-ghost !px-6 !py-3.5 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              <RotateCcw className="h-4 w-4" />
              Reset demo
            </button>
          </div>
        )}
      </div>

      <LauncherImmersive
        open={immersive}
        onClose={() => setImmersive(false)}
        onReset={demo.reset}
        demo={demo}
      />
    </section>
  );
}
