import { useMemo } from 'react';
import { useExpenses } from '@/hooks/useExpenses';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { formatCurrencyWithCommas } from '@/lib/utils';
import { DateRange } from 'react-day-picker';
import { isWithinInterval, parseISO } from 'date-fns';

const COLORS = [
  '#ef4444', // red
  '#f59e0b', // amber
  '#10b981', // emerald
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#14b8a6', // teal
  '#f97316', // orange
  '#06b6d4', // cyan
  '#a855f7', // purple
];

interface CategoryExpenseChartProps {
  dateRange?: DateRange;
}

export function CategoryExpenseChart({ dateRange }: CategoryExpenseChartProps) {
  const { data: expenses, isLoading } = useExpenses();

  const categoryData = useMemo(() => {
    if (!expenses || expenses.length === 0) return [];

    // Filter expenses by date range
    const filteredExpenses = expenses.filter(expense => {
      if (!dateRange?.from) return true;
      const expenseDate = parseISO(expense.date);
      if (dateRange.to) {
        return isWithinInterval(expenseDate, { start: dateRange.from, end: dateRange.to });
      }
      return expenseDate >= dateRange.from;
    });

    // Group expenses by category
    const categoryMap = new Map<string, number>();
    
    filteredExpenses.forEach(expense => {
      const categoryName = expense.categories?.name || 'Uncategorized';
      const currentAmount = categoryMap.get(categoryName) || 0;
      categoryMap.set(categoryName, currentAmount + expense.amount);
    });

    // Convert to array and sort by amount (descending)
    return Array.from(categoryMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8); // Show top 8 categories
  }, [expenses, dateRange]);

  const totalExpenses = useMemo(() => {
    return categoryData.reduce((sum, item) => sum + item.value, 0);
  }, [categoryData]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const percentage = ((payload[0].value / totalExpenses) * 100).toFixed(1);
      return (
        <div className="bg-gray-900 border border-white/20 rounded-lg p-3 shadow-lg">
          <p className="text-white font-semibold text-sm">{payload[0].name}</p>
          <p className="text-brand text-sm mt-1">{formatCurrencyWithCommas(payload[0].value)}</p>
          <p className="text-gray-400 text-xs mt-1">{percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap gap-2 justify-center mt-4">
        {payload.map((entry: any, index: number) => {
          const percentage = ((entry.payload.value / totalExpenses) * 100).toFixed(0);
          return (
            <div key={`legend-${index}`} className="flex items-center gap-1.5 text-xs">
              <div 
                className="w-3 h-3 rounded-sm flex-shrink-0" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-300 truncate max-w-[120px]">
                {entry.value} ({percentage}%)
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card className="shadow-sm bg-white/5 border-white/10 backdrop-blur">
        <CardHeader className="border-b border-white/10 px-2 sm:px-6 py-2 sm:py-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
            <CardTitle className="text-sm sm:text-lg font-semibold text-white">
              Expenses by Category
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:px-6 py-2 sm:py-6">
          <div className="flex items-center justify-center h-[250px] sm:h-[350px] lg:h-[400px]">
            <div className="text-gray-400">Loading...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (categoryData.length === 0) {
    return (
      <Card className="shadow-sm bg-white/5 border-white/10 backdrop-blur">
        <CardHeader className="border-b border-white/10 px-2 sm:px-6 py-2 sm:py-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
            <CardTitle className="text-sm sm:text-lg font-semibold text-white">
              Expenses by Category
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:px-6 py-2 sm:py-6">
          <div className="flex flex-col items-center justify-center h-[250px] sm:h-[350px] lg:h-[400px] text-gray-400">
            <svg
              className="w-16 h-16 mb-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2" />
            </svg>
            <p className="text-sm">No expense data yet</p>
            <p className="text-xs mt-1">Add expenses to see the breakdown</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm bg-white/5 border-white/10 backdrop-blur animate-in fade-in duration-500 pb-1">
      <CardHeader className="border-b border-white/10 px-2 sm:px-6 py-2 sm:py-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
          <CardTitle className="text-sm sm:text-lg font-semibold text-white">
            Expenses by Category
          </CardTitle>
          <p className="text-xs sm:text-sm text-gray-400 whitespace-nowrap">
            Total: {formatCurrencyWithCommas(totalExpenses)}
          </p>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:px-6 py-2 sm:py-6">
        <div className="h-[250px] sm:h-[350px] lg:h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    strokeWidth={2}
                    stroke="rgba(0,0,0,0.3)"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

