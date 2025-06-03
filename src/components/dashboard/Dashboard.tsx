import { useState } from 'react';
import { ExpenseSummary } from './ExpenseSummary';
import { IncomeExpenseChart } from './IncomeExpenseChart';
import { TransactionList } from './TransactionList';
import { Button } from '@/components/ui/button';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { ExpenseModal } from '@/components/expenses/ExpenseModal';
import { IncomeModal } from '@/components/income/IncomeModal';

export function Dashboard() {
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Track and manage your expenses and income efficiently
          </p>
        </div>
        
        {/* Quick Action Buttons */}
        <div className="flex gap-2 sm:gap-3">
          <Button 
            onClick={() => setIsExpenseModalOpen(true)}
            variant="outline"
            className="flex items-center text-base sm:text-base h-12 sm:h-9 px-6 sm:px-4"
          >
            <TrendingDown className="h-4 w-4 sm:h-4 sm:w-4 mr-2 sm:mr-2" />
            <span className="sm:hidden">Add Expense</span>
            <span className="hidden sm:inline">Add Expense</span>
          </Button>
          
          <Button 
            onClick={() => setIsIncomeModalOpen(true)}
            className="flex items-center text-base sm:text-base h-12 sm:h-9 px-6 sm:px-4"
          >
            <TrendingUp className="h-4 w-4 sm:h-4 sm:w-4 mr-2 sm:mr-2" />
            <span className="sm:hidden">Add Income</span>
            <span className="hidden sm:inline">Add Income</span>
          </Button>
        </div>
      </div>

      <ExpenseSummary />

      {/* Chart and Transaction List Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2">
          <IncomeExpenseChart />
        </div>
        <div className="lg:col-span-1">
          <TransactionList />
        </div>
      </div>

      {/* Modals */}
      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
      />
      
      <IncomeModal
        isOpen={isIncomeModalOpen}
        onClose={() => setIsIncomeModalOpen(false)}
      />
    </div>
  );
}
