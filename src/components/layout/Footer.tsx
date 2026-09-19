import { Link } from 'react-router-dom';
import { ArrowUpRight, Mail, MessageCircle } from 'lucide-react';
import { games } from '../../data/games';

const columns = [
  {
    title: 'Marketplace',
    links: [
      { label: 'All Products', to: '/products' },
      { label: 'NFA Accounts', to: '/products?type=NFA' },
      { label: 'Full Access', to: '/products?type=FA' },
      { label: 'Ranked Ready', to: '/products?type=Ranked' },
      { label: 'Stacked Accounts', to: '/products?type=Stacked' },
    ],
  },
  {
    title: 'Games',
    links: [
      ...games.slice(0, 4).map((g) => ({ label: g.name, to: `/games/${g.id}` })),
      { label: 'All Games', to: '/games' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Discord Server', to: '/faq' },
      { label: 'Email Support', to: '/faq' },
      { label: 'Order Issues', to: '/faq' },
      { label: 'FAQ', to: '/faq' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: '/how-it-works' },
      { label: 'How It Works', to: '/how-it-works' },
      { label: 'Contact', to: '/faq' },
      { label: 'Status', to: '/faq' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms of Service', to: '/faq' },
      { label: 'Privacy Policy', to: '/faq' },
      { label: 'Refund Policy', to: '/faq' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-edge bg-panel/40">
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 left-1/2 -translate-x-1/2 select-none font-display text-[22vw] font-bold leading-none tracking-tighter text-white/[0.02]"
      >
        NFA
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-light/50 to-transparent"
      />

      <div className="container-wide relative py-16">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,2.6fr)] lg:gap-16">
          <div>
            <Link to="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent font-display text-sm font-bold text-white">
                N
              </span>
              <span className="font-display text-xl font-bold tracking-tight text-white">
                NFA<span className="text-accent-bright"> MARKET</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-zinc-500">
              The premium marketplace for gaming accounts. Instant delivery, verified stock, and 24/7 support — built for gamers.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href="#"
                aria-label="Discord"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-edge bg-white/[0.03] text-zinc-400 transition-all duration-300 hover:border-accent-light/50 hover:bg-accent/15 hover:text-white"
              >
                <MessageCircle className="h-[18px] w-[18px]" />
              </a>
              <a
                href="#"
                aria-label="Email"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-edge bg-white/[0.03] text-zinc-400 transition-all duration-300 hover:border-accent-light/50 hover:bg-accent/15 hover:text-white"
              >
                <Mail className="h-[18px] w-[18px]" />
              </a>
            </div>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-edge bg-white/[0.02] px-3 py-1.5">
              <span className="live-dot h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="text-[11px] font-medium text-zinc-400">All systems operational</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-4">
            {columns.map((col) => (
              <div key={col.title} className="min-w-0">
                <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">{col.title}</h4>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        to={l.to}
                        className="group inline-flex items-center gap-1 text-sm text-zinc-400 transition-colors duration-300 hover:text-white"
                      >
                        <span className="truncate">{l.label}</span>
                        <ArrowUpRight className="h-3 w-3 shrink-0 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-edge pt-8 md:flex-row">
          <p className="text-xs text-zinc-600">© {new Date().getFullYear()} NFA Market. All rights reserved.</p>
          <p className="text-xs text-zinc-600">
            Not affiliated with any game publisher. All trademarks belong to their respective owners.
          </p>
        </div>
      </div>
    </footer>
  );
}
