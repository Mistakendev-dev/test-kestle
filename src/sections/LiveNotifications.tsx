import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { notificationPool } from '../data/content';

interface Notice {
  id: number;
  title: string;
  detail: string;
}

export function LiveNotifications() {
  const [notice, setNotice] = useState<Notice | null>(null);

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    let hideTimer: ReturnType<typeof setTimeout>;
    let showTimer: ReturnType<typeof setTimeout>;
    let count = 0;
    let cancelled = false;

    const schedule = (delay: number) => {
      showTimer = setTimeout(() => {
        if (cancelled) return;
        const item = notificationPool[count % notificationPool.length];
        setNotice({ id: count, ...item });
        count += 1;
        hideTimer = setTimeout(() => {
          if (cancelled) return;
          setNotice(null);
          schedule(11000 + Math.random() * 9000);
        }, 4200);
      }, delay);
    };

    schedule(6000);
    return () => {
      cancelled = true;
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-5 left-5 z-[60] hidden sm:block">
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
              <Activity className="h-4 w-4 text-accent-bright" />
            </span>
            <div>
              <p className="text-sm font-medium text-white">{notice.title}</p>
              <p className="text-[11px] text-zinc-500">{notice.detail} · demo activity</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
