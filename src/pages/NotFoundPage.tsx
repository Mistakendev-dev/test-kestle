import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Home } from 'lucide-react';
import { Particles } from '../components/effects/Particles';

export function NotFoundPage() {
  return (
    <div className="noise relative flex min-h-[100svh] items-center justify-center overflow-hidden">
      <div aria-hidden className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black,transparent)]" />
      <Particles density={30} />
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-[120px]"
        style={{ background: 'radial-gradient(ellipse, rgba(46,48,106,0.4) 0%, transparent 70%)' }}
      />
      <div className="container-wide relative text-center">
        <motion.p
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="bg-gradient-to-b from-white to-zinc-600 bg-clip-text font-display text-[8rem] font-bold leading-none tracking-tighter text-transparent md:text-[12rem]"
        >
          404
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="font-display text-2xl font-semibold text-white">This page went AFK</h1>
          <p className="mx-auto mt-3 max-w-sm text-zinc-400">
            The page you are looking for does not exist or may have been moved.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/" className="btn-primary btn-shine">
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
            <Link to="/products" className="btn-ghost">
              <ArrowLeft className="h-4 w-4" />
              Browse Products
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
