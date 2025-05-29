
import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { ExpenseSummary } from './ExpenseSummary';
import { AddExpenseForm } from '@/components/expenses/AddExpenseForm';
import { ExpenseList } from '@/components/expenses/ExpenseList';
import { AddIncomeForm } from '@/components/income/AddIncomeForm';
import { IncomeList } from '@/components/income/IncomeList';
import { Button } from '@/components/ui/button';
import { TrendingDown, TrendingUp } from 'lucide-react';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<'expenses' | 'income'>('expenses');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Financial Dashboard
          </h2>
          <p className="text-gray-600">
            Track and manage your expenses and income efficiently
          </p>
        </div>

        <ExpenseSummary />

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex space-x-2">
            <Button
              variant={activeTab === 'expenses' ? 'default' : 'outline'}
              onClick={() => setActiveTab('expenses')}
              className="flex items-center"
            >
              <TrendingDown className="h-4 w-4 mr-2" />
              Expenses
            </Button>
            <Button
              variant={activeTab === 'income' ? 'default' : 'outline'}
              onClick={() => setActiveTab('income')}
              className="flex items-center"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Income
            </Button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            {activeTab === 'expenses' ? <AddExpenseForm /> : <AddIncomeForm />}
          </div>
          
          <div className="lg:col-span-2">
            {activeTab === 'expenses' ? <ExpenseList /> : <IncomeList />}
          </div>
        </div>
      </main>
    </div>
  );
}
