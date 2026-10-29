export type Category = 'comida' | 'transporte' | 'servicios' | 'otros';

export interface Expense {
    id: string;
    description: string;
    amount: number;
    category: Category;
    date: string;
}