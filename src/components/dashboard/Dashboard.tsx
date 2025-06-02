
import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { ExpenseSummary } from './ExpenseSummary';
import { IncomeExpenseChart } from './IncomeExpenseChart';
import { ExpenseList } from '@/components/expenses/ExpenseList';
import { IncomeList } from '@/components/income/IncomeList';
import { ExpenseModal } from '@/components/expenses/ExpenseModal';
import { IncomeModal } from '@/components/income/IncomeModal';
import { Button } from '@/components/ui/button';
import { TrendingDown, TrendingUp, Plus } from 'lucide-react';
import { Expense } from '@/hooks/useExpenses';
import { Income } from '@/hooks/useIncome';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<'expenses' | 'income'>('expenses');
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setIsExpenseModalOpen(true);
  };

  const handleEditIncome = (income: Income) => {
    setEditingIncome(income);
    setIsIncomeModalOpen(true);
  };

  const handleCloseExpenseModal = () => {
    setIsExpenseModalOpen(false);
    setEditingExpense(null);
  };

  const handleCloseIncomeModal = () => {
    setIsIncomeModalOpen(false);
    setEditingIncome(null);
  };

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

        {/* Tab Navigation with Add Buttons */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
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
            
            <div className="flex space-x-2">
              <Button
                onClick={() => setIsExpenseModalOpen(true)}
                className="flex items-center"
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
              <Button
                onClick={() => setIsIncomeModalOpen(true)}
                className="flex items-center bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Income
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content - Side by Side Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chart Section */}
          <div>
            <IncomeExpenseChart />
          </div>
          
          {/* Transaction Lists Section */}
          <div>
            {activeTab === 'expenses' ? (
              <ExpenseList onEdit={handleEditExpense} />
            ) : (
              <IncomeList onEdit={handleEditIncome} />
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={handleCloseExpenseModal}
        expense={editingExpense}
      />
      
      <IncomeModal
        isOpen={isIncomeModalOpen}
        onClose={handleCloseIncomeModal}
        income={editingIncome}
      />
    </div>
  );
}
