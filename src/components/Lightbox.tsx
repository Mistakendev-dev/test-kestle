import { useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { ProductArt } from './ProductArt';

export interface LightboxFrame {
  label: string;
  variant: number;
  image?: string;
}

export function Lightbox({
  frames,
  index,
  gameId,
  alt,
  onClose,
  onIndexChange,
}: {
  frames: LightboxFrame[];
  /** Null closes the lightbox. */
  index: number | null;
  gameId: string;
  alt: string;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}) {
  const open = index !== null;
  useBodyScrollLock(open);

  const step = useCallback(
    (delta: number) => {
      if (index === null) return;
      onIndexChange((index + delta + frames.length) % frames.length);
    },
    [index, frames.length, onIndexChange],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose, step]);

  const frame = index !== null ? frames[index] : null;

  return (
    <AnimatePresence>
      {open && frame && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`${alt} preview`}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-void/90 p-4 backdrop-blur-xl sm:p-8"
        >
          <button
            onClick={onClose}
            aria-label="Close preview"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-edge bg-white/[0.04] text-zinc-300 transition-colors hover:border-accent-light/50 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            aria-label="Previous image"
            className="absolute left-3 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-edge bg-void/70 text-zinc-300 backdrop-blur-md transition-colors hover:border-accent-light/50 hover:text-white sm:left-8"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-5xl"
          >
            <ProductArt
              gameId={gameId}
              image={frame.image}
              alt={alt}
              label={frame.label}
              size="xl"
              variant={frame.variant}
              priority
              className="aspect-[16/10] w-full rounded-2xl border border-edge shadow-[0_0_120px_-30px_rgba(74,79,158,0.8)]"
            />
            <p className="mt-4 text-center text-sm text-zinc-500">
              {frame.label} — {index! + 1} of {frames.length}
            </p>
          </motion.div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            aria-label="Next image"
            className="absolute right-3 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-edge bg-void/70 text-zinc-300 backdrop-blur-md transition-colors hover:border-accent-light/50 hover:text-white sm:right-8"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
