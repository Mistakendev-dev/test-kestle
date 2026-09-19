import { AnimatePresence, motion } from 'framer-motion';
import { Library, PackageCheck, Settings2, ShieldCheck, type LucideIcon } from 'lucide-react';
import { launcherPanes, type ControlValue, type LauncherPane } from '../../data/launcher';
import { ProductArt } from '../ProductArt';
import { getGame } from '../../data/games';
import { cn } from '../../lib/utils';
import { LauncherCheck, LauncherSelect, LauncherSlider, LauncherToggle } from './LauncherControls';

const paneIcons: Record<string, LucideIcon> = {
  library: Library,
  delivery: PackageCheck,
  security: ShieldCheck,
  settings: Settings2,
};

const statusTone: Record<string, string> = {
  Ready: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  Delivered: 'border-edge bg-white/[0.05] text-zinc-400',
  Queued: 'border-accent-light/40 bg-accent/20 text-accent-bright',
};

function PaneControls({
  pane,
  values,
  onChange,
}: {
  pane: LauncherPane;
  values: Record<string, ControlValue>;
  onChange: (id: string, v: ControlValue) => void;
}) {
  return (
    <div className="grid gap-2.5">
      {pane.controls.map((c) => {
        const v = values[c.id] ?? c.value;
        if (c.kind === 'toggle') {
          return (
            <LauncherToggle
              key={c.id}
              label={c.label}
              hint={c.hint}
              value={v as boolean}
              onChange={(next) => onChange(c.id, next)}
            />
          );
        }
        if (c.kind === 'check') {
          return (
            <LauncherCheck
              key={c.id}
              label={c.label}
              hint={c.hint}
              value={v as boolean}
              onChange={(next) => onChange(c.id, next)}
            />
          );
        }
        if (c.kind === 'slider') {
          return (
            <LauncherSlider
              key={c.id}
              id={`lc-${c.id}`}
              label={c.label}
              hint={c.hint}
              value={v as number}
              min={c.min}
              max={c.max}
              step={c.step}
              unit={c.unit}
              onChange={(next) => onChange(c.id, next)}
            />
          );
        }
        return (
          <LauncherSelect
            key={c.id}
            label={c.label}
            hint={c.hint}
            value={v as string}
            options={c.options}
            onChange={(next) => onChange(c.id, next)}
          />
        );
      })}
    </div>
  );
}

function VaultList({ pane }: { pane: LauncherPane }) {
  if (!pane.entries) return null;
  return (
    <div className="mb-2.5 grid gap-2">
      {pane.entries.map((e) => (
        <div
          key={e.id}
          className="flex items-center gap-3 rounded-xl border border-edge/70 bg-white/[0.02] p-2 pr-3.5 transition-colors duration-300 hover:border-accent-light/30 hover:bg-white/[0.04]"
        >
          <ProductArt
            gameId={e.game}
            size="sm"
            className="h-11 w-16 shrink-0 rounded-lg"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-zinc-100">{e.name}</p>
            <p className="truncate text-xs text-zinc-500">{getGame(e.game)?.name ?? e.game}</p>
          </div>
          <span
            className={cn(
              'shrink-0 rounded-md border px-2 py-1 text-[10px] font-semibold uppercase tracking-wider',
              statusTone[e.status],
            )}
          >
            {e.status}
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * The delivery-client window. Pure presentation: it renders whatever state it
 * is given and reports interactions upward.
 */
export function LauncherWindow({
  activePane,
  onPaneChange,
  values,
  onChange,
  highlight,
  className,
}: {
  activePane: string;
  onPaneChange: (id: string) => void;
  values: Record<string, ControlValue>;
  onChange: (id: string, v: ControlValue) => void;
  /** Region lit up by a hovered callout, in percentages of the frame. */
  highlight?: { x: number; y: number; w: number; h: number } | null;
  className?: string;
}) {
  const pane = launcherPanes.find((p) => p.id === activePane) ?? launcherPanes[0];

  return (
    <div
      className={cn(
        'relative isolate overflow-hidden rounded-2xl border border-edge bg-panel/90 shadow-[0_40px_100px_-40px_rgba(0,0,0,1)] backdrop-blur-xl',
        className,
      )}
    >
      {/* Title bar */}
      <div className="flex items-center gap-3 border-b border-edge bg-white/[0.03] px-4 py-3">
        <div className="flex gap-1.5" aria-hidden>
          <span className="h-3 w-3 rounded-full bg-zinc-700" />
          <span className="h-3 w-3 rounded-full bg-zinc-700" />
          <span className="h-3 w-3 rounded-full bg-zinc-700" />
        </div>
        <p className="flex-1 truncate text-center text-xs font-medium text-zinc-400">
          NFA Market — Delivery Client
        </p>
        <span className="rounded-md border border-edge bg-white/[0.04] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
          Demo
        </span>
      </div>

      <div className="flex min-h-0">
        {/* Sidebar */}
        <nav
          aria-label="Launcher sections"
          className="w-[5.5rem] shrink-0 border-r border-edge bg-white/[0.015] p-2 sm:w-52 sm:p-3"
        >
          <div className="grid gap-1">
            {launcherPanes.map((p) => {
              const Icon = paneIcons[p.id] ?? Library;
              const active = p.id === pane.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onPaneChange(p.id)}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'relative flex items-center justify-center gap-2.5 rounded-lg px-2 py-2.5 text-xs font-medium transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-accent-bright/70 sm:justify-start sm:px-3',
                    active ? 'text-white' : 'text-zinc-500 hover:text-zinc-200',
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="launcher-nav"
                      transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                      className="absolute inset-0 -z-10 rounded-lg border border-accent-light/40 bg-accent/25"
                    />
                  )}
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="hidden sm:inline">{p.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 hidden rounded-lg border border-edge bg-white/[0.02] p-3 sm:block">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Storage</p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
              <div className="h-full w-[38%] rounded-full bg-accent-light" />
            </div>
            <p className="mt-2 text-[11px] text-zinc-500">4 of 10 slots used</p>
          </div>
        </nav>

        {/* Content */}
        <div className="min-w-0 flex-1 p-4 sm:p-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={pane.id}
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <h3 className="font-display text-lg font-semibold text-white">{pane.title}</h3>
              <p className="mb-4 mt-1 text-xs text-zinc-500">{pane.blurb}</p>
              <VaultList pane={pane} />
              <PaneControls pane={pane} values={values} onChange={onChange} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Status bar */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-edge bg-white/[0.03] px-4 py-2.5 text-[11px] text-zinc-500">
        <span className="flex items-center gap-1.5">
          <span className="live-dot h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Connected
        </span>
        <span className="truncate">
          Node <span className="text-zinc-300">{String(values.region ?? 'Europe West')}</span>
        </span>
        <span className="ml-auto hidden sm:inline">v2.4.1</span>
      </div>

      {/* Callout highlight */}
      <AnimatePresence>
        {highlight && (
          <motion.div
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-none absolute inset-0 z-20"
          >
            <div className="absolute inset-0 bg-void/55" />
            <motion.div
              layout
              transition={{ type: 'spring', stiffness: 260, damping: 32 }}
              className="absolute rounded-xl border-2 border-accent-bright/70 shadow-[0_0_0_9999px_rgba(5,5,7,0.0),0_0_50px_-6px_rgba(107,114,214,0.7)]"
              style={{
                left: `${highlight.x}%`,
                top: `${highlight.y}%`,
                width: `${highlight.w}%`,
                height: `${highlight.h}%`,
                backdropFilter: 'brightness(1.5)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
