import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useMotionTemplate, useScroll, useTransform } from 'framer-motion';
import { Heart, Menu, Search, ShoppingCart, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { cn } from '../../lib/utils';
import { SearchOverlay } from './SearchOverlay';

const links = [
  { to: '/products', label: 'Products' },
  { to: '/resell', label: 'Resell' },
  { to: '/docs', label: 'Docs' },
];

/** Secondary destinations — surfaced in the mobile sheet and the footer. */
const secondaryLinks = [
  { to: '/games', label: 'Games' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/faq', label: 'FAQ' },
];

/** Scroll distance over which the bar collapses into its compact state. */
const COLLAPSE = 140;

export function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { count, openCart } = useCart();
  const { count: wishCount, open: openWishlist } = useWishlist();
  const location = useLocation();
  const onProductsPage = location.pathname === '/products';

  // Interpolated from scroll position rather than toggled, so the bar morphs
  // continuously instead of snapping between two CSS states.
  const { scrollY } = useScroll();
  const range = [0, COLLAPSE];
  const shellPad = useTransform(scrollY, range, [0, 10]);
  const shellWidth = useTransform(scrollY, range, ['100%', '96%']);
  const barHeight = useTransform(scrollY, range, [86, 58]);
  const barRadius = useTransform(scrollY, range, [0, 999]);
  const barBg = useTransform(scrollY, range, ['rgba(8,8,14,0)', 'rgba(8,8,14,0.82)']);
  const barBorder = useTransform(scrollY, range, ['rgba(255,255,255,0)', 'rgba(255,255,255,0.09)']);
  const barShadow = useTransform(scrollY, range, [
    '0 0 0 rgba(0,0,0,0)',
    '0 2px 4px rgba(0,0,0,0.4), 0 22px 50px -24px rgba(0,0,0,0.95)',
  ]);
  const blur = useTransform(scrollY, range, [0, 22]);
  const barBlur = useMotionTemplate`saturate(150%) blur(${blur}px)`;
  const markScale = useTransform(scrollY, range, [1, 0.88]);

  // ⌘K / Ctrl+K opens global search, except on /products where the page owns it.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)) {
        if (onProductsPage) return;
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onProductsPage]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <motion.header
        style={{ paddingTop: shellPad }}
        className="fixed inset-x-0 top-0 z-50 px-3 sm:px-4"
      >
        <motion.nav
          style={{
            width: shellWidth,
            height: barHeight,
            borderRadius: barRadius,
            background: barBg,
            borderColor: barBorder,
            boxShadow: barShadow,
            backdropFilter: barBlur,
            WebkitBackdropFilter: barBlur,
          }}
          className="lit-edge relative mx-auto flex max-w-7xl items-center justify-between gap-4 border px-4 sm:px-6"
        >
          <Link to="/" className="group relative flex items-center gap-2.5">
            <motion.span
              style={{ scale: markScale }}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-accent-light to-accent-deep font-display text-sm font-bold text-white shadow-rest transition-shadow duration-300 group-hover:shadow-glow"
            >
              N
            </motion.span>
            <span className="font-display text-lg font-bold tracking-tight text-white">
              NFA<span className="text-accent-bright"> MARKET</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'group relative rounded-lg px-3.5 py-2 text-sm font-medium transition-colors duration-300',
                    isActive ? 'text-white' : 'text-zinc-400 hover:text-zinc-100',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {l.label}
                    <span
                      className={cn(
                        'absolute inset-x-3 -bottom-px h-px bg-gradient-to-r from-transparent via-accent-bright to-transparent transition-all duration-300',
                        isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-60',
                      )}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-transparent text-zinc-400 transition-all duration-300 hover:border-edge hover:bg-white/[0.04] hover:text-white"
            >
              <Search className="h-[18px] w-[18px]" />
            </button>
            <button
              onClick={openWishlist}
              aria-label="Wishlist"
              className="relative hidden h-10 w-10 items-center justify-center rounded-xl border border-transparent text-zinc-400 transition-all duration-300 hover:border-edge hover:bg-white/[0.04] hover:text-white sm:flex"
            >
              <Heart className={cn('h-[18px] w-[18px]', wishCount > 0 && 'fill-rose-400/80 text-rose-300')} />
              <AnimatePresence>
                {wishCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white"
                  >
                    {wishCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <button
              onClick={openCart}
              aria-label="Cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-transparent text-zinc-400 transition-all duration-300 hover:border-edge hover:bg-white/[0.04] hover:text-white"
            >
              <ShoppingCart className="h-[18px] w-[18px]" />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <Link to="/products" className="btn-primary btn-shine ml-1 hidden !px-5 !py-2.5 md:inline-flex">
              Browse Products
            </Link>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menu"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-transparent text-zinc-300 transition-all duration-300 hover:border-edge hover:bg-white/[0.04] lg:hidden"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </motion.nav>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="pane-raised mx-auto mt-2 max-w-7xl overflow-hidden lg:hidden"
            >
              <div className="flex flex-col gap-1 p-3">
                {[...links, ...secondaryLinks].map((l, i) => (
                  <motion.div
                    key={l.to}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                  >
                    <NavLink
                      to={l.to}
                      end={l.to === '/'}
                      className={({ isActive }) =>
                        cn(
                          'block rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-accent/15 text-white'
                            : 'text-zinc-400 hover:bg-white/[0.04] hover:text-white',
                        )
                      }
                    >
                      {l.label}
                    </NavLink>
                  </motion.div>
                ))}
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    openWishlist();
                  }}
                  className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-zinc-400 transition-colors hover:bg-white/[0.04] hover:text-white sm:hidden"
                >
                  <span className="flex items-center gap-2">
                    <Heart className={cn('h-4 w-4', wishCount > 0 && 'fill-rose-400/80 text-rose-300')} />
                    Wishlist
                  </span>
                  {wishCount > 0 && <span className="text-xs text-rose-300">{wishCount}</span>}
                </button>
                <Link to="/products" className="btn-primary btn-shine mt-2">
                  Browse Products
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
