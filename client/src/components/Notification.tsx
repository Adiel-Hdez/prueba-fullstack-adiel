import { useEffect } from 'react';

export interface NotificationState {
  id: number;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface Props {
  notification: NotificationState | null;
  onClose: () => void;
}

export default function Notification({ notification, onClose }: Props) {
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [notification, onClose]);

  if (!notification) return null;

  const isSuccess = notification.type === 'success';
  const isError = notification.type === 'error';

  return (
    <div className="fixed top-5 right-5 z-50 max-w-sm w-full animate-in fade-in slide-in-from-top-3 duration-300">
      <div
        className={`p-4 rounded-xl border shadow-lg flex items-start gap-3 ${
          isSuccess
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
            : isError
            ? 'bg-rose-50 border-rose-200 text-rose-900'
            : 'bg-indigo-50 border-indigo-200 text-indigo-900'
        }`}
      >
        <div className="shrink-0 mt-0.5">
          {isSuccess ? (
            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : isError ? (
            <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          )}
        </div>

        <div className="flex-1">
          <p className="text-sm font-semibold leading-tight">
            {isSuccess ? 'Operación exitosa' : isError ? 'Atención' : 'Notificación'}
          </p>
          <p className="text-xs text-slate-600 mt-0.5">{notification.message}</p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="shrink-0 text-slate-400 hover:text-slate-600 p-1 rounded-md transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

