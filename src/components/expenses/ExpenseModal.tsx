import { useState, useEffect } from 'react';
import { useAddExpense, useUpdateExpense, useCategories, Expense } from '@/hooks/useExpenses';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from '@/components/ui/drawer';
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
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="sm:max-w-[500px]">
        <DrawerHeader className="pb-4">
          <DrawerTitle className="text-xl font-semibold">
            {isEditing ? 'Edit Expense' : 'Add New Expense'}
          </DrawerTitle>
        </DrawerHeader>
        
        <div className="flex-1 overflow-auto modal-scrollbar p-4">
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-4">
            <div className="grid grid-cols-1 gap-5 sm:gap-4">
              <div className="space-y-3">
                <Label htmlFor="amount" className="text-base sm:text-sm font-medium">Amount</Label>
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
        </div>
        
        <DrawerFooter>
          <div className="flex gap-3 sm:flex-row justify-end">
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
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
