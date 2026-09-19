import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product } from '../data/products';
import { ProductCard } from './ProductCard';
import { QuickViewModal } from './QuickViewModal';
import { cn } from '../lib/utils';

/**
 * Scroll-snap carousel: native scrolling keeps touch/trackpad behaviour
 * correct, with mouse-drag, arrow buttons and autoplay layered on top.
 */
export function ProductCarousel({
  products,
  autoplay = true,
  interval = 4200,
}: {
  products: Product[];
  autoplay?: boolean;
  interval?: number;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [paused, setPaused] = useState(false);
  const [edges, setEdges] = useState({ start: true, end: false });

  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: false });

  const updateEdges = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setEdges({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    updateEdges();
    const el = track.current;
    if (!el) return;
    el.addEventListener('scroll', updateEdges, { passive: true });
    window.addEventListener('resize', updateEdges);
    return () => {
      el.removeEventListener('scroll', updateEdges);
      window.removeEventListener('resize', updateEdges);
    };
  }, [updateEdges]);

  const step = useCallback((dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('[data-card]');
    const amount = card ? card.offsetWidth + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * amount, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (!autoplay || paused || quickView) return;
    const id = setInterval(() => {
      const el = track.current;
      if (!el) return;
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 4) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        step(1);
      }
    }, interval);
    return () => clearInterval(id);
  }, [autoplay, paused, quickView, interval, step]);

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (reduce?.matches) setPaused(true);
  }, []);

  function onPointerDown(e: React.PointerEvent) {
    if (e.pointerType !== 'mouse' || !track.current) return;
    drag.current = { active: true, startX: e.clientX, startScroll: track.current.scrollLeft, moved: false };
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!drag.current.active || !track.current) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    track.current.scrollLeft = drag.current.startScroll - dx;
  }

  function endDrag() {
    drag.current.active = false;
  }

  return (
    <>
      <div
        className="relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => {
          setPaused(false);
          endDrag();
        }}
      >
        <div
          ref={track}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onClickCapture={(e) => {
            if (drag.current.moved) {
              e.preventDefault();
              e.stopPropagation();
              drag.current.moved = false;
            }
          }}
          className="no-scrollbar snap-row -mx-4 flex gap-5 overflow-x-auto px-4 pb-4 pt-1 sm:mx-0 sm:px-0"
        >
          {products.map((p) => (
            <div
              key={p.id}
              data-card
              className="snap-item w-[268px] shrink-0 sm:w-[300px] lg:w-[328px]"
            >
              <ProductCard product={p} onQuickView={setQuickView} />
            </div>
          ))}
        </div>

        <button
          onClick={() => step(-1)}
          aria-label="Previous products"
          disabled={edges.start}
          className={cn(
            'absolute -left-4 top-[38%] hidden h-11 w-11 items-center justify-center rounded-full border border-edge bg-void/85 text-zinc-300 backdrop-blur-md transition-all duration-300 hover:border-accent-light/60 hover:text-white lg:flex',
            edges.start && 'pointer-events-none opacity-0',
          )}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => step(1)}
          aria-label="Next products"
          disabled={edges.end}
          className={cn(
            'absolute -right-4 top-[38%] hidden h-11 w-11 items-center justify-center rounded-full border border-edge bg-void/85 text-zinc-300 backdrop-blur-md transition-all duration-300 hover:border-accent-light/60 hover:text-white lg:flex',
            edges.end && 'pointer-events-none opacity-0',
          )}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />
    </>
  );
}
