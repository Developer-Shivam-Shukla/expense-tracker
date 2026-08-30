import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    ({ type, title, message, duration = 4000 }) => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
      const newToast = { id, type, title, message, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const success = useCallback(
    (title, message) => {
      addToast({ type: 'success', title, message });
    },
    [addToast]
  );

  const error = useCallback(
    (title, message) => {
      addToast({ type: 'error', title, message, duration: 5000 });
    },
    [addToast]
  );

  const info = useCallback(
    (title, message) => {
      addToast({ type: 'info', title, message });
    },
    [addToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, info }}>
      {children}
      {/* Toast container */}
      <div
        aria-live="assertive"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-4 sm:px-0"
      >
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';
          const isInfo = toast.type === 'info';

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border text-sm transition-all duration-300 transform translate-y-0 ${
                isSuccess
                  ? 'bg-emerald-950/90 text-emerald-100 border-emerald-800/80 backdrop-blur-md'
                  : isError
                  ? 'bg-rose-950/90 text-rose-100 border-rose-800/80 backdrop-blur-md'
                  : 'bg-zinc-900/90 text-zinc-100 border-zinc-700/80 backdrop-blur-md'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                {isError && <AlertCircle className="w-5 h-5 text-rose-400" />}
                {isInfo && <Info className="w-5 h-5 text-sky-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-zinc-50 leading-tight">{toast.title}</p>
                {toast.message && (
                  <p className="mt-1 text-xs text-zinc-300 leading-normal">{toast.message}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="shrink-0 p-1 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-white/10 transition-colors"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
