import type { Expense, Category } from '../types';

interface Props {
  expenses: Expense[];
  currentFilter: string;
  onFilterChange: (category: string) => void;
  onEditExpense: (expense: Expense) => void;
  onRequestDelete: (expense: Expense) => void;
}

const CATEGORY_STYLES: Record<Category, { bg: string; text: string; border: string; label: string }> = {
  comida: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200/80',
    label: 'Comida',
  },
  transporte: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200/80',
    label: 'Transporte',
  },
  servicios: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200/80',
    label: 'Servicios',
  },
  otros: {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200/80',
    label: 'Otros',
  },
};

const CATEGORIES: { value: string; label: string }[] = [
  { value: '', label: 'Todas las categorías' },
  { value: 'comida', label: 'Comida' },
  { value: 'transporte', label: 'Transporte' },
  { value: 'servicios', label: 'Servicios' },
  { value: 'otros', label: 'Otros' },
];

export default function ExpenseList({
  expenses,
  currentFilter,
  onFilterChange,
  onEditExpense,
  onRequestDelete,
}: Props) {
  const total = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('es-MX', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(date);
    } catch {
      return null;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
      {/* Encabezado y Selector de Filtro */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-slate-800">Historial de Gastos</h2>
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-slate-100 text-slate-600">
              {expenses.length} {expenses.length === 1 ? 'registro' : 'registros'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Listado ordenado de transacciones registradas</p>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="filterCategory" className="text-xs font-medium text-slate-500 whitespace-nowrap">
            Filtrar:
          </label>
          <select
            id="filterCategory"
            value={currentFilter}
            onChange={(e) => onFilterChange(e.target.value)}
            className="text-xs font-medium px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition cursor-pointer"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de Gastos */}
      {expenses.length === 0 ? (
        <div className="py-14 px-4 text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-slate-700">No hay gastos registrados</p>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {currentFilter
              ? 'No se encontraron gastos para la categoría seleccionada.'
              : 'Empieza agregando un nuevo gasto con el formulario superior.'}
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {expenses.map((expense) => {
            const categoryMeta = CATEGORY_STYLES[expense.category] || {
              bg: 'bg-slate-100',
              text: 'text-slate-700',
              border: 'border-slate-200',
              label: expense.category,
            };

            const formattedDate = formatDate(expense.date);

            return (
              <div
                key={expense.id}
                className="p-4 sm:px-6 flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="shrink-0">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${categoryMeta.bg} ${categoryMeta.text} ${categoryMeta.border}`}
                    >
                      {categoryMeta.label}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {expense.description}
                    </p>
                    {formattedDate && (
                      <p className="text-xs text-slate-400 mt-0.5">{formattedDate}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-bold text-slate-900 font-mono tracking-tight mr-1">
                    ${expense.amount.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>

                  {/* Botón Editar */}
                  <button
                    type="button"
                    title="Editar gasto"
                    onClick={() => onEditExpense(expense)}
                    className="text-slate-400 hover:text-indigo-600 p-1.5 rounded-md hover:bg-indigo-50 transition-all focus:outline-none"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>

                  {/* Botón Eliminar */}
                  <button
                    type="button"
                    title="Eliminar gasto"
                    onClick={() => onRequestDelete(expense)}
                    className="text-slate-400 hover:text-rose-600 p-1.5 rounded-md hover:bg-rose-50 transition-all focus:outline-none"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pie con Total */}
      <div className="p-4 sm:px-6 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Total General
        </span>
        <span className="text-lg font-bold text-slate-900 font-mono">
          ${total.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>
    </div>
  );
}
