import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { CheckCircle2, Info, X, XCircle } from 'lucide-react';

type ToastKind = 'success' | 'error' | 'info';
type Toast = { id: number; kind: ToastKind; title?: string; message: string };

type ToastValue = {
  push: (message: string, kind?: ToastKind, title?: string) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
};

const ToastContext = createContext<ToastValue | null>(null);

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback(
    (message: string, kind: ToastKind = 'info', title?: string) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev.slice(-2), { id, kind, message, title }]);
      window.setTimeout(() => dismiss(id), 5200);
    },
    [dismiss],
  );

  const value = useMemo<ToastValue>(
    () => ({
      push,
      success: (message, title) => push(message, 'success', title),
      error: (message, title) => push(message, 'error', title),
      info: (message, title) => push(message, 'info', title),
    }),
    [push],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-region" role="region" aria-live="polite" aria-label="Notifications">
        {toasts.map((toast) => {
          const Icon = ICONS[toast.kind];
          return (
            <div key={toast.id} className={`toast toast--${toast.kind}`}>
              <Icon size={18} className="toast__icon" aria-hidden />
              <div className="toast__body">
                {toast.title ? <span className="toast__title">{toast.title}</span> : null}
                <span>{toast.message}</span>
              </div>
              <button type="button" className="toast__close" onClick={() => dismiss(toast.id)} aria-label="Dismiss notification">
                <X size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside ToastProvider');
  return context;
}
