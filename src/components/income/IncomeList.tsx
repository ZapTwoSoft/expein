
import { useState } from 'react';
import { useIncome, useDeleteIncome, Income } from '@/hooks/useIncome';
import { IncomeModal } from './IncomeModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Calendar, Tag } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { format, isWithinInterval, parseISO } from 'date-fns';

interface IncomeListProps {
  dateRange?: DateRange;
}

export function IncomeList({ dateRange }: IncomeListProps) {
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
    if (confirm('Are you sure you want to delete this income?')) {
      await deleteIncome.mutateAsync(id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingIncome(null);
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading income...</div>;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Income History</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredIncome.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No income found. Add your first income to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredIncome.map((incomeItem) => (
                <div
                  key={incomeItem.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg text-green-600">
                          +${incomeItem.amount.toLocaleString()}
                        </h3>
                        {incomeItem.categories && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <span>{incomeItem.categories.icon}</span>
                            {incomeItem.categories.name}
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-2">{incomeItem.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{format(parseISO(incomeItem.date), 'MMM dd, yyyy')}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(incomeItem)}
                        className="hover:bg-blue-50"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(incomeItem.id)}
                        className="hover:bg-red-50 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
