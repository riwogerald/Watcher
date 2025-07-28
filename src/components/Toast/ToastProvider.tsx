import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void;
  hideToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
  maxToasts?: number;
}

const toastIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const toastColors = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

const iconColors = {
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-yellow-500',
  info: 'text-blue-500',
};

export function ToastProvider({ children, maxToasts = 5 }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toastData: Omit<Toast, 'id'>) => {
    const id = Date.now().toString();
    const newToast: Toast = {
      ...toastData,
      id,
      duration: toastData.duration ?? 5000,
    };

    setToasts(prev => {
      const updated = [newToast, ...prev].slice(0, maxToasts);
      return updated;
    });

    // Auto-hide toast after duration
    if (newToast.duration > 0) {
      setTimeout(() => {
        hideToast(id);
      }, newToast.duration);
    }
  }, [maxToasts]);

  const hideToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {toasts.map((toast) => {
            const Icon = toastIcons[toast.type];
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 300, scale: 0.3 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 300, scale: 0.5, transition: { duration: 0.2 } }}
                className={`max-w-sm w-full border rounded-lg p-4 shadow-lg ${toastColors[toast.type]}`}
              >
                <div className="flex items-start">
                  <Icon className={`w-5 h-5 mt-0.5 mr-3 ${iconColors[toast.type]}`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{toast.title}</p>
                    {toast.message && (
                      <p className="text-sm mt-1 opacity-90">{toast.message}</p>
                    )}
                  </div>
                  <button
                    onClick={() => hideToast(toast.id)}
                    className="ml-2 p-1 hover:bg-black hover:bg-opacity-10 rounded transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
