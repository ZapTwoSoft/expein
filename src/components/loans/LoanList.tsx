import { useState } from 'react';
import { useLoans, useDeleteLoan, Loan } from '@/hooks/useLoans';
import { LoanModal } from './LoanModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { ConfirmationPopover } from '@/components/ui/confirmation-popover';
import { Edit, Trash2, Calendar, User, Percent, Filter, HandCoins } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { format, isWithinInterval, parseISO } from 'date-fns';

interface LoanListProps {
  dateRange?: DateRange;
  onDateRangeChange?: (dateRange: DateRange | undefined) => void;
}

export function LoanList({ dateRange, onDateRangeChange }: LoanListProps) {
  const { data: loans, isLoading } = useLoans();
  const deleteLoan = useDeleteLoan();
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredLoans = loans?.filter((loan) => {
    if (!dateRange?.from) return true;
    
    const loanDate = parseISO(loan.date);
    if (dateRange.to) {
      return isWithinInterval(loanDate, { start: dateRange.from, end: dateRange.to });
    }
    return loanDate >= dateRange.from;
  }) || [];

  const handleEdit = (loan: Loan) => {
    setEditingLoan(loan);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteLoan.mutateAsync(id);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLoan(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'partially_paid':
        return 'bg-yellow-100 text-yellow-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'given' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading loans...</div>
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
              {dateRange?.from && dateRange?.to ? 'Filtered Loans' : 'Loan History'}
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({filteredLoans?.length || 0} {(filteredLoans?.length || 0) === 1 ? 'loan' : 'loans'})
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
          {filteredLoans.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <HandCoins className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>
                {dateRange?.from && dateRange?.to 
                  ? 'No loans found in the selected date range.' 
                  : 'No loans found. Add your first loan to get started.'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLoans.map((loan) => (
                <div
                  key={loan.id}
                  className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">
                          ৳{loan.amount.toLocaleString()}
                        </h3>
                        <Badge className={getTypeColor(loan.loan_type)}>
                          {loan.loan_type === 'given' ? 'Given' : 'Taken'}
                        </Badge>
                        <Badge className={getStatusColor(loan.status)}>
                          {loan.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <p className="text-muted-foreground mb-2">{loan.description}</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{loan.borrower_lender_name}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{format(parseISO(loan.date), 'MMM dd, yyyy')}</span>
                        </div>
                        
                        {loan.due_date && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Due: {format(parseISO(loan.due_date), 'MMM dd, yyyy')}</span>
                          </div>
                        )}
                        
                        {loan.interest_rate && (
                          <div className="flex items-center gap-1">
                            <Percent className="h-4 w-4" />
                            <span>{loan.interest_rate}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(loan)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <ConfirmationPopover
                        title="Delete Loan"
                        description={`Are you sure you want to delete the loan with "${loan.borrower_lender_name}"? This action cannot be undone.`}
                        onConfirm={() => handleDelete(loan.id)}
                        disabled={deleteLoan.isPending}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={deleteLoan.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
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

      <LoanModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        loan={editingLoan}
      />
    </>
  );
}
