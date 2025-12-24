import { useState, useEffect } from 'react';
import { useAddExpense, useUpdateExpense, useCategories, Expense } from '@/hooks/useExpenses';
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

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense?: Expense | null;
}

export function ExpenseModal({ isOpen, onClose, expense }: ExpenseModalProps) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [date, setDate] = useState<Date>(new Date());
  const [validationError, setValidationError] = useState<string>('');

  const addExpense = useAddExpense();
  const updateExpense = useUpdateExpense();
  const { data: categories } = useCategories();
  const { validateTransaction, financialSummary } = useFinancialValidation();
  const { toast } = useToast();

  const isEditing = !!expense;

  useEffect(() => {
    if (expense) {
      setAmount(expense.amount.toString());
      setDescription(expense.description);
      setCategoryId(expense.category_id || '');
      setDate(new Date(expense.date));
    } else {
      setAmount('');
      setDescription('');
      setCategoryId('');
      setDate(new Date());
    }
    setValidationError('');
  }, [expense, isOpen]);

  // Validate amount on change
  useEffect(() => {
    if (amount && parseFloat(amount) > 0) {
      const validation = validateTransaction(
        parseFloat(amount), 
        'expense',
        isEditing ? expense?.id : undefined
      );
      if (!validation.isValid) {
        setValidationError(validation.message);
      } else {
        setValidationError('');
      }
    } else {
      setValidationError('');
    }
  }, [amount, validateTransaction, isEditing, expense, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !categoryId || !date) return;

    // Validate before submitting
    const validation = validateTransaction(
      parseFloat(amount), 
      'expense',
      isEditing ? expense?.id : undefined
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

    const expenseData = {
      amount: parseFloat(amount),
      description: description || '',
      category_id: categoryId,
      date: date.toISOString().split('T')[0],
    };

    if (isEditing) {
      await updateExpense.mutateAsync({
        id: expense.id,
        ...expenseData,
      });
    } else {
      await addExpense.mutateAsync(expenseData);
    }

    // Reset form state
    setAmount('');
    setDescription('');
    setCategoryId('');
    setDate(new Date());
    setValidationError('');

    onClose();
  };

  return (
    <ResponsiveModal 
      open={isOpen} 
      onOpenChange={onClose}
      title={isEditing ? 'Edit Expense' : 'Add New Expense'}
      className="sm:min-w-[500px]"
    >
      <ResponsiveModalContent>
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-4">
          {/* Available Balance Display */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Available Balance:</span>
              <span className={`text-base font-semibold ${financialSummary.availableBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatCurrency(financialSummary.availableBalance)}
              </span>
            </div>
          </div>

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
              <Label className="text-base sm:text-sm font-medium">
                Date <span className="text-red-500">*</span>
              </Label>
              <DatePicker
                date={date}
                onDateChange={setDate}
                placeholder="Select expense date"
                className="h-14 sm:h-10"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category" className="text-base sm:text-sm font-medium">
              Category <span className="text-red-500">*</span>
            </Label>
            <Select value={categoryId} onValueChange={setCategoryId} required>
              <SelectTrigger className="text-base sm:text-sm h-14 sm:h-10">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id} className="text-base sm:text-sm py-3 sm:py-2">
                    <div className="flex items-center">
                      <span className="mr-2">{category.icon}</span>
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-base sm:text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Enter expense description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-base sm:text-sm min-h-[100px] sm:min-h-[80px] px-4 py-3 resize-none"
            />
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
          disabled={addExpense.isPending || updateExpense.isPending || !!validationError}
          onClick={handleSubmit}
          className="flex-1 text-base sm:text-sm h-14 sm:h-10 px-6 font-medium"
        >
          {addExpense.isPending || updateExpense.isPending 
            ? (isEditing ? "Updating..." : "Adding...") 
            : (isEditing ? "Update Expense" : "Add Expense")
          }
        </Button>
      </ResponsiveModalFooter>
    </ResponsiveModal>
  );
}
