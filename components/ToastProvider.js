'use client';
import { useState, useCallback, createContext, useContext, useRef } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timerRefs = useRef({});

  const showToast = useCallback((message, type = 'error') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    timerRefs.current[id] = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      delete timerRefs.current[id];
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-full max-w-[340px] flex flex-col gap-2 pointer-events-none px-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`slide-up-enter flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-xs font-medium pointer-events-auto ${
              t.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-800 text-white'
            }`}
          >
            <i className={`fa-solid ${t.type === 'success' ? 'fa-circle-check' : 'fa-triangle-exclamation'}`} />
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
