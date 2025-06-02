import { useState, useEffect } from 'react';
import { useAddExpense, useUpdateExpense, useCategories, Expense } from '@/hooks/useExpenses';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            {isEditing ? 'Edit Expense' : 'Add New Expense'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
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
              <Label className="text-sm">Date</Label>
              <DatePickerFallback
                date={date}
                onDateChange={setDate}
                placeholder="Select expense date"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm">Description</Label>
            <Input
              id="description"
              placeholder="Enter expense description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="text-sm"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm">Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id} className="text-sm">
                    <div className="flex items-center">
                      <span className="mr-2">{category.icon}</span>
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              disabled={addExpense.isPending || updateExpense.isPending}
              className="text-sm h-8 sm:h-9"
            >
              {addExpense.isPending || updateExpense.isPending 
                ? (isEditing ? "Updating..." : "Adding...") 
                : (isEditing ? "Update Expense" : "Add Expense")
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
