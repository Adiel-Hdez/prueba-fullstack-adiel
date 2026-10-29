import { useState, type FormEvent } from 'react';
import type { Category } from '../types';

interface Props {
  onAddExpense: (expenseData: { description: string; amount: number; category: Category }) => Promise<void>;
}

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'comida', label: 'Comida' },
  { value: 'transporte', label: 'Transporte' },
  { value: 'servicios', label: 'Servicios' },
  { value: 'otros', label: 'Otros' },
];

export default function ExpenseForm({ onAddExpense }: Props) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('comida');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('El monto debe ser un número válido mayor a 0');
      setIsLoading(false);
      return;
    }

    try {
      await onAddExpense({
        description: description.trim(),
        amount: parsedAmount,
        category,
      });
      // Limpia el formulario tras éxito
      setDescription('');
      setAmount('');
      setCategory('comida');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocurrió un error inesperado al guardar el gasto');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6 mb-8">
      <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-slate-100">
        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-semibold">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-800">Registrar Nuevo Gasto</h2>
          <p className="text-xs text-slate-500">Completa la información para agregar una transacción</p>
        </div>
      </div>

      {error && (
        <div className="mb-5 p-3.5 rounded-lg bg-rose-50 border border-rose-200/80 flex items-start gap-2.5 text-rose-700 text-sm">
          <svg className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Descripción */}
          <div className="md:col-span-5">
            <label htmlFor="description" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Descripción
            </label>
            <input
              id="description"
              type="text"
              placeholder="Ej. Almuerzo de trabajo"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
            />
          </div>

          {/* Monto */}
          <div className="md:col-span-3">
            <label htmlFor="amount" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Monto ($)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-medium text-sm">
                $
              </span>
              <input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-7 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition font-mono"
              />
            </div>
          </div>

          {/* Categoría */}
          <div className="md:col-span-4">
            <label htmlFor="category" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Categoría
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg shadow-sm hover:shadow transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                Guardando gasto...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Guardar Gasto
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
