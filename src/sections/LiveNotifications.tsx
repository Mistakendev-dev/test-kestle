import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { notificationPool } from '../data/content';

interface Notice {
  id: number;
  text: string;
}

export function LiveNotifications() {
  const [notice, setNotice] = useState<Notice | null>(null);

  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout>;
    let showTimer: ReturnType<typeof setTimeout>;
    let count = 0;
    let cancelled = false;

    const schedule = (delay: number) => {
      showTimer = setTimeout(() => {
        if (cancelled) return;
        setNotice({ id: count, text: notificationPool[count % notificationPool.length] });
        count += 1;
        hideTimer = setTimeout(() => {
          if (cancelled) return;
          setNotice(null);
          schedule(9000 + Math.random() * 8000);
        }, 4200);
      }, delay);
    };

    schedule(5000);
    return () => {
      cancelled = true;
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-5 left-5 z-[60]">
      <AnimatePresence>
        {notice && (
          <motion.div
            key={notice.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="glass-strong flex items-center gap-3 rounded-2xl py-3 pl-3 pr-5 shadow-2xl"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/20">
              <ShoppingBag className="h-4 w-4 text-accent-bright" />
            </span>
            <div>
              <p className="text-sm font-medium text-white">{notice.text}</p>
              <p className="text-[11px] text-zinc-500">Just now</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
