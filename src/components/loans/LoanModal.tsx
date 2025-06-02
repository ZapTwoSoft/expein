
import { useState, useEffect } from 'react';
import { useAddLoan, useUpdateLoan, Loan } from '@/hooks/useLoans';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
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
      setDate(loan.date);
      setDueDate(loan.due_date || '');
      setInterestRate(loan.interest_rate?.toString() || '');
      setStatus(loan.status);
    } else {
      setAmount('');
      setDescription('');
      setLoanType('given');
      setBorrowerLenderName('');
      setDate(new Date().toISOString().split('T')[0]);
      setDueDate('');
      setInterestRate('');
      setStatus('active');
    }
  }, [loan]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !description || !borrowerLenderName) return;

    const loanData = {
      amount: parseFloat(amount),
      description,
      loan_type: loanType,
      borrower_lender_name: borrowerLenderName,
      date,
      due_date: dueDate || null,
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Loan' : 'Add New Loan'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="loan-amount">Amount</Label>
              <Input
                id="loan-amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="loan-type">Type</Label>
              <Select value={loanType} onValueChange={(value: 'given' | 'taken') => setLoanType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="given">Loan Given</SelectItem>
                  <SelectItem value="taken">Loan Taken</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="loan-description">Description</Label>
            <Input
              id="loan-description"
              placeholder="Enter loan description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="borrower-lender-name">
              {loanType === 'given' ? 'Borrower Name' : 'Lender Name'}
            </Label>
            <Input
              id="borrower-lender-name"
              placeholder={`Enter ${loanType === 'given' ? 'borrower' : 'lender'} name`}
              value={borrowerLenderName}
              onChange={(e) => setBorrowerLenderName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="loan-date">Date</Label>
              <Input
                id="loan-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="due-date">Due Date</Label>
              <Input
                id="due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="interest-rate">Interest Rate (%)</Label>
              <Input
                id="interest-rate"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
              />
            </div>

            {isEditing && (
              <div className="space-y-2">
                <Label htmlFor="loan-status">Status</Label>
                <Select value={status} onValueChange={(value: 'active' | 'paid' | 'partially_paid') => setStatus(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="partially_paid">Partially Paid</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={addLoan.isPending || updateLoan.isPending}
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
