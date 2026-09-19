import type { MouseEvent } from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { cn } from '../lib/utils';

export function WishlistButton({
  productId,
  className,
  size = 'sm',
}: {
  productId: string;
  className?: string;
  size?: 'sm' | 'md';
}) {
  const { has, toggle } = useWishlist();
  const active = has(productId);

  function onClick(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggle(productId);
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={active ? 'Remove from wishlist' : 'Add to wishlist'}
      className={cn(
        'flex items-center justify-center rounded-xl border backdrop-blur-md transition-all duration-300 active:scale-95',
        size === 'sm' ? 'h-9 w-9' : 'h-11 w-11',
        active
          ? 'border-rose-400/40 bg-rose-500/15 text-rose-300'
          : 'border-edge bg-void/60 text-zinc-400 hover:border-accent-light/50 hover:text-white',
        className,
      )}
    >
      <Heart className={cn(size === 'sm' ? 'h-4 w-4' : 'h-[18px] w-[18px]', active && 'fill-current')} />
    </button>
  );
}
