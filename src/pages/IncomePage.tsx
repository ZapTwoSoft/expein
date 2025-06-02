import { useState } from 'react';
import { useIncome } from '@/hooks/useIncome';
import { IncomeList } from '@/components/income/IncomeList';
import { IncomeModal } from '@/components/income/IncomeModal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function IncomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const { data: income } = useIncome();

  const totalIncome = income?.reduce((sum, incomeItem) => sum + incomeItem.amount, 0) || 0;
  const incomeCount = income?.length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Income</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track your income sources
          </p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)} 
          className="flex items-center bg-green-600 hover:bg-green-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Income
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ৳{totalIncome.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Number of Income Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{incomeCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ৳{incomeCount > 0 ? (totalIncome / incomeCount).toFixed(2) : '0.00'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Income List with integrated filter */}
      <IncomeList dateRange={dateRange} onDateRangeChange={setDateRange} />

      <IncomeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
