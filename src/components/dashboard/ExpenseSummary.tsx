
import { useMemo } from 'react';
import { useExpenses } from '@/hooks/useExpenses';
import { useIncome } from '@/hooks/useIncome';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';

export function ExpenseSummary() {
  const { data: expenses } = useExpenses();
  const { data: income } = useIncome();

  const summary = useMemo(() => {
    if (!expenses && !income) return { 
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

    return {
      totalExpensesThisMonth,
      totalExpensesLastMonth,
      totalIncomeThisMonth,
      totalIncomeLastMonth,
    };
  }, [expenses, income]);

  const expenseMonthlyChange = summary.totalExpensesLastMonth > 0 
    ? ((summary.totalExpensesThisMonth - summary.totalExpensesLastMonth) / summary.totalExpensesLastMonth) * 100 
    : 0;

  const incomeMonthlyChange = summary.totalIncomeLastMonth > 0 
    ? ((summary.totalIncomeThisMonth - summary.totalIncomeLastMonth) / summary.totalIncomeLastMonth) * 100 
    : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Expenses This Month</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(summary.totalExpensesThisMonth)}</div>
          <p className="text-xs text-muted-foreground">
            {expenseMonthlyChange >= 0 ? (
              <span className="flex items-center text-red-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{Math.abs(expenseMonthlyChange).toFixed(1)}% from last month
              </span>
            ) : (
              <span className="flex items-center text-green-600">
                <TrendingDown className="h-3 w-3 mr-1" />
                {Math.abs(expenseMonthlyChange).toFixed(1)}% from last month
              </span>
            )}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Income This Month</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(summary.totalIncomeThisMonth)}</div>
          <p className="text-xs text-muted-foreground">
            {incomeMonthlyChange >= 0 ? (
              <span className="flex items-center text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{Math.abs(incomeMonthlyChange).toFixed(1)}% from last month
              </span>
            ) : (
              <span className="flex items-center text-red-600">
                <TrendingDown className="h-3 w-3 mr-1" />
                {Math.abs(incomeMonthlyChange).toFixed(1)}% from last month
              </span>
            )}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Expenses Last Month</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(summary.totalExpensesLastMonth)}</div>
          <p className="text-xs text-muted-foreground">
            Previous month's expenses
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Income Last Month</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(summary.totalIncomeLastMonth)}</div>
          <p className="text-xs text-muted-foreground">
            Previous month's income
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
