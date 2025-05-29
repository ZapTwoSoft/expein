
import { Header } from '@/components/layout/Header';
import { ExpenseSummary } from './ExpenseSummary';
import { AddExpenseForm } from '@/components/expenses/AddExpenseForm';
import { ExpenseList } from '@/components/expenses/ExpenseList';

export function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Expense Dashboard
          </h2>
          <p className="text-gray-600">
            Track and manage your expenses efficiently
          </p>
        </div>

        <ExpenseSummary />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <AddExpenseForm />
          </div>
          
          <div className="lg:col-span-2">
            <ExpenseList />
          </div>
        </div>
      </main>
    </div>
  );
}
