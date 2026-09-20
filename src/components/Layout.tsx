import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { CartProvider } from '../context/CartContext';
import { ToastProvider } from '../context/ToastContext';
import { WishlistProvider } from '../context/WishlistContext';
import { Navbar } from './layout/Navbar';
import { Footer } from './layout/Footer';
import { CartDrawer } from './layout/CartDrawer';
import { WishlistDrawer } from './layout/WishlistDrawer';
import { LiveNotifications } from '../sections/LiveNotifications';
import { RecentlyViewed } from '../sections/RecentlyViewed';
import { Loader } from './Loader';

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

  // The CSS media block only covers CSS animations; Framer applies inline
  // transforms via JS, so it needs telling separately.
  return (
    <MotionConfig reducedMotion="user">
      <ToastProvider>
        <WishlistProvider>
          <CartProvider>
            <AnimatePresence>{loading && <Loader key="loader" />}</AnimatePresence>
            <ScrollToTop />
            <Navbar />
            <CartDrawer />
            <WishlistDrawer />
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
                  {location.pathname !== '/' && <RecentlyViewed />}
                </motion.div>
              </AnimatePresence>
            </main>
            <Footer />
          </CartProvider>
        </WishlistProvider>
      </ToastProvider>
    </MotionConfig>
  );
}
