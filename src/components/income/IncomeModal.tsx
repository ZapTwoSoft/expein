import { useState, useEffect } from 'react';
import { useAddIncome, useUpdateIncome, Income } from '@/hooks/useIncome';
import { useIncomeCategories } from '@/hooks/useExpenses';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ResponsiveModal, ResponsiveModalContent, ResponsiveModalFooter } from '@/components/ui/responsive-modal';
import { DatePickerFallback } from '@/components/ui/date-picker-fallback';

interface IncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  income?: Income | null;
}

export function IncomeModal({ isOpen, onClose, income }: IncomeModalProps) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [date, setDate] = useState<Date>(new Date());

  const addIncome = useAddIncome();
  const updateIncome = useUpdateIncome();
  const { data: categories } = useIncomeCategories();

  const isEditing = !!income;

  useEffect(() => {
    if (income) {
      setAmount(income.amount.toString());
      setDescription(income.description);
      setCategoryId(income.category_id || '');
      setDate(new Date(income.date));
    } else {
      setAmount('');
      setDescription('');
      setCategoryId('');
      setDate(new Date());
    }
  }, [income]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !description || !date) return;

    const incomeData = {
      amount: parseFloat(amount),
      description,
      category_id: categoryId || null,
      date: date.toISOString().split('T')[0],
    };

    if (isEditing) {
      await updateIncome.mutateAsync({
        id: income.id,
        ...incomeData,
      });
    } else {
      await addIncome.mutateAsync(incomeData);
    }

    onClose();
  };

  return (
    <ResponsiveModal 
      open={isOpen} 
      onOpenChange={onClose}
      title={isEditing ? 'Edit Income' : 'Add New Income'}
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
                  placeholder="Select income date"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="description" className="text-base sm:text-sm font-medium">Description</Label>
            <Input
              id="description"
              placeholder="Enter income description"
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
          disabled={addIncome.isPending || updateIncome.isPending}
          onClick={handleSubmit}
          className="text-base sm:text-sm h-12 sm:h-9 px-6 font-medium"
        >
          {addIncome.isPending || updateIncome.isPending 
            ? (isEditing ? "Updating..." : "Adding...") 
            : (isEditing ? "Update Income" : "Add Income")
          }
        </Button>
      </ResponsiveModalFooter>
    </ResponsiveModal>
  );
}
