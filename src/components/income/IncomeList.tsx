
import { useState } from 'react';
import { useIncome, useDeleteIncome } from '@/hooks/useIncome';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Calendar, TrendingUp } from 'lucide-react';
import { IncomeEditDialog } from './IncomeEditDialog';
import type { Income } from '@/hooks/useIncome';

export function IncomeList() {
  const { data: income, isLoading } = useIncome();
  const deleteIncome = useDeleteIncome();
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this income?')) {
      await deleteIncome.mutateAsync(id);
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
          <div className="text-center">Loading income...</div>
        </CardContent>
      </Card>
    );
  }

  if (!income || income.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-green-600">Recent Income</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No income yet. Add your first income above!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-green-600">Recent Income</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {income.map((incomeItem) => (
              <div
                key={incomeItem.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-green-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">
                      {incomeItem.categories?.icon || '💰'}
                    </span>
                    <div>
                      <h3 className="font-medium">{incomeItem.description}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(incomeItem.date)}
                        </div>
                        {incomeItem.categories && (
                          <Badge
                            variant="secondary"
                            style={{ backgroundColor: incomeItem.categories.color + '20' }}
                          >
                            {incomeItem.categories.name}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-semibold text-green-600">
                    +{formatCurrency(incomeItem.amount)}
                  </span>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingIncome(incomeItem)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(incomeItem.id)}
                      disabled={deleteIncome.isPending}
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

      <IncomeEditDialog
        income={editingIncome}
        onClose={() => setEditingIncome(null)}
      />
    </>
  );
}
