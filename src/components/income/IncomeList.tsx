import { useState } from 'react';
import { useIncome, useDeleteIncome, Income } from '@/hooks/useIncome';
import { IncomeModal } from './IncomeModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { ConfirmationPopover } from '@/components/ui/confirmation-popover';
import { Edit, Trash2, Calendar, Tag, Filter, DollarSign } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { format, isWithinInterval, parseISO } from 'date-fns';

interface IncomeListProps {
  dateRange?: DateRange;
  onDateRangeChange?: (dateRange: DateRange | undefined) => void;
}

export function IncomeList({ dateRange, onDateRangeChange }: IncomeListProps) {
  const { data: income, isLoading } = useIncome();
  const deleteIncome = useDeleteIncome();
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredIncome = income?.filter((incomeItem) => {
    if (!dateRange?.from) return true;
    
    const incomeDate = parseISO(incomeItem.date);
    if (dateRange.to) {
      return isWithinInterval(incomeDate, { start: dateRange.from, end: dateRange.to });
    }
    return incomeDate >= dateRange.from;
  }) || [];

  const handleEdit = (incomeItem: Income) => {
    setEditingIncome(incomeItem);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteIncome.mutateAsync(id);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingIncome(null);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading income...</div>
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
              {dateRange?.from && dateRange?.to ? 'Filtered Income' : 'Income History'}
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({filteredIncome?.length || 0} {(filteredIncome?.length || 0) === 1 ? 'entry' : 'entries'})
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
          {filteredIncome.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <DollarSign className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>
                {dateRange?.from && dateRange?.to 
                  ? 'No income found in the selected date range.' 
                  : 'No income found. Add your first income to get started.'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredIncome.map((incomeItem) => (
                <div
                  key={incomeItem.id}
                  className="flex flex-col sm:flex-row sm:items-start justify-between p-3 sm:p-4 border rounded-lg hover:bg-accent/50 transition-colors space-y-3 sm:space-y-0"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-base sm:text-lg text-green-600">
                        +৳{incomeItem.amount.toLocaleString()}
                      </h3>
                      {incomeItem.categories && (
                        <Badge variant="outline" className="flex items-center gap-1 text-xs">
                          <span>{incomeItem.categories.icon}</span>
                          {incomeItem.categories.name}
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-muted-foreground mb-2 text-sm sm:text-base">{incomeItem.description}</p>
                    
                    <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="whitespace-nowrap">{format(parseISO(incomeItem.date), 'MMM dd, yyyy')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-1 sm:gap-2 sm:ml-4 self-end sm:self-start">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(incomeItem)}
                      className="h-8 w-8 sm:h-9 sm:w-9 p-0"
                    >
                      <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <ConfirmationPopover
                      title="Delete Income"
                      description={`Are you sure you want to delete "${incomeItem.description}"? This action cannot be undone.`}
                      onConfirm={() => handleDelete(incomeItem.id)}
                      disabled={deleteIncome.isPending}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={deleteIncome.isPending}
                        className="h-8 w-8 sm:h-9 sm:w-9 p-0"
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </ConfirmationPopover>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <IncomeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        income={editingIncome}
      />
    </>
  );
}
