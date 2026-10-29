import { useState, useEffect } from 'react';
import type { Expense, Category } from './types';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import EditExpenseModal from './components/EditExpenseModal';
import ConfirmDeleteModal from './components/ConfirmDeleteModal';
import Notification, { type NotificationState } from './components/Notification';

const API_URL = 'http://localhost:3000/api/expenses';

export default function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Estados para modales y confirmaciones
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Estado para notificaciones
  const [notification, setNotification] = useState<NotificationState | null>(null);

  const showNotification = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({
      id: Date.now(),
      message,
      type,
    });
  };

  useEffect(() => {
    fetchExpenses();
  }, [filterCategory]);

  const fetchExpenses = async () => {
    try {
      setIsLoading(true);
      const url = filterCategory ? `${API_URL}?category=${filterCategory}` : API_URL;
      const res = await fetch(url);
      const data = await res.json();
      setExpenses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar la lista de gastos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Crear gasto
  const handleAddExpense = async (expenseData: Omit<Expense, 'id' | 'date'>) => {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expenseData),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Error al guardar el gasto');
    }

    if (!filterCategory || filterCategory === data.category) {
      setExpenses((prev) => [...prev, data]);
    }

    showNotification('El gasto se añadió correctamente', 'success');
  };

  // Editar gasto (PATCH)
  const handleEditExpense = async (
    id: string,
    updatedData: { description: string; amount: number; category: Category }
  ) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Error al actualizar el gasto');
    }

    // Actualiza en el estado local
    setExpenses((prev) =>
      prev
        .map((e) => (e.id === id ? { ...e, ...data } : e))
        .filter((e) => !filterCategory || e.category === filterCategory)
    );

    showNotification('El gasto se actualizó correctamente', 'success');
  };

  // Eliminar gasto (DELETE con confirmación previa)
  const handleConfirmDelete = async () => {
    if (!expenseToDelete) return;

    try {
      setIsDeleting(true);
      const res = await fetch(`${API_URL}/${expenseToDelete.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al eliminar el gasto');
      }

      setExpenses((prev) => prev.filter((e) => e.id !== expenseToDelete.id));
      showNotification('El gasto se eliminó correctamente', 'info');
      setExpenseToDelete(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'No se pudo eliminar el gasto';
      showNotification(msg, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const totalAmount = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const averageAmount = expenses.length > 0 ? totalAmount / expenses.length : 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Sistema de Notificaciones Flotantes */}
      <Notification
        notification={notification}
        onClose={() => setNotification(null)}
      />

      {/* Modal de Edición de Gasto */}
      <EditExpenseModal
        isOpen={Boolean(expenseToEdit)}
        expense={expenseToEdit}
        onClose={() => setExpenseToEdit(null)}
        onSave={handleEditExpense}
      />

      {/* Tarjeta / Modal de Confirmación para Eliminar */}
      <ConfirmDeleteModal
        isOpen={Boolean(expenseToDelete)}
        expense={expenseToDelete}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setExpenseToDelete(null)}
      />

      {/* Barra de Navegación / Encabezado Principal */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 tracking-tight leading-none">
                Gestión de Gastos
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">Control y registro presupuestario</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Sistema Activo
            </span>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Tarjetas de Resumen Ejecutivo / Métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Acumulado
            </span>
            <div className="text-2xl font-bold text-slate-900 font-mono mt-1">
              ${totalAmount.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-slate-400 mt-1">Monto de la vista actual</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Transacciones
            </span>
            <div className="text-2xl font-bold text-slate-900 font-mono mt-1">
              {expenses.length}
            </div>
            <p className="text-xs text-slate-400 mt-1">Gastos registrados</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Promedio por Gasto
            </span>
            <div className="text-2xl font-bold text-slate-900 font-mono mt-1">
              ${averageAmount.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-slate-400 mt-1">Por cada movimiento</p>
          </div>
        </div>

        {/* Formulario para registrar gastos */}
        <ExpenseForm onAddExpense={handleAddExpense} />

        {/* Lista de gastos con filtro, edición y eliminación */}
        {isLoading ? (
          <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center shadow-sm">
            <div className="inline-block animate-spin w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full mb-2"></div>
            <p className="text-sm text-slate-500">Cargando registros...</p>
          </div>
        ) : (
          <ExpenseList
            expenses={expenses}
            currentFilter={filterCategory}
            onFilterChange={setFilterCategory}
            onEditExpense={(expense) => setExpenseToEdit(expense)}
            onRequestDelete={(expense) => setExpenseToDelete(expense)}
          />
        )}
      </main>
    </div>
  );
}
