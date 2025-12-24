import { useMemo, useState } from 'react';
import { useExpenses } from '@/hooks/useExpenses';
import { useIncome } from '@/hooks/useIncome';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SkeletonChart } from '@/components/ui/skeleton';
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
  const { data: expenses, isLoading: expensesLoading } = useExpenses();
  const { data: income, isLoading: incomeLoading } = useIncome();
  const isLoading = expensesLoading || incomeLoading;
  
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

  if (isLoading) {
    return <SkeletonChart />;
  }

  return (
    <Card className="shadow-sm bg-white/5 border-white/10 backdrop-blur w-full animate-in fade-in duration-500">
      <CardHeader className="border-b border-white/10 px-2 sm:px-6 py-2 sm:py-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
          <CardTitle className="text-sm sm:text-lg font-semibold text-white">
            Income vs Expenses Trend
          </CardTitle>
          {/* <DateRangePicker
            date={dateRange}
            onDateChange={setDateRange}
            className="w-full sm:w-auto"
          /> */}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:px-6 py-2 sm:py-6">
        <div className="w-full min-w-0">
          <ChartContainer config={chartConfig} className="h-[250px] sm:h-[350px] lg:h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart 
                data={chartData} 
                margin={{ 
                  top: 10, 
                  right: 5, 
                  left: 0, 
                  bottom: 5 
                }}
              >
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
                  tick={{ fontSize: 8, fill: '#9CA3AF' }}
                  interval="preserveStartEnd"
                  height={20}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 8, fill: '#9CA3AF' }}
                  tickFormatter={(value) => `৳${value > 1000 ? (value/1000).toFixed(0) + 'k' : value.toLocaleString()}`}
                  width={25}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
                    fontSize: '10px',
                    color: 'white',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="income"
                  stroke="hsl(142, 76%, 36%)"
                  strokeWidth={1.5}
                  fill="url(#incomeGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke="hsl(346, 87%, 43%)"
                  strokeWidth={1.5}
                  fill="url(#expensesGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
