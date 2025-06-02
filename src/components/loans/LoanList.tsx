
import { useState } from 'react';
import { useLoans, useDeleteLoan, Loan } from '@/hooks/useLoans';
import { LoanModal } from './LoanModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Calendar, User, Percent } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { format, isWithinInterval, parseISO } from 'date-fns';

interface LoanListProps {
  dateRange?: DateRange;
}

export function LoanList({ dateRange }: LoanListProps) {
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
    if (confirm('Are you sure you want to delete this loan?')) {
      await deleteLoan.mutateAsync(id);
    }
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
    return <div className="text-center py-8">Loading loans...</div>;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Loan History</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredLoans.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No loans found. Add your first loan to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLoans.map((loan) => (
                <div
                  key={loan.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">
                          ${loan.amount.toLocaleString()}
                        </h3>
                        <Badge className={getTypeColor(loan.loan_type)}>
                          {loan.loan_type === 'given' ? 'Given' : 'Taken'}
                        </Badge>
                        <Badge className={getStatusColor(loan.status)}>
                          {loan.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 mb-2">{loan.description}</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
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
                        className="hover:bg-blue-50"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(loan.id)}
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

      <LoanModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        loan={editingLoan}
      />
    </>
  );
}
