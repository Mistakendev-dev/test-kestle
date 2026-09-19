import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BadgeCheck,
  Check,
  ChevronRight,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Zap,
} from 'lucide-react';
import { getProduct, productsByGame } from '../data/products';
import { getGame } from '../data/games';
import { faqItems } from '../data/content';
import { formatPrice, cn } from '../lib/utils';
import { pushRecentlyViewed } from '../lib/recentlyViewed';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { ProductArt } from '../components/ProductArt';
import { ProductGrid } from '../components/ProductGrid';
import { Badge, StockIndicator } from '../components/Badge';
import { WishlistButton } from '../components/WishlistButton';
import { Reveal } from '../components/anim/Reveal';

const tabs = ['Product Details', 'Delivery Information', 'Requirements', 'FAQ'] as const;

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const product = getProduct(id ?? '');
  const { addItem } = useCart();
  const { toast } = useToast();
  const [qty, setQty] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);
  const [tab, setTab] = useState<(typeof tabs)[number]>('Product Details');

  useEffect(() => {
    window.scrollTo({ top: 0 });
    setQty(1);
    setImageIndex(0);
    setTab('Product Details');
    if (product) pushRecentlyViewed(product.id);
  }, [id, product]);

  const related = useMemo(
    () => (product ? productsByGame(product.game).filter((p) => p.id !== product.id).slice(0, 4) : []),
    [product],
  );

  if (!product) {
    return (
      <div className="container-wide flex min-h-[70vh] flex-col items-center justify-center gap-4 pt-24 text-center">
        <p className="font-display text-2xl font-bold text-white">Product not found</p>
        <p className="text-zinc-400">This listing may have sold out or been removed.</p>
        <Link to="/products" className="btn-primary btn-shine mt-2">
          Browse Products
        </Link>
      </div>
    );
  }

  const game = getGame(product.game);
  const galleryLabels = [product.category, game?.short ?? '', 'INSTANT', 'VERIFIED'];

  return (
    <div className="container-wide pb-24 pt-24 md:pt-32">
      <Reveal>
        <nav className="mb-8 flex items-center gap-1.5 text-sm text-zinc-500">
          <Link to="/" className="transition-colors hover:text-white">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to="/products" className="transition-colors hover:text-white">Products</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to={`/games/${product.game}`} className="transition-colors hover:text-white">{game?.name}</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="truncate text-zinc-300">{product.name}</span>
        </nav>
      </Reveal>

      <div className="grid gap-12 lg:grid-cols-2">
        <Reveal>
          <div>
            <div className="relative overflow-hidden rounded-3xl border border-edge">
              <AnimatePresence mode="wait">
                <motion.div
                  key={imageIndex}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.12}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -60) setImageIndex((i) => (i + 1) % galleryLabels.length);
                    else if (info.offset.x > 60)
                      setImageIndex((i) => (i - 1 + galleryLabels.length) % galleryLabels.length);
                  }}
                  className="cursor-grab active:cursor-grabbing"
                >
                  <ProductArt
                    gameId={product.game}
                    image={product.image}
                    alt={product.name}
                    label={galleryLabels[imageIndex]}
                    large
                    className="pointer-events-none aspect-[4/3] w-full"
                  />
                </motion.div>
              </AnimatePresence>
              {product.badge && <Badge label={product.badge} className="absolute left-4 top-4 z-10" />}
            </div>
            <div className="mt-4 grid grid-cols-4 gap-3">
              {galleryLabels.map((label, i) => (
                <button
                  key={i}
                  onClick={() => setImageIndex(i)}
                  className={cn(
                    'overflow-hidden rounded-xl border-2 transition-all duration-300',
                    imageIndex === i
                      ? 'border-accent-light shadow-[0_0_20px_-4px_rgba(74,79,158,0.6)]'
                      : 'border-edge opacity-60 hover:opacity-100',
                  )}
                >
                  <ProductArt gameId={product.game} label={label} className="aspect-[4/3] w-full" />
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div>
            <div className="flex items-center gap-3">
              <Link
                to={`/games/${product.game}`}
                className="rounded-lg px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] transition-opacity hover:opacity-80"
                style={{ background: game?.colorSoft, color: game?.color }}
              >
                {game?.name}
              </Link>
              <span className="rounded-md border border-edge px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                {product.category}
              </span>
            </div>

            <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
              {product.name}
            </h1>

            <div className="mt-4">
              <StockIndicator stock={product.stock} />
            </div>

            <div className="mt-5 flex items-baseline gap-3">
              <span className="font-display text-4xl font-bold text-white">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-zinc-600 line-through">{formatPrice(product.originalPrice)}</span>
                  <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-xs font-bold text-emerald-400">
                    SAVE {Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </span>
                </>
              )}
            </div>

            <p className="mt-6 leading-relaxed text-zinc-400">{product.description}</p>

            <ul className="mt-6 space-y-2.5">
              {product.features.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-zinc-300">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/20">
                    <Check className="h-3 w-3 text-accent-bright" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <div className="flex items-center rounded-xl border border-edge bg-white/[0.03]">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="flex h-12 w-11 items-center justify-center text-zinc-400 transition-colors hover:text-white"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center font-display text-base font-bold text-white">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  aria-label="Increase quantity"
                  className="flex h-12 w-11 items-center justify-center text-zinc-400 transition-colors hover:text-white"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button
                onClick={() => {
                  addItem(product.id, qty);
                  toast('Added to cart', { detail: `${qty} × ${product.name}` });
                }}
                className="btn-primary btn-shine min-w-[200px] flex-1 !py-3.5 text-base"
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart — {formatPrice(product.price * qty)}
              </button>
              <WishlistButton productId={product.id} size="md" className="h-12 w-12" />
            </div>

            {product.tags.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {product.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-lg border border-edge bg-white/[0.02] px-2.5 py-1 text-[11px] font-medium capitalize text-zinc-400"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { icon: Zap, text: 'Instant delivery' },
                { icon: ShieldCheck, text: 'Warranty included' },
                { icon: BadgeCheck, text: 'Verified stock' },
              ].map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-edge bg-white/[0.02] px-2 py-3 text-center"
                >
                  <Icon className="h-4 w-4 text-accent-bright" />
                  <span className="text-[11px] font-medium text-zinc-400">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.1}>
        <div className="mt-16">
          <div className="flex gap-1 overflow-x-auto border-b border-edge">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  'relative whitespace-nowrap px-5 py-3.5 text-sm font-medium transition-colors',
                  tab === t ? 'text-white' : 'text-zinc-500 hover:text-zinc-300',
                )}
              >
                {t}
                {tab === t && (
                  <motion.span
                    layoutId="tab-underline"
                    className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-accent-bright"
                  />
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="max-w-3xl py-8 text-sm leading-relaxed text-zinc-400"
            >
              {tab === 'Product Details' && (
                <div className="space-y-4">
                  <p>{product.description}</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-edge bg-white/[0.02] p-4">
                      <p className="text-xs uppercase tracking-wider text-zinc-600">Game</p>
                      <p className="mt-1 font-medium text-white">{game?.name}</p>
                    </div>
                    <div className="rounded-xl border border-edge bg-white/[0.02] p-4">
                      <p className="text-xs uppercase tracking-wider text-zinc-600">Account Type</p>
                      <p className="mt-1 font-medium text-white">{product.category}</p>
                    </div>
                    <div className="rounded-xl border border-edge bg-white/[0.02] p-4">
                      <p className="text-xs uppercase tracking-wider text-zinc-600">Stock</p>
                      <p className="mt-1 font-medium text-white">{product.stock} available</p>
                    </div>
                    <div className="rounded-xl border border-edge bg-white/[0.02] p-4">
                      <p className="text-xs uppercase tracking-wider text-zinc-600">Delivery</p>
                      <p className="mt-1 font-medium text-white">Instant, automated</p>
                    </div>
                  </div>
                </div>
              )}
              {tab === 'Delivery Information' && (
                <div className="space-y-4">
                  <p>
                    Delivery is fully automated. The moment your order is confirmed, your account credentials are
                    displayed on the order confirmation page and emailed to the address provided at checkout.
                  </p>
                  <p>
                    Average delivery time is under 60 seconds. In rare cases where an order is flagged for manual
                    review, delivery may take up to a few hours — you will be notified by email if this happens.
                  </p>
                  <p>
                    Every order includes a replacement warranty. If the credentials do not work or the account does
                    not match the description, contact support within the warranty window for a replacement or refund.
                  </p>
                </div>
              )}
              {tab === 'Requirements' && (
                <ul className="list-inside space-y-2">
                  <li>— A valid email address to receive your credentials.</li>
                  <li>— The corresponding game launcher installed (Steam, Epic Games, Battle.net, Riot Client, etc.).</li>
                  <li>— For NFA accounts: no original email is included. Do not attempt account recovery.</li>
                  <li>— Change the password immediately after your first login where possible.</li>
                  <li>— Region-free unless stated otherwise in the product features.</li>
                </ul>
              )}
              {tab === 'FAQ' && (
                <div className="space-y-5">
                  {faqItems.slice(0, 4).map((f) => (
                    <div key={f.question}>
                      <p className="font-medium text-white">{f.question}</p>
                      <p className="mt-1.5">{f.answer}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </Reveal>

      {related.length > 0 && (
        <div className="mt-16">
          <Reveal>
            <h2 className="mb-8 font-display text-2xl font-bold tracking-tight text-white">
              More {game?.name} accounts
            </h2>
          </Reveal>
          <ProductGrid products={related} animateLayout={false} />
        </div>
      )}
    </div>
  );
}
