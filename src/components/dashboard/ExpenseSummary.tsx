import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExpenses } from '@/hooks/useExpenses';
import { useIncome } from '@/hooks/useIncome';
import { useLoans } from '@/hooks/useLoans';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SkeletonSummaryCard } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';

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
      totalIncomeLastMonth: 0 
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

    return {
      totalExpensesThisMonth: totalExpensesThisMonth + givenLoansThisMonth,
      totalExpensesLastMonth: totalExpensesLastMonth + givenLoansLastMonth,
      totalIncomeThisMonth: totalIncomeThisMonth + takenLoansThisMonth,
      totalIncomeLastMonth: totalIncomeLastMonth + takenLoansLastMonth,
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
        className="bg-red-50 border-red-200 cursor-pointer hover:bg-red-100 transition-colors"
        onClick={() => navigate('/expenses')}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Expense This Month</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{formatCurrency(summary.totalExpensesThisMonth)}</div>
          <p className="text-xs text-muted-foreground">
            Total expenses this month
          </p>
        </CardContent>
      </Card>

      {/* Card 2: Income This Month */}
      <Card 
        className="bg-green-50 border-green-200 cursor-pointer hover:bg-green-100 transition-colors"
        onClick={() => navigate('/income')}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Income This Month</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{formatCurrency(summary.totalIncomeThisMonth)}</div>
          <p className="text-xs text-muted-foreground">
            Total income this month
          </p>
        </CardContent>
      </Card>

      {/* Card 3: Remaining Amount */}
      <Card className={`${remainingAmount >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Remaining Amount</CardTitle>
          <DollarSign className={`h-4 w-4 ${remainingAmount >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${remainingAmount >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
            {formatCurrency(Math.abs(remainingAmount))}
          </div>
          <p className="text-xs text-muted-foreground">
            {remainingAmount >= 0 ? 'Available balance' : 'Over budget'}
          </p>
        </CardContent>
      </Card>

      {/* Card 4: Last Month Income & Expense */}
      <Card className="bg-gray-50 border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Last Month</CardTitle>
          <Calendar className="h-4 w-4 text-gray-600" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div 
              className="flex items-center justify-between cursor-pointer hover:bg-green-50 p-1 rounded transition-colors"
              onClick={() => navigate('/income')}
            >
              <span className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                Income
              </span>
              <span className="text-sm font-medium text-green-600">{formatCurrency(summary.totalIncomeLastMonth)}</span>
            </div>
            <div 
              className="flex items-center justify-between cursor-pointer hover:bg-red-50 p-1 rounded transition-colors"
              onClick={() => navigate('/expenses')}
            >
              <span className="text-xs text-muted-foreground flex items-center">
                <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                Expense
              </span>
              <span className="text-sm font-medium text-red-600">{formatCurrency(summary.totalExpensesLastMonth)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
