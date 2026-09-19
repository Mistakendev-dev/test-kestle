import { getGame } from '../data/games';
import { cn } from '../lib/utils';

export function ProductArt({
  gameId,
  label,
  className,
  large = false,
  image,
  alt,
}: {
  gameId: string;
  label?: string;
  className?: string;
  large?: boolean;
  /** Real artwork URL. Falls back to the generated gradient when omitted. */
  image?: string;
  alt?: string;
}) {
  const game = getGame(gameId);
  const color = game?.color ?? '#2e306a';
  const short = game?.short ?? 'NFA';

  if (image) {
    return (
      <div className={cn('relative overflow-hidden bg-panel', className)}>
        <img
          src={image}
          alt={alt ?? game?.name ?? 'Product artwork'}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-void/70 via-transparent to-transparent" />
      </div>
    );
  }

  return (
    <div
      className={cn('relative flex items-center justify-center overflow-hidden', className)}
      style={{
        background: `radial-gradient(120% 120% at 30% 20%, ${color}33 0%, rgba(5,5,7,0.9) 55%), linear-gradient(160deg, #0d0d16 0%, #050507 100%)`,
      }}
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `linear-gradient(${color}18 1px, transparent 1px), linear-gradient(90deg, ${color}18 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />
      <div
        className="absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl"
        style={{ background: `${color}30` }}
      />
      <div className="relative text-center">
        <div
          className={cn(
            'font-display font-bold tracking-tight',
            large ? 'text-6xl md:text-7xl' : 'text-4xl',
          )}
          style={{ color, textShadow: `0 0 40px ${color}80` }}
        >
          {short}
        </div>
        {label && (
          <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-500">
            {label}
          </div>
        )}
      </div>
    </div>
  );
}
