
import { useMemo, useState } from 'react';
import { useExpenses } from '@/hooks/useExpenses';
import { useIncome } from '@/hooks/useIncome';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { DateRange } from 'react-day-picker';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { startOfMonth, endOfMonth, isWithinInterval, format } from 'date-fns';

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
  
  // Initialize with current month
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });

  const chartData = useMemo(() => {
    if (!expenses && !income) return [];

    // Filter data based on date range
    const filteredExpenses = expenses?.filter(expense => {
      const expenseDate = new Date(expense.date);
      if (!dateRange?.from || !dateRange?.to) return true;
      return isWithinInterval(expenseDate, { start: dateRange.from, end: dateRange.to });
    }) || [];

    const filteredIncome = income?.filter(incomeItem => {
      const incomeDate = new Date(incomeItem.date);
      if (!dateRange?.from || !dateRange?.to) return true;
      return isWithinInterval(incomeDate, { start: dateRange.from, end: dateRange.to });
    }) || [];

    // Group by day for the selected range
    const dataMap = new Map();
    
    // Process expenses
    filteredExpenses.forEach(expense => {
      const dateKey = expense.date;
      if (!dataMap.has(dateKey)) {
        dataMap.set(dateKey, { date: dateKey, income: 0, expenses: 0 });
      }
      dataMap.get(dateKey).expenses += expense.amount;
    });

    // Process income
    filteredIncome.forEach(incomeItem => {
      const dateKey = incomeItem.date;
      if (!dataMap.has(dateKey)) {
        dataMap.set(dateKey, { date: dateKey, income: 0, expenses: 0 });
      }
      dataMap.get(dateKey).income += incomeItem.amount;
    });

    // Convert to array and sort by date
    const chartData = Array.from(dataMap.values()).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Format dates for display
    return chartData.map(item => ({
      ...item,
      displayDate: format(new Date(item.date), 'MMM dd'),
    }));
  }, [expenses, income, dateRange]);

  return (
    <Card className="bg-white shadow-sm ring-1 ring-gray-900/5">
      <CardHeader className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Income vs Expenses Trend
          </CardTitle>
          <DateRangePicker
            date={dateRange}
            onDateChange={setDateRange}
            className="w-auto"
          />
        </div>
      </CardHeader>
      <CardContent className="px-6 py-6">
        <ChartContainer config={chartConfig} className="h-[400px]">
          <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(346, 87%, 43%)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(346, 87%, 43%)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="displayDate" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
              tickFormatter={(value) => `৳${value.toLocaleString()}`}
            />
            <ChartTooltip 
              content={<ChartTooltipContent />}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Area
              type="monotone"
              dataKey="income"
              stroke="hsl(142, 76%, 36%)"
              strokeWidth={2}
              fill="url(#incomeGradient)"
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="hsl(346, 87%, 43%)"
              strokeWidth={2}
              fill="url(#expensesGradient)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
