import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Plus } from 'lucide-react';
import { faqItems } from '../data/content';
import { Reveal } from '../components/anim/Reveal';
import { cn } from '../lib/utils';

export function FaqSection({ limit }: { limit?: number }) {
  const [open, setOpen] = useState<number | null>(0);
  const items = limit ? faqItems.slice(0, limit) : faqItems;

  return (
    <section className="relative py-24">
      <div className="container-wide">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <Reveal>
            <div>
              <p className="section-label">FAQ</p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
                Questions, answered
              </h2>
              <p className="mt-4 max-w-sm text-zinc-400">
                Everything you need to know before ordering. Still unsure? Our support team replies in minutes.
              </p>
              {limit && (
                <Link
                  to="/faq"
                  className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent-bright transition-colors hover:text-white"
                >
                  View all questions
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              )}
            </div>
          </Reveal>

          <div className="space-y-3">
            {items.map((item, i) => {
              const isOpen = open === i;
              return (
                <Reveal key={item.question} delay={i * 0.06}>
                  <div
                    className={cn(
                      'overflow-hidden rounded-2xl border transition-colors duration-300',
                      isOpen ? 'border-accent-light/40 bg-white/[0.04]' : 'border-edge bg-white/[0.02]',
                    )}
                  >
                    <button
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                    >
                      <span className={cn('font-medium transition-colors', isOpen ? 'text-white' : 'text-zinc-300')}>
                        {item.question}
                      </span>
                      <motion.span
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.3 }}
                        className={cn(
                          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors',
                          isOpen ? 'border-accent-light/50 bg-accent/20 text-accent-bright' : 'border-edge text-zinc-500',
                        )}
                      >
                        <Plus className="h-4 w-4" />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <p className="px-6 pb-6 text-sm leading-relaxed text-zinc-400">{item.answer}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
