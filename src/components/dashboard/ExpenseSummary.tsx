import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExpenses } from '@/hooks/useExpenses';
import { useIncome } from '@/hooks/useIncome';
import { useSavings } from '@/hooks/useSavings';
import { useLoans } from '@/hooks/useLoans';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SkeletonSummaryCard } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown, DollarSign, PiggyBank, HandCoins } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { DateRange } from 'react-day-picker';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { isWithinInterval, parseISO } from 'date-fns';

interface ExpenseSummaryProps {
  dateRange?: DateRange;
  onDateRangeChange?: (dateRange: DateRange | undefined) => void;
}

export function ExpenseSummary({ dateRange, onDateRangeChange }: ExpenseSummaryProps) {
  const { data: expenses, isLoading: expensesLoading } = useExpenses();
  const { data: income, isLoading: incomeLoading } = useIncome();
  const { data: savings, isLoading: savingsLoading } = useSavings();
  const { data: loans, isLoading: loansLoading } = useLoans();
  const navigate = useNavigate();

  const isLoading = expensesLoading || incomeLoading || savingsLoading || loansLoading;

  const summary = useMemo(() => {
    if (!expenses && !income && !savings && !loans) return { 
      totalExpensesThisMonth: 0, 
      totalExpensesLastMonth: 0, 
      totalIncomeThisMonth: 0, 
      totalIncomeLastMonth: 0,
      totalSavings: 0,
      totalLoansGiven: 0,
      totalLoansTaken: 0
    };

    // Helper function to check if a date is within the selected range
    const isInDateRange = (dateStr: string) => {
      if (!dateRange?.from) return true; // If no date range, show all data
      const date = parseISO(dateStr);
      if (dateRange.to) {
        return isWithinInterval(date, { start: dateRange.from, end: dateRange.to });
      }
      return date >= dateRange.from;
    };

    // For last month calculations (used for comparison)
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    // Calculate base expenses
    const totalExpensesThisMonth = expenses
      ?.filter(expense => isInDateRange(expense.date))
      .reduce((sum, expense) => sum + expense.amount, 0) || 0;

    const totalExpensesLastMonth = expenses
      ?.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === lastMonth && expenseDate.getFullYear() === lastMonthYear;
      })
      .reduce((sum, expense) => sum + expense.amount, 0) || 0;

    // Calculate base income
    const totalIncomeThisMonth = income
      ?.filter(incomeItem => isInDateRange(incomeItem.date))
      .reduce((sum, incomeItem) => sum + incomeItem.amount, 0) || 0;

    const totalIncomeLastMonth = income
      ?.filter(incomeItem => {
        const incomeDate = new Date(incomeItem.date);
        return incomeDate.getMonth() === lastMonth && incomeDate.getFullYear() === lastMonthYear;
      })
      .reduce((sum, incomeItem) => sum + incomeItem.amount, 0) || 0;

    // Calculate loans impact
    const givenLoansThisMonth = loans
      ?.filter(loan => loan.loan_type === 'given' && isInDateRange(loan.date))
      .reduce((sum, loan) => sum + loan.amount, 0) || 0;

    const givenLoansLastMonth = loans
      ?.filter(loan => {
        const loanDate = new Date(loan.date);
        return loan.loan_type === 'given' && 
               loanDate.getMonth() === lastMonth && 
               loanDate.getFullYear() === lastMonthYear;
      })
      .reduce((sum, loan) => sum + loan.amount, 0) || 0;

    const takenLoansThisMonth = loans
      ?.filter(loan => loan.loan_type === 'taken' && isInDateRange(loan.date))
      .reduce((sum, loan) => sum + loan.amount, 0) || 0;

    const takenLoansLastMonth = loans
      ?.filter(loan => {
        const loanDate = new Date(loan.date);
        return loan.loan_type === 'taken' && 
               loanDate.getMonth() === lastMonth && 
               loanDate.getFullYear() === lastMonthYear;
      })
      .reduce((sum, loan) => sum + loan.amount, 0) || 0;

    // Calculate total loans given and taken (all time)
    const totalLoansGiven = loans
      ?.filter(loan => loan.loan_type === 'given')
      .reduce((sum, loan) => sum + loan.amount, 0) || 0;

    const totalLoansTaken = loans
      ?.filter(loan => loan.loan_type === 'taken')
      .reduce((sum, loan) => sum + loan.amount, 0) || 0;

    // Calculate savings (filtered by date range)
    const savingsThisMonth = savings
      ?.filter(saving => isInDateRange(saving.date))
      .reduce((sum, saving) => sum + saving.amount, 0) || 0;

    // Calculate total savings (all time for display)
    const totalSavings = savings
      ?.reduce((sum, saving) => sum + saving.amount, 0) || 0;

    return {
      totalExpensesThisMonth: totalExpensesThisMonth + givenLoansThisMonth,
      totalExpensesLastMonth: totalExpensesLastMonth + givenLoansLastMonth,
      totalIncomeThisMonth: totalIncomeThisMonth + takenLoansThisMonth,
      totalIncomeLastMonth: totalIncomeLastMonth + takenLoansLastMonth,
      savingsThisMonth,
      totalSavings,
      totalLoansGiven,
      totalLoansTaken
    };
  }, [expenses, income, savings, loans, dateRange]);

  // Correct formula: Remaining = Income + LoansTaken - Expenses - LoansGiven - Savings
  const remainingAmount = summary.totalIncomeThisMonth - summary.totalExpensesThisMonth - summary.savingsThisMonth;
  const periodLabel = dateRange?.from ? 'Selected Period' : 'All Time';
  const periodDescription = dateRange?.from ? 'in selected period' : 'all time';

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
        <SkeletonSummaryCard />
        <SkeletonSummaryCard />
        <SkeletonSummaryCard />
        <SkeletonSummaryCard />
        <SkeletonSummaryCard />
      </div>
    );
  }

  return (
    <>
      {/* Date Range Filter */}
      {onDateRangeChange && (
        <div className="flex justify-end mb-4">
          <DateRangePicker
            date={dateRange}
            onDateChange={onDateRangeChange}
          />
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6 animate-in fade-in duration-500">
        {/* Card 1: Income */}
      <Card 
        className="border-none cursor-pointer hover:opacity-90 transition-opacity shadow-lg"
        style={{ backgroundColor: '#84cc85', opacity: 1 }}
        onClick={() => navigate('/income')}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-800/80">Income</CardTitle>
          <TrendingUp className="h-4 w-4 text-gray-800/80" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{formatCurrency(summary.totalIncomeThisMonth)}</div>
          <p className="text-xs text-gray-800/70">
            Total income {periodDescription}
          </p>
        </CardContent>
      </Card>

        {/* Card 2: Expenses */}
      <Card 
        className="border-none cursor-pointer hover:opacity-90 transition-opacity shadow-lg"
        style={{ backgroundColor: '#ef4444', opacity: 1 }}
        onClick={() => navigate('/expenses')}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white/80">Expenses</CardTitle>
          <TrendingDown className="h-4 w-4 text-white/80" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{formatCurrency(summary.totalExpensesThisMonth)}</div>
          <p className="text-xs text-white/70">
            Total expenses {periodDescription}
          </p>
        </CardContent>
      </Card>

      {/* Card 3: Remaining Amount */}
      <Card 
        className="border-none shadow-lg"
        style={{ backgroundColor: remainingAmount >= 0 ? '#10b981' : '#f97316', opacity: 1 }}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white/80">Remaining Amount</CardTitle>
          <DollarSign className="h-4 w-4 text-white/80" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {formatCurrency(remainingAmount)}
          </div>
          <p className="text-xs text-white/70">
            {remainingAmount >= 0 ? 'Available balance' : 'Over budget'}
          </p>
        </CardContent>
      </Card>

      {/* Card 4: Savings */}
      <Card 
        className="border-none cursor-pointer hover:opacity-90 transition-opacity shadow-lg"
        style={{ backgroundColor: '#3b82f6', opacity: 1 }}
        onClick={() => navigate('/savings')}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white/80">Savings</CardTitle>
          <PiggyBank className="h-4 w-4 text-white/80" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{formatCurrency(summary.savingsThisMonth)}</div>
          <p className="text-xs text-white/70">
            Saved {periodDescription}
          </p>
        </CardContent>
      </Card>

      {/* Card 5: Loans Given & Taken */}
      <Card 
        className="border-none cursor-pointer hover:opacity-90 transition-opacity shadow-lg"
        style={{ backgroundColor: '#a855f7', opacity: 1 }}
        onClick={() => navigate('/loans')}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white/80">Loans</CardTitle>
          <HandCoins className="h-4 w-4 text-white/80" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div 
              className="flex items-center justify-between cursor-pointer hover:bg-white/10 p-1 rounded transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                navigate('/loans');
              }}
            >
              <span className="text-xs text-white/70 flex items-center">
                <TrendingDown className="h-3 w-3 text-white/70 mr-1" />
                Given
              </span>
              <span className="text-sm font-medium text-white">{formatCurrency(summary.totalLoansGiven)}</span>
            </div>
            <div 
              className="flex items-center justify-between cursor-pointer hover:bg-white/10 p-1 rounded transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                navigate('/loans');
              }}
            >
              <span className="text-xs text-white/70 flex items-center">
                <TrendingUp className="h-3 w-3 text-white/70 mr-1" />
                Taken
              </span>
              <span className="text-sm font-medium text-white">{formatCurrency(summary.totalLoansTaken)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    </>
  );
}
