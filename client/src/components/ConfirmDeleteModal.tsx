import type { Expense } from '../types';

interface Props {
  expense: Expense | null;
  isOpen: boolean;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDeleteModal({
  expense,
  isOpen,
  isDeleting,
  onConfirm,
  onCancel,
}: Props) {
  if (!isOpen || !expense) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              ¿Eliminar este gasto?
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Estás a punto de eliminar <strong className="text-slate-800 font-medium">"{expense.description}"</strong> por un monto de{' '}
              <strong className="text-slate-900 font-mono">
                ${expense.amount.toFixed(2)}
              </strong>
              . Esta acción es definitiva y no se puede deshacer.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
          <button
            type="button"
            disabled={isDeleting}
            onClick={onCancel}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={onConfirm}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-lg shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                Eliminando...
              </>
            ) : (
              'Sí, eliminar gasto'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

