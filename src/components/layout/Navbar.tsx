import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Search, ShoppingCart, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { cn } from '../../lib/utils';
import { SearchOverlay } from './SearchOverlay';

const links = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/games', label: 'Games' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/faq', label: 'FAQ' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { count, openCart } = useCart();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-500',
          scrolled
            ? 'border-b border-edge bg-void/80 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent',
        )}
      >
        <nav className="container-wide flex h-16 items-center justify-between gap-4 md:h-[72px]">
          <Link to="/" className="group flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent font-display text-sm font-bold text-white transition-shadow duration-300 group-hover:shadow-[0_0_20px_-2px_rgba(74,79,158,0.8)]">
              N
            </span>
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
        </nav>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden border-b border-edge bg-void/95 backdrop-blur-xl lg:hidden"
            >
              <div className="container-wide flex flex-col gap-1 py-4">
                {links.map((l, i) => (
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
                <Link to="/products" className="btn-primary btn-shine mt-2">
                  Browse Products
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
