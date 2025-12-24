import { useState, useEffect } from 'react';
import { useAddLoan, useUpdateLoan, Loan } from '@/hooks/useLoans';
import { useFinancialValidation } from '@/hooks/useFinancialValidation';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ResponsiveModal, ResponsiveModalContent, ResponsiveModalFooter } from '@/components/ui/responsive-modal';
import { DatePicker } from '@/components/ui/date-picker';
import { formatCurrency } from '@/lib/utils';

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
  const [validationError, setValidationError] = useState<string>('');

  const addLoan = useAddLoan();
  const updateLoan = useUpdateLoan();
  const { validateTransaction, financialSummary } = useFinancialValidation();
  const { toast } = useToast();

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
    setValidationError('');
  }, [loan, isOpen]);

  // Validate amount on change (only for loans given)
  useEffect(() => {
    if (amount && parseFloat(amount) > 0 && loanType === 'given') {
      const validation = validateTransaction(
        parseFloat(amount), 
        'loan_given',
        isEditing ? loan?.id : undefined
      );
      if (!validation.isValid) {
        setValidationError(validation.message);
      } else {
        setValidationError('');
      }
    } else {
      setValidationError('');
    }
  }, [amount, loanType, validateTransaction, isEditing, loan, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !description || !borrowerLenderName || !date) return;

    // Validate before submitting (only for loans given)
    if (loanType === 'given') {
      const validation = validateTransaction(
        parseFloat(amount), 
        'loan_given',
        isEditing ? loan?.id : undefined
      );
      
      if (!validation.isValid) {
        setValidationError(validation.message);
        toast({
          title: "Insufficient Balance",
          description: validation.message,
          variant: "destructive",
        });
        return;
      }
    }

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

    // Reset form state
    setAmount('');
    setDescription('');
    setLoanType('given');
    setBorrowerLenderName('');
    setDate(new Date());
    setDueDate(undefined);
    setInterestRate('');
    setStatus('active');
    setValidationError('');

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
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-4">
          {/* Available Balance Display - only for loans given */}
          {loanType === 'given' && (
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Available Balance:</span>
                <span className={`text-base font-semibold ${financialSummary.availableBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatCurrency(financialSummary.availableBalance)}
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-base sm:text-sm font-medium">
                Amount <span className="text-red-500">*</span>
              </Label>
              <Input
                id="amount"
                type="number"
                inputMode="decimal"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="text-base sm:text-sm h-14 sm:h-10 px-4"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="loan-type" className="text-base sm:text-sm font-medium">
                Type <span className="text-red-500">*</span>
              </Label>
              <Select value={loanType} onValueChange={(value: 'given' | 'taken') => setLoanType(value)}>
                <SelectTrigger className="text-base sm:text-sm h-14 sm:h-10">
                  <SelectValue placeholder="Select loan type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="given" className="text-base sm:text-sm py-3 sm:py-2">Given (You lent money)</SelectItem>
                  <SelectItem value="taken" className="text-base sm:text-sm py-3 sm:py-2">Taken (You borrowed money)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="borrower-lender" className="text-base sm:text-sm font-medium">
              {loanType === 'given' ? 'Borrower Name' : 'Lender Name'} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="borrower-lender"
              placeholder={loanType === 'given' ? 'Enter borrower name' : 'Enter lender name'}
              value={borrowerLenderName}
              onChange={(e) => setBorrowerLenderName(e.target.value)}
              required
              className="text-base sm:text-sm h-14 sm:h-10 px-4"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-base sm:text-sm font-medium">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Enter loan description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="text-base sm:text-sm min-h-[100px] sm:min-h-[80px] px-4 py-3 resize-none"
            />
          </div>
          
          <div className="grid grid-cols-1 gap-5 sm:gap-4">
            <div className="space-y-2">
              <Label className="text-base sm:text-sm font-medium">
                Date <span className="text-red-500">*</span>
              </Label>
              <DatePicker
                date={date}
                onDateChange={setDate}
                placeholder="Select loan date"
                className="h-14 sm:h-10"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-base sm:text-sm font-medium">Due Date</Label>
              <DatePicker
                date={dueDate}
                onDateChange={setDueDate}
                placeholder="Select due date (optional)"
                className="h-14 sm:h-10"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-5 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="interest-rate" className="text-base sm:text-sm font-medium">Interest Rate (%)</Label>
              <Input
                id="interest-rate"
                type="number"
                inputMode="decimal"
                step="0.01"
                placeholder="0.00 (optional)"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="text-base sm:text-sm h-14 sm:h-10 px-4"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status" className="text-base sm:text-sm font-medium">
                Status <span className="text-red-500">*</span>
              </Label>
              <Select value={status} onValueChange={(value: 'active' | 'paid' | 'partially_paid') => setStatus(value)}>
                <SelectTrigger className="text-base sm:text-sm h-14 sm:h-10">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active" className="text-base sm:text-sm py-3 sm:py-2">Active</SelectItem>
                  <SelectItem value="partially_paid" className="text-base sm:text-sm py-3 sm:py-2">Partially Paid</SelectItem>
                  <SelectItem value="paid" className="text-base sm:text-sm py-3 sm:py-2">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
      </ResponsiveModalContent>
      
      <ResponsiveModalFooter>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onClose}
          className="flex-1 text-base sm:text-sm h-14 sm:h-10 px-6 font-medium"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={addLoan.isPending || updateLoan.isPending || (loanType === 'given' && !!validationError)}
          onClick={handleSubmit}
          className="flex-1 text-base sm:text-sm h-14 sm:h-10 px-6 font-medium"
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
