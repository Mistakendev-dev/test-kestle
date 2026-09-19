import { getGame } from '../data/games';
import { cn } from '../lib/utils';

export type ArtSize = 'sm' | 'md' | 'lg' | 'xl';

/** Wordmark scale per slot. Keeps the art legible from marquee chip to hero. */
const wordmark: Record<ArtSize, string> = {
  sm: 'text-[1.75rem]',
  md: 'text-5xl',
  lg: 'text-7xl',
  xl: 'text-[7rem] md:text-[9rem]',
};

const labelSize: Record<ArtSize, string> = {
  sm: 'text-[8px] tracking-[0.18em]',
  md: 'text-[9px] tracking-[0.22em]',
  lg: 'text-[10px] tracking-[0.28em]',
  xl: 'text-xs tracking-[0.3em]',
};

/** Deterministic per-game variation so no two titles share a composition. */
function seed(id: string, variant = 0) {
  let h = 0;
  for (let i = 0; i < id.length; i += 1) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  h = (h + variant * 2654435761) >>> 0;
  return {
    angle: -30 + (h % 22),
    bloomX: 18 + (h % 34),
    bloomY: 10 + ((h >> 3) % 26),
    stripeGap: 26 + ((h >> 5) % 18),
  };
}

/**
 * Generated key art for a game. Renders a layered composition rather than a
 * flat gradient so it holds up at hero size. Pass `image` to swap in real
 * artwork later — the overlays and scrim stay identical either way.
 */
export function ProductArt({
  gameId,
  label,
  className,
  size = 'md',
  image,
  alt,
  priority = false,
  variant = 0,
  depth = false,
}: {
  gameId: string;
  label?: string;
  className?: string;
  size?: ArtSize;
  /** Shifts the generated composition — used for distinct gallery frames. */
  variant?: number;
  /**
   * Lets the internal layers drift against the `--ax` / `--ay` custom
   * properties (-1..1) set by a parent on pointer move. Layers travel at
   * different rates and directions, so the art gains real depth rather than
   * sliding as one flat image.
   */
  depth?: boolean;
  /** Real artwork URL. Falls back to the generated composition when omitted. */
  image?: string;
  alt?: string;
  /** Skip lazy-loading for above-the-fold art. */
  priority?: boolean;
}) {
  const game = getGame(gameId);
  const color = game?.color ?? '#6b72d6';
  const short = game?.short ?? 'NFA';
  const { angle, bloomX, bloomY, stripeGap } = seed(gameId, variant);

  /** Per-layer drift. Negative rates move against the cursor for parallax. */
  const drift = (rate: number) =>
    depth ? ` translate3d(calc(var(--ax, 0) * ${rate}px), calc(var(--ay, 0) * ${rate * 0.7}px), 0)` : '';

  return (
    <div
      className={cn('relative isolate overflow-hidden bg-void', className)}
      style={{ backgroundImage: 'linear-gradient(155deg, #0c0c15 0%, #050507 60%)' }}
    >
      {image ? (
        <img
          src={image}
          alt={alt ?? game?.name ?? 'Product artwork'}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <>
          {/* Colour bloom — the dominant light source. */}
          <div
            aria-hidden
            className="absolute h-[85%] w-[85%] rounded-full blur-[42px]"
            style={{
              left: `${bloomX}%`,
              top: `${bloomY}%`,
              transform: `translate(-40%, -40%)${drift(18)}`,
              background: `radial-gradient(circle, ${color}55 0%, ${color}14 45%, transparent 70%)`,
            }}
          />
          {/* Brand accent counter-light, keeps every title on-palette. */}
          <div
            aria-hidden
            className="absolute -bottom-1/3 -right-1/4 h-[80%] w-[80%] rounded-full blur-[48px]"
            style={{ background: 'radial-gradient(circle, rgba(46,48,106,0.6) 0%, transparent 68%)' }}
          />
          {/* Diagonal ruling. */}
          <div
            aria-hidden
            className="absolute -inset-1/2 opacity-[0.55]"
            style={{
              transform: `rotate(${angle}deg)${drift(6)}`,
              backgroundImage: `repeating-linear-gradient(90deg, ${color}1f 0px, ${color}1f 1px, transparent 1px, transparent ${stripeGap}px)`,
            }}
          />
          {/* Sharp accent slash. */}
          <div
            aria-hidden
            className="absolute inset-y-0 left-1/2 w-[38%] opacity-70"
            style={{
              transform: `skewX(${angle / 2}deg)${drift(11)}`,
              background: `linear-gradient(100deg, transparent, ${color}1a 45%, transparent)`,
            }}
          />
          {/* Oversized wordmark, bled off the lower-left corner like real key art. */}
          <div
            aria-hidden
            className={cn(
              'absolute -bottom-[0.12em] left-[-0.04em] select-none font-display font-bold leading-[0.82] tracking-tighter',
              wordmark[size],
            )}
            style={{
              backgroundImage: `linear-gradient(170deg, ${color} 0%, ${color}cc 40%, rgba(255,255,255,0.12) 100%)`,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              filter: `drop-shadow(0 0 28px ${color}4d)`,
              opacity: 0.92,
              transform: drift(-8).trim() || undefined,
            }}
          >
            {short}
          </div>
          {/* Top sheen + vignette for depth. */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 28%), radial-gradient(130% 110% at 50% 45%, transparent 40%, rgba(5,5,7,0.85) 100%)',
            }}
          />
        </>
      )}

      {/* Shared scrim so overlaid copy stays legible on generated or real art. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(5,5,7,0.82) 0%, rgba(5,5,7,0.15) 45%, transparent 75%)' }}
      />

      {label && (
        <span
          className={cn(
            'absolute right-2.5 top-2.5 rounded-md border border-white/10 bg-void/60 px-1.5 py-0.5 font-semibold uppercase text-zinc-300 backdrop-blur-sm',
            labelSize[size],
          )}
        >
          {label}
        </span>
      )}
    </div>
  );
}
