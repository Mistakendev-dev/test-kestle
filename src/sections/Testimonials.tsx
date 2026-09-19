import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BadgeCheck, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { testimonials } from '../data/content';
import { Reveal } from '../components/anim/Reveal';
import { cn } from '../lib/utils';

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setIndex((i) => (i + 1) % testimonials.length), []);
  const prev = useCallback(() => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length), []);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 5500);
    return () => clearInterval(t);
  }, [next, paused]);

  const t = testimonials[index];

  return (
    <section className="relative py-24">
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-[120px]"
        style={{ background: 'radial-gradient(ellipse, rgba(46,48,106,0.5) 0%, transparent 70%)' }}
      />
      <div className="container-wide relative">
        <Reveal>
          <div className="mb-12 text-center">
            <p className="section-label">Testimonials</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
              Trusted by thousands of gamers
            </h2>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div
            className="relative mx-auto max-w-3xl"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="glass relative min-h-[240px] overflow-hidden rounded-3xl p-8 md:p-12">
              <AnimatePresence mode="wait">
                <motion.figure
                  key={index}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          'h-4 w-4',
                          i < t.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-700',
                        )}
                      />
                    ))}
                  </div>
                  <blockquote className="mt-5 text-lg leading-relaxed text-zinc-200 md:text-xl">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 font-display text-sm font-bold text-accent-bright">
                      {t.name.charAt(0)}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-white">
                        {t.name}
                        <BadgeCheck className="h-4 w-4 text-accent-bright" />
                      </div>
                      <div className="text-xs text-zinc-500">
                        Verified Purchase — {t.game}
                      </div>
                    </div>
                  </figcaption>
                </motion.figure>
              </AnimatePresence>
            </div>

            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                onClick={prev}
                aria-label="Previous testimonial"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-edge bg-white/[0.03] text-zinc-400 transition-all duration-300 hover:border-accent-light/50 hover:text-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    aria-label={`Go to testimonial ${i + 1}`}
                    className={cn(
                      'h-1.5 rounded-full transition-all duration-400',
                      i === index ? 'w-8 bg-accent-bright' : 'w-1.5 bg-zinc-700 hover:bg-zinc-500',
                    )}
                  />
                ))}
              </div>
              <button
                onClick={next}
                aria-label="Next testimonial"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-edge bg-white/[0.03] text-zinc-400 transition-all duration-300 hover:border-accent-light/50 hover:text-white"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
