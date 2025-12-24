import { useState } from 'react';
import { useSavings } from '@/hooks/useSavings';
import { SavingsList } from '@/components/savings/SavingsList';
import { SavingsModal } from '@/components/savings/SavingsModal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrencyWithCommas } from '@/lib/utils';

export function SavingsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const { data: savings } = useSavings();

  const totalSavings = savings?.reduce((sum, saving) => sum + saving.amount, 0) || 0;
  const savingsCount = savings?.length || 0;

  // Calculate savings with goals
  const savingsWithGoals = savings?.filter(s => s.goal_name && s.goal_amount) || [];
  const totalGoalAmount = savingsWithGoals.reduce((sum, s) => sum + (s.goal_amount || 0), 0);
  const totalSavedTowardsGoals = savingsWithGoals.reduce((sum, s) => sum + s.amount, 0);
  const goalProgress = totalGoalAmount > 0 ? (totalSavedTowardsGoals / totalGoalAmount) * 100 : 0;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Savings</h1>
          <p className="text-gray-400 mt-1 text-sm sm:text-base">
            Track and manage your savings goals
          </p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)} 
          className="flex items-center text-sm sm:text-base h-8 sm:h-9 px-3 sm:px-4 p-5 bg-brand text-black hover:bg-brand-400 font-medium"
        >
          <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          <span className="sm:hidden">Add Saving</span>
          <span className="hidden sm:inline">Add Saving</span>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        <Card className="bg-white/5 border-white/10 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-300">Total Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-blue-500">
              {formatCurrencyWithCommas(totalSavings)}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/5 border-white/10 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-300">Number of Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-white">{savingsCount}</div>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-1 bg-white/5 border-white/10 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-300">Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-white">
              {goalProgress.toFixed(1)}%
            </div>
            {savingsWithGoals.length > 0 && (
              <div className="mt-2">
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(goalProgress, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {formatCurrencyWithCommas(totalSavedTowardsGoals)} of {formatCurrencyWithCommas(totalGoalAmount)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Savings List with integrated filter */}
      <SavingsList dateRange={dateRange} onDateRangeChange={setDateRange} />

      <SavingsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

