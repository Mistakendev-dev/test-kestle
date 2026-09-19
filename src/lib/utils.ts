import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number) {
  return `$${price.toFixed(2)}`;
}

/** "⌘K" on Apple platforms, "Ctrl K" everywhere else. */
export function shortcutLabel() {
  if (typeof navigator === 'undefined') return 'Ctrl K';
  return /mac|iphone|ipad/i.test(navigator.platform || navigator.userAgent) ? '⌘K' : 'Ctrl K';
}
