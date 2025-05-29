
import { useMemo } from 'react';
import { useExpenses } from '@/hooks/useExpenses';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';

export function ExpenseSummary() {
  const { data: expenses } = useExpenses();

  const summary = useMemo(() => {
    if (!expenses) return { totalThisMonth: 0, totalLastMonth: 0, totalExpenses: expenses?.length || 0 };

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const totalThisMonth = expenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
      })
      .reduce((sum, expense) => sum + expense.amount, 0);

    const totalLastMonth = expenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === lastMonth && expenseDate.getFullYear() === lastMonthYear;
      })
      .reduce((sum, expense) => sum + expense.amount, 0);

    return {
      totalThisMonth,
      totalLastMonth,
      totalExpenses: expenses.length,
    };
  }, [expenses]);

  const monthlyChange = summary.totalLastMonth > 0 
    ? ((summary.totalThisMonth - summary.totalLastMonth) / summary.totalLastMonth) * 100 
    : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">This Month</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(summary.totalThisMonth)}</div>
          <p className="text-xs text-muted-foreground">
            {monthlyChange >= 0 ? (
              <span className="flex items-center text-red-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{Math.abs(monthlyChange).toFixed(1)}% from last month
              </span>
            ) : (
              <span className="flex items-center text-green-600">
                <TrendingDown className="h-3 w-3 mr-1" />
                {Math.abs(monthlyChange).toFixed(1)}% from last month
              </span>
            )}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Last Month</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(summary.totalLastMonth)}</div>
          <p className="text-xs text-muted-foreground">
            Previous month's total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.totalExpenses}</div>
          <p className="text-xs text-muted-foreground">
            All time expense count
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
