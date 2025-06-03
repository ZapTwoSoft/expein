import { useState } from 'react';
import { useLoans } from '@/hooks/useLoans';
import { LoanList } from '@/components/loans/LoanList';
import { LoanModal } from '@/components/loans/LoanModal';
import { Button } from '@/components/ui/button';
import { Plus, HandCoins, TrendingDown, TrendingUp } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function LoansPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const { data: loans } = useLoans();

  const givenLoans = loans?.filter(loan => loan.loan_type === 'given') || [];
  const takenLoans = loans?.filter(loan => loan.loan_type === 'taken') || [];
  
  const totalGiven = givenLoans.reduce((sum, loan) => sum + loan.amount, 0);
  const totalTaken = takenLoans.reduce((sum, loan) => sum + loan.amount, 0);
  const netPosition = totalGiven - totalTaken;

  const activeLoans = loans?.length || 0;
  const netBalance = netPosition;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">Loans</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Track loans given and taken
          </p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)} 
          className="flex items-center text-sm sm:text-base h-8 sm:h-9 px-3 sm:px-4 p-5"
        >
          <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          <span className="sm:hidden">Add Loan</span>
          <span className="hidden sm:inline">Add Loan</span>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Given</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-green-600">
              ৳{totalGiven.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Taken</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-red-600">
              ৳{totalTaken.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Active Loans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{activeLoans}</div>
          </CardContent>
        </Card>
      </div>

      {/* Loan List with integrated filter */}
      <LoanList dateRange={dateRange} onDateRangeChange={setDateRange} />

      <LoanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
