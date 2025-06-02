import { useState } from 'react';
import { useExpenses } from '@/hooks/useExpenses';
import { ExpenseList } from '@/components/expenses/ExpenseList';
import { ExpenseModal } from '@/components/expenses/ExpenseModal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ExpensesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const { data: expenses } = useExpenses();

  const totalExpenses = expenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0;
  const expenseCount = expenses?.length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Expenses</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track your expenses
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ৳{totalExpenses.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Number of Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expenseCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ৳{expenseCount > 0 ? (totalExpenses / expenseCount).toFixed(2) : '0.00'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expense List with integrated filter */}
      <ExpenseList dateRange={dateRange} onDateRangeChange={setDateRange} />

      <ExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
