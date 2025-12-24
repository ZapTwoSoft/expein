import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExpenses } from '@/hooks/useExpenses';
import { useIncome } from '@/hooks/useIncome';
import { useLoans } from '@/hooks/useLoans';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SkeletonSummaryCard } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown, DollarSign, Calendar, HandCoins } from 'lucide-react';

export function ExpenseSummary() {
  const { data: expenses, isLoading: expensesLoading } = useExpenses();
  const { data: income, isLoading: incomeLoading } = useIncome();
  const { data: loans, isLoading: loansLoading } = useLoans();
  const navigate = useNavigate();

  const isLoading = expensesLoading || incomeLoading || loansLoading;

  const summary = useMemo(() => {
    if (!expenses && !income && !loans) return { 
      totalExpensesThisMonth: 0, 
      totalExpensesLastMonth: 0, 
      totalIncomeThisMonth: 0, 
      totalIncomeLastMonth: 0,
      totalLoansGiven: 0,
      totalLoansTaken: 0
    };

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    // Calculate base expenses
    const totalExpensesThisMonth = expenses
      ?.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
      })
      .reduce((sum, expense) => sum + expense.amount, 0) || 0;

    const totalExpensesLastMonth = expenses
      ?.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === lastMonth && expenseDate.getFullYear() === lastMonthYear;
      })
      .reduce((sum, expense) => sum + expense.amount, 0) || 0;

    // Calculate base income
    const totalIncomeThisMonth = income
      ?.filter(incomeItem => {
        const incomeDate = new Date(incomeItem.date);
        return incomeDate.getMonth() === currentMonth && incomeDate.getFullYear() === currentYear;
      })
      .reduce((sum, incomeItem) => sum + incomeItem.amount, 0) || 0;

    const totalIncomeLastMonth = income
      ?.filter(incomeItem => {
        const incomeDate = new Date(incomeItem.date);
        return incomeDate.getMonth() === lastMonth && incomeDate.getFullYear() === lastMonthYear;
      })
      .reduce((sum, incomeItem) => sum + incomeItem.amount, 0) || 0;

    // Calculate loans impact
    const givenLoansThisMonth = loans
      ?.filter(loan => {
        const loanDate = new Date(loan.date);
        return loan.loan_type === 'given' && 
               loanDate.getMonth() === currentMonth && 
               loanDate.getFullYear() === currentYear;
      })
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
      ?.filter(loan => {
        const loanDate = new Date(loan.date);
        return loan.loan_type === 'taken' && 
               loanDate.getMonth() === currentMonth && 
               loanDate.getFullYear() === currentYear;
      })
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

    return {
      totalExpensesThisMonth: totalExpensesThisMonth + givenLoansThisMonth,
      totalExpensesLastMonth: totalExpensesLastMonth + givenLoansLastMonth,
      totalIncomeThisMonth: totalIncomeThisMonth + takenLoansThisMonth,
      totalIncomeLastMonth: totalIncomeLastMonth + takenLoansLastMonth,
      totalLoansGiven,
      totalLoansTaken
    };
  }, [expenses, income, loans]);

  const remainingAmount = summary.totalIncomeThisMonth - summary.totalExpensesThisMonth;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BDT',
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <SkeletonSummaryCard />
        <SkeletonSummaryCard />
        <SkeletonSummaryCard />
        <SkeletonSummaryCard />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 animate-in fade-in duration-500">
      {/* Card 1: Expense This Month */}
      <Card 
        className="bg-red-500/10 border-red-500/20 cursor-pointer hover:bg-red-500/20 transition-colors backdrop-blur"
        onClick={() => navigate('/expenses')}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">Expense This Month</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-400">{formatCurrency(summary.totalExpensesThisMonth)}</div>
          <p className="text-xs text-gray-500">
            Total expenses this month
          </p>
        </CardContent>
      </Card>

      {/* Card 2: Income This Month */}
      <Card 
        className="bg-brand/10 border-brand/20 cursor-pointer hover:bg-brand/20 transition-colors backdrop-blur"
        onClick={() => navigate('/income')}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">Income This Month</CardTitle>
          <TrendingUp className="h-4 w-4 text-brand" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-brand">{formatCurrency(summary.totalIncomeThisMonth)}</div>
          <p className="text-xs text-gray-500">
            Total income this month
          </p>
        </CardContent>
      </Card>

      {/* Card 3: Remaining Amount */}
      <Card className={`${remainingAmount >= 0 ? 'bg-blue-500/10 border-blue-500/20' : 'bg-orange-500/10 border-orange-500/20'} backdrop-blur`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">Remaining Amount</CardTitle>
          <DollarSign className={`h-4 w-4 ${remainingAmount >= 0 ? 'text-blue-400' : 'text-orange-400'}`} />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${remainingAmount >= 0 ? 'text-blue-400' : 'text-orange-400'}`}>
            {formatCurrency(Math.abs(remainingAmount))}
          </div>
          <p className="text-xs text-gray-500">
            {remainingAmount >= 0 ? 'Available balance' : 'Over budget'}
          </p>
        </CardContent>
      </Card>

      {/* Card 4: Loans Given & Taken */}
      <Card 
        className="bg-purple-500/10 border-purple-500/20 cursor-pointer hover:bg-purple-500/20 transition-colors backdrop-blur"
        onClick={() => navigate('/loans')}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">Loans</CardTitle>
          <HandCoins className="h-4 w-4 text-purple-400" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div 
              className="flex items-center justify-between cursor-pointer hover:bg-orange-500/10 p-1 rounded transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                navigate('/loans');
              }}
            >
              <span className="text-xs text-gray-500 flex items-center">
                <TrendingDown className="h-3 w-3 text-orange-400 mr-1" />
                Given
              </span>
              <span className="text-sm font-medium text-orange-400">{formatCurrency(summary.totalLoansGiven)}</span>
            </div>
            <div 
              className="flex items-center justify-between cursor-pointer hover:bg-blue-500/10 p-1 rounded transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                navigate('/loans');
              }}
            >
              <span className="text-xs text-gray-500 flex items-center">
                <TrendingUp className="h-3 w-3 text-blue-400 mr-1" />
                Taken
              </span>
              <span className="text-sm font-medium text-blue-400">{formatCurrency(summary.totalLoansTaken)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
