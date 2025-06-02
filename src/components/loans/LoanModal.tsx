import { useState, useEffect } from 'react';
import { useAddLoan, useUpdateLoan, Loan } from '@/hooks/useLoans';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
      ...(isEditing && { status })
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            {isEditing ? 'Edit Loan' : 'Add New Loan'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="text-sm"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="loan-type" className="text-sm">Type</Label>
              <Select value={loanType} onValueChange={(value: 'given' | 'taken') => setLoanType(value)}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Select loan type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="given" className="text-sm">Given</SelectItem>
                  <SelectItem value="taken" className="text-sm">Taken</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="borrower-lender" className="text-sm">
              {loanType === 'given' ? 'Borrower Name' : 'Lender Name'}
            </Label>
            <Input
              id="borrower-lender"
              placeholder={loanType === 'given' ? 'Enter borrower name' : 'Enter lender name'}
              value={borrowerLenderName}
              onChange={(e) => setBorrowerLenderName(e.target.value)}
              required
              className="text-sm"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm">Description</Label>
            <Input
              id="description"
              placeholder="Enter loan description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="text-sm"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label className="text-sm">Date</Label>
              <DatePickerFallback
                date={date}
                onDateChange={setDate}
                placeholder="Select loan date"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm">Due Date (Optional)</Label>
              <DatePickerFallback
                date={dueDate}
                onDateChange={setDueDate}
                placeholder="Select due date"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="interest-rate" className="text-sm">Interest Rate (%) - Optional</Label>
              <Input
                id="interest-rate"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="text-sm"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm">Status</Label>
              <Select value={status} onValueChange={(value: 'active' | 'paid' | 'partially_paid') => setStatus(value)}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active" className="text-sm">Active</SelectItem>
                  <SelectItem value="partially_paid" className="text-sm">Partially Paid</SelectItem>
                  <SelectItem value="paid" className="text-sm">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:justify-end pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="text-sm h-8 sm:h-9"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={addLoan.isPending || updateLoan.isPending}
              className="text-sm h-8 sm:h-9"
            >
              {addLoan.isPending || updateLoan.isPending 
                ? (isEditing ? "Updating..." : "Adding...") 
                : (isEditing ? "Update Loan" : "Add Loan")
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
