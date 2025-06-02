import { useState, useMemo } from 'react';
import { useExpenses, useDeleteExpense, Expense } from '@/hooks/useExpenses';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { ConfirmationPopover } from '@/components/ui/confirmation-popover';
import { Edit, Trash2, Calendar, DollarSign, Filter } from 'lucide-react';
import { ExpenseModal } from './ExpenseModal';
import { DateRange } from 'react-day-picker';
import { isWithinInterval } from 'date-fns';

interface ExpenseListProps {
  dateRange?: DateRange;
  onDateRangeChange?: (dateRange: DateRange | undefined) => void;
}

export function ExpenseList({ dateRange, onDateRangeChange }: ExpenseListProps) {
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
    await deleteExpense.mutateAsync(id);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BDT',
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

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <CardTitle className="flex items-center">
              {dateRange?.from && dateRange?.to ? 'Filtered Expenses' : 'Recent Expenses'}
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({filteredExpenses?.length || 0} {(filteredExpenses?.length || 0) === 1 ? 'expense' : 'expenses'})
              </span>
            </CardTitle>
            {onDateRangeChange && (
              <div className="flex items-center gap-2">
                <DateRangePicker
                  date={dateRange}
                  onDateChange={onDateRangeChange}
                />
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!filteredExpenses || filteredExpenses.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <DollarSign className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>
                {dateRange?.from && dateRange?.to 
                  ? 'No expenses found in the selected date range.' 
                  : 'No expenses yet. Add your first expense above!'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg hover:bg-accent/50 transition-colors space-y-3 sm:space-y-0"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                      <span className="text-xl sm:text-2xl flex-shrink-0">
                        {expense.categories?.icon || '📦'}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-sm sm:text-base truncate">{expense.description}</h3>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground mt-1">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            <span className="whitespace-nowrap">{formatDate(expense.date)}</span>
                          </div>
                          {expense.categories && (
                            <Badge
                              variant="secondary"
                              className="text-xs"
                              style={{ backgroundColor: expense.categories.color + '20' }}
                            >
                              {expense.categories.name}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end space-x-3 sm:space-x-3">
                    <span className="text-base sm:text-lg font-semibold text-red-600">
                      {formatCurrency(expense.amount)}
                    </span>
                    <div className="flex space-x-1 sm:space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(expense)}
                        className="h-8 w-8 sm:h-9 sm:w-9 p-0"
                      >
                        <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      <ConfirmationPopover
                        title="Delete Expense"
                        description={`Are you sure you want to delete "${expense.description}"? This action cannot be undone.`}
                        onConfirm={() => handleDelete(expense.id)}
                        disabled={deleteExpense.isPending}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={deleteExpense.isPending}
                          className="h-8 w-8 sm:h-9 sm:w-9 p-0"
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </ConfirmationPopover>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
