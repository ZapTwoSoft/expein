import { useState } from 'react';
import { ExpenseSummary } from './ExpenseSummary';
import { IncomeExpenseChart } from './IncomeExpenseChart';
import { TransactionList } from './TransactionList';
import { Button } from '@/components/ui/button';
import { TrendingDown, TrendingUp, HandCoins, PiggyBank } from 'lucide-react';
import { ExpenseModal } from '@/components/expenses/ExpenseModal';
import { IncomeModal } from '@/components/income/IncomeModal';
import { LoanModal } from '@/components/loans/LoanModal';
import { SavingsModal } from '@/components/savings/SavingsModal';
import { DateRange } from 'react-day-picker';

export function Dashboard() {
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isSavingsModalOpen, setIsSavingsModalOpen] = useState(false);
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
            Dashboard
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Track and manage your expenses and income efficiently
          </p>
        </div>
        
        {/* Quick Action Buttons - Stack vertically on mobile for better touch targets */}
        <div className="grid grid-cols-2 gap-3 sm:flex sm:gap-3">
          <Button 
            onClick={() => setIsExpenseModalOpen(true)}
            variant="outline"
            className="flex items-center justify-center text-sm sm:text-base h-12 sm:h-10 px-4 sm:px-4 font-medium bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20 hover:text-red-300"
          >
            <TrendingDown className="h-5 w-5 sm:h-4 sm:w-4 mr-2" />
            <span>Expense</span>
          </Button>
          
          <Button 
            onClick={() => setIsIncomeModalOpen(true)}
            className="flex items-center justify-center text-sm sm:text-base h-12 sm:h-10 px-4 sm:px-4 font-medium bg-brand text-black hover:bg-brand-400"
          >
            <TrendingUp className="h-5 w-5 sm:h-4 sm:w-4 mr-2" />
            <span>Income</span>
          </Button>

          <Button 
            onClick={() => setIsSavingsModalOpen(true)}
            variant="outline"
            className="flex items-center justify-center text-sm sm:text-base h-12 sm:h-10 px-4 sm:px-4 font-medium bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300"
          >
            <PiggyBank className="h-5 w-5 sm:h-4 sm:w-4 mr-2" />
            <span>Saving</span>
          </Button>

          <Button 
            onClick={() => setIsLoanModalOpen(true)}
            variant="outline"
            className="flex items-center justify-center text-sm sm:text-base h-12 sm:h-10 px-4 sm:px-4 font-medium bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20 hover:text-amber-300"
          >
            <HandCoins className="h-5 w-5 sm:h-4 sm:w-4 mr-2" />
            <span>Loan</span>
          </Button>
        </div>
      </div>

      <ExpenseSummary dateRange={dateRange} onDateRangeChange={setDateRange} />

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

      <SavingsModal
        isOpen={isSavingsModalOpen}
        onClose={() => setIsSavingsModalOpen(false)}
      />

      <LoanModal
        isOpen={isLoanModalOpen}
        onClose={() => setIsLoanModalOpen(false)}
      />
    </div>
  );
}
