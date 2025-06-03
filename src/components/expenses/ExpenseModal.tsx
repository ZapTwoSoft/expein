import { useState, useEffect } from 'react';
import { useAddExpense, useUpdateExpense, useCategories, Expense } from '@/hooks/useExpenses';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ResponsiveModal, ResponsiveModalContent, ResponsiveModalFooter } from '@/components/ui/responsive-modal';
import { DatePickerFallback } from '@/components/ui/date-picker-fallback';

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

  const addExpense = useAddExpense();
  const updateExpense = useUpdateExpense();
  const { data: categories } = useCategories();

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
  }, [expense]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !description || !date) return;

    const expenseData = {
      amount: parseFloat(amount),
      description,
      category_id: categoryId || null,
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
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:gap-6">
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
              <Label className="text-base sm:text-sm font-medium">Date</Label>
              <div className="h-12 sm:h-10">
                <DatePickerFallback
                  date={date}
                  onDateChange={setDate}
                  placeholder="Select expense date"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="description" className="text-base sm:text-sm font-medium">Description</Label>
            <Input
              id="description"
              placeholder="Enter expense description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="text-base sm:text-sm h-12 sm:h-10 px-4"
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="category" className="text-base sm:text-sm font-medium">Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="text-base sm:text-sm h-12 sm:h-10">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id} className="text-base sm:text-sm">
                    <div className="flex items-center">
                      <span className="mr-2">{category.icon}</span>
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
          disabled={addExpense.isPending || updateExpense.isPending}
          onClick={handleSubmit}
          className="text-base sm:text-sm h-12 sm:h-9 px-6 font-medium"
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
