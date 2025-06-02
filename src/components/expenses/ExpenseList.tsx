
import { useState, useMemo } from 'react';
import { useExpenses, useDeleteExpense, Expense } from '@/hooks/useExpenses';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Calendar, DollarSign } from 'lucide-react';
import { ExpenseModal } from './ExpenseModal';
import { DateRange } from 'react-day-picker';
import { isWithinInterval } from 'date-fns';

interface ExpenseListProps {
  dateRange?: DateRange;
}

export function ExpenseList({ dateRange }: ExpenseListProps) {
  const { data: expenses, isLoading } = useExpenses();
  const deleteExpense = useDeleteExpense();
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const filteredExpenses = useMemo(() => {
    if (!expenses) return [];
    
    if (!dateRange?.from || !dateRange?.to) return expenses;
    
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return isWithinInterval(expenseDate, { start: dateRange.from!, end: dateRange.to! });
    });
  }, [expenses, dateRange]);

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingExpense(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      await deleteExpense.mutateAsync(id);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading expenses...</div>
        </CardContent>
      </Card>
    );
  }

  if (!filteredExpenses || filteredExpenses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            {dateRange?.from && dateRange?.to ? 'Filtered Expenses' : 'Recent Expenses'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>
              {dateRange?.from && dateRange?.to 
                ? 'No expenses found in the selected date range.' 
                : 'No expenses yet. Add your first expense above!'
              }
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            {dateRange?.from && dateRange?.to ? 'Filtered Expenses' : 'Recent Expenses'}
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({filteredExpenses.length} {filteredExpenses.length === 1 ? 'expense' : 'expenses'})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredExpenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">
                      {expense.categories?.icon || '📦'}
                    </span>
                    <div>
                      <h3 className="font-medium">{expense.description}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(expense.date)}
                        </div>
                        {expense.categories && (
                          <Badge
                            variant="secondary"
                            style={{ backgroundColor: expense.categories.color + '20' }}
                          >
                            {expense.categories.name}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-semibold">
                    {formatCurrency(expense.amount)}
                  </span>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(expense)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(expense.id)}
                      disabled={deleteExpense.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <ExpenseModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        expense={editingExpense}
      />
    </>
  );
}
