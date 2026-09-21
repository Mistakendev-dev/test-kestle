import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { GameProduct, Variant } from '../../data/products';
import { faqItems } from '../../data/content';
import { cn } from '../../lib/utils';

const tabs = ['Overview', 'Details', 'Delivery', 'FAQ'] as const;
type Tab = (typeof tabs)[number];

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-edge bg-white/[0.02] p-5 transition-colors duration-300 hover:border-accent-light/30 hover:bg-white/[0.04]">
      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-600">{label}</p>
      <p className="mt-2 font-display text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

export function ProductTabs({
  product,
  variant,
}: {
  product: GameProduct;
  variant: Variant;
}) {
  const [tab, setTab] = useState<Tab>('Overview');

  const specs = [
    { label: 'Game', value: product.name },
    { label: 'Option', value: variant.name },
    { label: 'Delivery', value: 'Instant' },
    { label: 'Platform', value: 'PC' },
    { label: 'Status', value: variant.available ? 'Available' : 'Out of stock' },
  ];

  return (
    <div>
      <div className="no-scrollbar flex gap-1 overflow-x-auto border-b border-edge">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            aria-current={tab === t}
            className={cn(
              'relative whitespace-nowrap px-6 py-4 text-sm font-semibold transition-colors',
              tab === t ? 'text-white' : 'text-zinc-500 hover:text-zinc-300',
            )}
          >
            {t}
            {tab === t && (
              <motion.span
                layoutId="product-tab-underline"
                className="absolute inset-x-4 bottom-0 h-[2px] rounded-full bg-accent-bright shadow-[0_0_12px_rgba(107,114,214,0.9)]"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="pt-10"
        >
          {tab === 'Overview' && (
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
              <div>
                <h3 className="font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
                  Everything you need to know
                </h3>
                <p className="mt-5 max-w-2xl text-base leading-[1.8] text-zinc-400">{product.description}</p>
                <p className="mt-4 max-w-2xl text-base leading-[1.8] text-zinc-400">
                  The details above describe exactly what is included in this listing. If anything is
                  unclear, support can answer questions before you order.
                </p>
                <div className="mt-7 flex flex-wrap gap-2">
                  {product.features.map((f) => (
                    <span
                      key={f}
                      className="rounded-lg border border-edge bg-white/[0.02] px-3 py-1.5 text-xs font-medium text-zinc-400"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {specs.slice(0, 3).map((s) => (
                  <InfoCard key={s.label} {...s} />
                ))}
              </div>
            </div>
          )}

          {tab === 'Details' && (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {specs.map((s) => (
                <InfoCard key={s.label} {...s} />
              ))}
              <InfoCard label="Stock" value={`${product.stock} available`} />
            </div>
          )}

          {tab === 'Delivery' && (
            <div className="max-w-3xl space-y-5 text-base leading-[1.8] text-zinc-400">
              <p>
                Delivery is automated. Once an order is confirmed the account credentials appear on the
                confirmation screen and are emailed to the address given at checkout.
              </p>
              <p>
                Orders normally complete in under a minute. If an order is held for manual review, delivery can
                take longer and you will be notified by email.
              </p>
              <p>
                Before ordering, make sure you have the matching launcher installed — Steam, Epic Games,
                Battle.net or the Riot client depending on the title. For NFA listings the original email is not
                included, so account recovery should not be attempted.
              </p>
            </div>
          )}

          {tab === 'FAQ' && (
            <div className="grid max-w-4xl gap-6 sm:grid-cols-2">
              {faqItems.slice(0, 4).map((f) => (
                <div key={f.question} className="rounded-2xl border border-edge bg-white/[0.02] p-6">
                  <p className="font-display text-base font-semibold text-white">{f.question}</p>
                  <p className="mt-2.5 text-sm leading-relaxed text-zinc-400">{f.answer}</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
