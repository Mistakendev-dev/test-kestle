import { motion } from 'framer-motion';

export function Loader() {
  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-void"
    >
      <div className="relative flex h-16 w-16 items-center justify-center">
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-2xl border-2 border-accent-light/60"
          animate={{ rotate: 360 }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
        />
        <motion.span
          aria-hidden
          className="absolute inset-2 rounded-xl border border-accent-bright/40"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
        />
        <span className="font-display text-xl font-bold text-white">N</span>
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-6 font-display text-sm font-semibold tracking-[0.35em] text-zinc-400"
      >
        NFA MARKET
      </motion.p>
      <div className="mt-5 h-0.5 w-40 overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          className="h-full w-1/3 rounded-full bg-accent-bright"
          animate={{ x: ['-100%', '300%'] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </motion.div>
  );
}
