import { useState, useEffect } from 'react';
import { useAddLoan, useUpdateLoan, Loan } from '@/hooks/useLoans';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ResponsiveModal, ResponsiveModalContent, ResponsiveModalFooter } from '@/components/ui/responsive-modal';
import { DatePickerFallback } from '@/components/ui/date-picker-fallback';

interface LoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  loan?: Loan | null;
}

export function LoanModal({ isOpen, onClose, loan }: LoanModalProps) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loanType, setLoanType] = useState<'given' | 'taken'>('given');
  const [borrowerLenderName, setBorrowerLenderName] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [interestRate, setInterestRate] = useState('');
  const [status, setStatus] = useState<'active' | 'paid' | 'partially_paid'>('active');

  const addLoan = useAddLoan();
  const updateLoan = useUpdateLoan();

  const isEditing = !!loan;

  useEffect(() => {
    if (loan) {
      setAmount(loan.amount.toString());
      setDescription(loan.description);
      setLoanType(loan.loan_type);
      setBorrowerLenderName(loan.borrower_lender_name);
      setDate(new Date(loan.date));
      setDueDate(loan.due_date ? new Date(loan.due_date) : undefined);
      setInterestRate(loan.interest_rate?.toString() || '');
      setStatus(loan.status);
    } else {
      setAmount('');
      setDescription('');
      setLoanType('given');
      setBorrowerLenderName('');
      setDate(new Date());
      setDueDate(undefined);
      setInterestRate('');
      setStatus('active');
    }
  }, [loan]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !description || !borrowerLenderName || !date) return;

    const loanData = {
      amount: parseFloat(amount),
      description,
      loan_type: loanType,
      borrower_lender_name: borrowerLenderName,
      date: date.toISOString().split('T')[0],
      due_date: dueDate ? dueDate.toISOString().split('T')[0] : null,
      interest_rate: interestRate ? parseFloat(interestRate) : null,
      status
    };

    if (isEditing) {
      await updateLoan.mutateAsync({
        id: loan.id,
        ...loanData,
        status,
      });
    } else {
      await addLoan.mutateAsync(loanData);
    }

    onClose();
  };

  return (
    <ResponsiveModal 
      open={isOpen} 
      onOpenChange={onClose}
      title={isEditing ? 'Edit Loan' : 'Add New Loan'}
      className="sm:min-w-[600px]"
    >
      <ResponsiveModalContent>
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-6">
            <div className="space-y-3 sm:space-y-3">
              <Label htmlFor="amount" className="text-base sm:text-base font-medium">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="text-base sm:text-sm h-12 sm:h-10 px-4"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="loan-type" className="text-base sm:text-sm font-medium">Type</Label>
              <Select value={loanType} onValueChange={(value: 'given' | 'taken') => setLoanType(value)}>
                <SelectTrigger className="text-base sm:text-sm h-12 sm:h-10">
                  <SelectValue placeholder="Select loan type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="given" className="text-base sm:text-sm">Given</SelectItem>
                  <SelectItem value="taken" className="text-base sm:text-sm">Taken</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="borrower-lender" className="text-base sm:text-sm font-medium">
              {loanType === 'given' ? 'Borrower Name' : 'Lender Name'}
            </Label>
            <Input
              id="borrower-lender"
              placeholder={loanType === 'given' ? 'Enter borrower name' : 'Enter lender name'}
              value={borrowerLenderName}
              onChange={(e) => setBorrowerLenderName(e.target.value)}
              required
              className="text-base sm:text-sm h-12 sm:h-10 px-4"
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="description" className="text-base sm:text-sm font-medium">Description</Label>
            <Input
              id="description"
              placeholder="Enter loan description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="text-base sm:text-sm h-12 sm:h-10 px-4"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-4">
            <div className="space-y-3">
              <Label className="text-base sm:text-sm font-medium">Date</Label>
              <div className="h-12 sm:h-10">
                <DatePickerFallback
                  date={date}
                  onDateChange={setDate}
                  placeholder="Select loan date"
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <Label className="text-base sm:text-sm font-medium">Due Date (Optional)</Label>
              <div className="h-12 sm:h-10">
                <DatePickerFallback
                  date={dueDate}
                  onDateChange={setDueDate}
                  placeholder="Select due date"
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-4">
            <div className="space-y-3">
              <Label htmlFor="interest-rate" className="text-base sm:text-sm font-medium">Interest Rate (%) - Optional</Label>
              <Input
                id="interest-rate"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="text-base sm:text-sm h-12 sm:h-10 px-4"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="status" className="text-base sm:text-sm font-medium">Status</Label>
              <Select value={status} onValueChange={(value: 'active' | 'paid' | 'partially_paid') => setStatus(value)}>
                <SelectTrigger className="text-base sm:text-sm h-12 sm:h-10">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active" className="text-base sm:text-sm">Active</SelectItem>
                  <SelectItem value="partially_paid" className="text-base sm:text-sm">Partially Paid</SelectItem>
                  <SelectItem value="paid" className="text-base sm:text-sm">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
      </ResponsiveModalContent>
      
      <ResponsiveModalFooter>
        <Button 
          type="button" 
          variant="destructive" 
          onClick={onClose}
          className="text-base sm:text-sm h-12 sm:h-9 px-6 font-medium"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={addLoan.isPending || updateLoan.isPending}
          onClick={handleSubmit}
          className="text-base sm:text-sm h-12 sm:h-9 px-6 font-medium"
        >
          {addLoan.isPending || updateLoan.isPending 
            ? (isEditing ? "Updating..." : "Adding...") 
            : (isEditing ? "Update Loan" : "Add Loan")
          }
        </Button>
      </ResponsiveModalFooter>
    </ResponsiveModal>
  );
}
