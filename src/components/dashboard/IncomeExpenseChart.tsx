
import { useMemo } from 'react';
import { useExpenses } from '@/hooks/useExpenses';
import { useIncome } from '@/hooks/useIncome';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const chartConfig = {
  income: {
    label: "Income",
    color: "hsl(142, 76%, 36%)",
  },
  expenses: {
    label: "Expenses", 
    color: "hsl(346, 87%, 43%)",
  },
};

export function IncomeExpenseChart() {
  const { data: expenses } = useExpenses();
  const { data: income } = useIncome();

  const chartData = useMemo(() => {
    if (!expenses && !income) return [];

    // Get last 6 months of data
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toISOString().slice(0, 7); // YYYY-MM format
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      
      const monthExpenses = expenses
        ?.filter(expense => expense.date.startsWith(monthKey))
        .reduce((sum, expense) => sum + expense.amount, 0) || 0;
        
      const monthIncome = income
        ?.filter(incomeItem => incomeItem.date.startsWith(monthKey))
        .reduce((sum, incomeItem) => sum + incomeItem.amount, 0) || 0;

      months.push({
        month: monthName,
        income: monthIncome,
        expenses: monthExpenses,
      });
    }
    
    return months;
  }, [expenses, income]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income vs Expenses Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <AreaChart data={chartData}>
            <XAxis dataKey="month" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="income"
              stackId="1"
              stroke="var(--color-income)"
              fill="var(--color-income)"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stackId="2"
              stroke="var(--color-expenses)"
              fill="var(--color-expenses)"
              fillOpacity={0.6}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
