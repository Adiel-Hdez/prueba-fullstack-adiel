import express, { Request, Response } from 'express';
import cors from 'cors';
import { randomUUID } from 'crypto';
import { Expense, Category } from './types.js';

const app = express();


app.use(cors());
app.use(express.json());

let expenses: Expense[] = [];

app.get('/api/expenses', (req: Request, res: Response) => {
    const { category } = req.query;

    if (category) {
        const filtered = expenses.filter(e => e.category === category);
        return res.json(filtered);
    }

    res.json(expenses);
});


app.post('/api/expenses', (req: Request, res: Response): any => {
    const { description, amount, category } = req.body;

    if (!description || typeof description !== 'string' || description.trim() === '') {
        return res.status(400).json({ error: 'La descripción es obligatoria' });
    }
    if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ error: 'El monto debe ser un número mayor a 0' });
    }
    const validCategories: Category[] = ['comida', 'transporte', 'servicios', 'otros'];
    if (!validCategories.includes(category)) {
        return res.status(400).json({ error: 'Categoría no válida' });
    }

    const newExpense: Expense = {
        id: randomUUID(),
        description: description.trim(),
        amount,
        category,
        date: new Date().toISOString()
    };

    expenses.push(newExpense);
    res.status(201).json(newExpense);
});

app.delete('/api/expenses/:id', (req: Request, res: Response): any => {
    const { id } = req.params;
    const initialLength = expenses.length;

    expenses = expenses.filter(e => e.id !== id);

    if (expenses.length === initialLength) {
        return res.status(404).json({ error: 'Gasto no encontrado' });
    }

    res.status(200).json({ message: 'Gasto eliminado correctamente' });
});

app.patch('/api/expenses/:id', (req: Request, res: Response): any => {
    const { id } = req.params;
    const { description, amount, category } = req.body;

    const expenseIndex = expenses.findIndex(e => e.id === id);
    if (expenseIndex === -1) {
        return res.status(404).json({ error: 'Gasto no encontrado' });
    }

    if (description !== undefined) {
        if (typeof description !== 'string' || description.trim() === '') {
            return res.status(400).json({ error: 'La descripción no puede estar vacía' });
        }
    }
    if (amount !== undefined) {
        if (typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({ error: 'El monto debe ser un número mayor a 0' });
        }
    }
    if (category !== undefined) {
        const validCategories: Category[] = ['comida', 'transporte', 'servicios', 'otros'];
        if (!validCategories.includes(category)) {
            return res.status(400).json({ error: 'Categoría no válida' });
        }
    }


    expenses[expenseIndex] = {
        ...expenses[expenseIndex],
        ...(description !== undefined && { description: description.trim() }),
        ...(amount !== undefined && { amount }),
        ...(category !== undefined && { category })
    };

    res.json(expenses[expenseIndex]);
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});