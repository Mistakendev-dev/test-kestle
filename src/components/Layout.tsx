import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { History } from 'lucide-react';
import { CartProvider } from '../context/CartContext';
import { Navbar } from './layout/Navbar';
import { Footer } from './layout/Footer';
import { CartDrawer } from './layout/CartDrawer';
import { CursorGlow } from './effects/CursorGlow';
import { LiveNotifications } from '../sections/LiveNotifications';
import { Loader } from './Loader';
import { getRecentlyViewed } from '../pages/ProductDetailPage';
import { getProduct } from '../data/products';
import { formatPrice } from '../lib/utils';
import { ProductArt } from './ProductArt';
import { Reveal } from './anim/Reveal';

function RecentlyViewed() {
  const location = useLocation();
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    setIds(getRecentlyViewed());
  }, [location.pathname]);

  const items = ids.map(getProduct).filter(Boolean).slice(0, 6);
  if (items.length === 0 || location.pathname === '/') return null;

  return (
    <section className="border-t border-edge bg-panel/20 py-14">
      <div className="container-wide">
        <Reveal>
          <div className="mb-6 flex items-center gap-2.5">
            <History className="h-4 w-4 text-accent-bright" />
            <h2 className="font-display text-lg font-semibold text-white">Recently Viewed</h2>
          </div>
          <div className="-mx-4 overflow-x-auto px-4 pb-2 [scrollbar-width:thin]">
            <div className="flex gap-3">
              {items.map((p) => (
                <Link
                  key={p!.id}
                  to={`/product/${p!.id}`}
                  className="group flex w-[260px] shrink-0 items-center gap-3 rounded-2xl border border-edge bg-white/[0.02] p-3 transition-all duration-300 hover:border-accent-light/40 hover:bg-white/[0.04]"
                >
                  <ProductArt gameId={p!.game} className="h-12 w-16 shrink-0 rounded-lg" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-zinc-200 group-hover:text-white">{p!.name}</p>
                    <p className="font-display text-sm font-bold text-accent-bright">{formatPrice(p!.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
}

export function Layout() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1400);
    return () => clearTimeout(t);
  }, []);

  return (
    <CartProvider>
      <AnimatePresence>{loading && <Loader key="loader" />}</AnimatePresence>
      <CursorGlow />
      <ScrollToTop />
      <Navbar />
      <CartDrawer />
      <LiveNotifications />
      <main className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <Outlet />
            <RecentlyViewed />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </CartProvider>
  );
}
