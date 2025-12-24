import { useState } from 'react';
import { useSavings, useDeleteSaving, Saving } from '@/hooks/useSavings';
import { SavingsModal } from './SavingsModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { ConfirmationPopover } from '@/components/ui/confirmation-popover';
import { Edit, Trash2, Calendar, Target, PiggyBank } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { format, isWithinInterval, parseISO } from 'date-fns';

interface SavingsListProps {
  dateRange?: DateRange;
  onDateRangeChange?: (dateRange: DateRange | undefined) => void;
}

export function SavingsList({ dateRange, onDateRangeChange }: SavingsListProps) {
  const { data: savings, isLoading } = useSavings();
  const deleteSaving = useDeleteSaving();
  const [editingSaving, setEditingSaving] = useState<Saving | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredSavings = savings?.filter((saving) => {
    if (!dateRange?.from) return true;
    
    const savingDate = parseISO(saving.date);
    if (dateRange.to) {
      return isWithinInterval(savingDate, { start: dateRange.from, end: dateRange.to });
    }
    return savingDate >= dateRange.from;
  }) || [];

  const handleEdit = (saving: Saving) => {
    setEditingSaving(saving);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteSaving.mutateAsync(id);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSaving(null);
  };

  const calculateProgress = (current: number, goal: number | null) => {
    if (!goal || goal === 0) return 0;
    return Math.min((current / goal) * 100, 100);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading savings...</div>
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
              {dateRange?.from && dateRange?.to ? 'Filtered Savings' : 'Savings History'}
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({filteredSavings?.length || 0} {(filteredSavings?.length || 0) === 1 ? 'entry' : 'entries'})
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
          {filteredSavings.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <PiggyBank className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>
                {dateRange?.from && dateRange?.to 
                  ? 'No savings found in the selected date range.' 
                  : 'No savings found. Add your first saving to get started.'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSavings.map((saving) => (
                <div
                  key={saving.id}
                  className="flex flex-col sm:flex-row sm:items-start justify-between p-3 sm:p-4 border rounded-lg hover:bg-accent/50 transition-colors space-y-3 sm:space-y-0"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-base sm:text-lg text-blue-600">
                        +৳{saving.amount.toLocaleString()}
                      </h3>
                      {saving.goal_name && (
                        <Badge variant="outline" className="flex items-center gap-1 text-xs">
                          <Target className="h-3 w-3" />
                          {saving.goal_name}
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-muted-foreground mb-2 text-sm sm:text-base">{saving.description}</p>
                    
                    {saving.goal_amount && (
                      <div className="mb-2">
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                          <span>Progress towards goal</span>
                          <span>
                            ৳{saving.amount.toLocaleString()} / ৳{saving.goal_amount.toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${calculateProgress(saving.amount, saving.goal_amount)}%` }}
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="whitespace-nowrap">{format(parseISO(saving.date), 'MMM dd, yyyy')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-1 sm:gap-2 sm:ml-4 self-end sm:self-start">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(saving)}
                      className="h-8 w-8 sm:h-9 sm:w-9 p-0"
                    >
                      <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <ConfirmationPopover
                      title="Delete Saving"
                      description={`Are you sure you want to delete "${saving.description}"? This action cannot be undone.`}
                      onConfirm={() => handleDelete(saving.id)}
                      disabled={deleteSaving.isPending}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={deleteSaving.isPending}
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

      <SavingsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        saving={editingSaving}
      />
    </>
  );
}

