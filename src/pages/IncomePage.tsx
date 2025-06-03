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
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">Income</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Track and manage your income sources
          </p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)} 
          className="flex items-center text-sm sm:text-base h-8 sm:h-9 px-3 sm:px-4 p-5"
        >
          <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          <span className="sm:hidden">Add Income</span>
          <span className="hidden sm:inline">Add Income</span>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-green-600">
              ৳{totalIncome.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Number of Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{incomeCount}</div>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Average Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">
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
