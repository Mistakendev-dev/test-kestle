import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Heart, Info, Trash2 } from 'lucide-react';

export type ToastKind = 'success' | 'wishlist' | 'remove' | 'info';

interface Toast {
  id: number;
  message: string;
  detail?: string;
  kind: ToastKind;
}

interface ToastContextValue {
  toast: (message: string, opts?: { detail?: string; kind?: ToastKind }) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const icons: Record<ToastKind, typeof Check> = {
  success: Check,
  wishlist: Heart,
  remove: Trash2,
  info: Info,
};

const iconStyles: Record<ToastKind, string> = {
  success: 'bg-accent/25 text-accent-bright',
  wishlist: 'bg-rose-500/15 text-rose-300',
  remove: 'bg-zinc-500/15 text-zinc-300',
  info: 'bg-accent/20 text-accent-bright',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const toast = useCallback<ToastContextValue['toast']>((message, opts) => {
    const id = nextId.current++;
    setToasts((prev) => [...prev.slice(-2), { id, message, detail: opts?.detail, kind: opts?.kind ?? 'success' }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3200);
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-[95] flex flex-col items-center gap-2 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:items-end"
      >
        <AnimatePresence initial={false}>
          {toasts.map((t) => {
            const Icon = icons[t.kind];
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 24, scale: 0.96 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="pane-raised pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl py-3 pl-3 pr-5 shadow-2xl sm:w-auto sm:min-w-[260px]"
              >
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconStyles[t.kind]}`}>
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">{t.message}</p>
                  {t.detail && <p className="truncate text-[11px] text-zinc-500">{t.detail}</p>}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
