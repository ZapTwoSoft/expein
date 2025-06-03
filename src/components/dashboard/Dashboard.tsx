import { useState } from 'react';
import { ExpenseSummary } from './ExpenseSummary';
import { IncomeExpenseChart } from './IncomeExpenseChart';
import { TransactionList } from './TransactionList';
import { Button } from '@/components/ui/button';
import { TrendingDown, TrendingUp, HandCoins } from 'lucide-react';
import { ExpenseModal } from '@/components/expenses/ExpenseModal';
import { IncomeModal } from '@/components/income/IncomeModal';
import { LoanModal } from '@/components/loans/LoanModal';

export function Dashboard() {
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);

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
        
        {/* Quick Action Buttons - 3 in a row on mobile, flex on desktop */}
        <div className="grid grid-cols-3 gap-2 sm:flex sm:gap-3">
          <Button 
            onClick={() => setIsExpenseModalOpen(true)}
            variant="outline"
            className="flex items-center justify-center text-xs sm:text-base h-10 sm:h-9 px-2 sm:px-4"
          >
            <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline sm:hidden">Expense</span>
            <span className="hidden sm:inline">Add Expense</span>
          </Button>
          
          <Button 
            onClick={() => setIsIncomeModalOpen(true)}
            className="flex items-center justify-center text-xs sm:text-base h-10 sm:h-9 px-2 sm:px-4"
          >
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline sm:hidden">Income</span>
            <span className="hidden sm:inline">Add Income</span>
          </Button>

          <Button 
            onClick={() => setIsLoanModalOpen(true)}
            variant="secondary"
            className="flex items-center justify-center text-xs sm:text-base h-10 sm:h-9 px-2 sm:px-4"
          >
            <HandCoins className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline sm:hidden">Loan</span>
            <span className="hidden sm:inline">Add Loan</span>
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

      <LoanModal
        isOpen={isLoanModalOpen}
        onClose={() => setIsLoanModalOpen(false)}
      />
    </div>
  );
}
