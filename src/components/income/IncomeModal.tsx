import { useState, useEffect } from 'react';
import { useAddIncome, useUpdateIncome, Income } from '@/hooks/useIncome';
import { useIncomeCategories } from '@/hooks/useExpenses';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ResponsiveModal, ResponsiveModalContent, ResponsiveModalFooter } from '@/components/ui/responsive-modal';
import { DatePicker } from '@/components/ui/date-picker';

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

    // Reset form state
    setAmount('');
    setDescription('');
    setCategoryId('');
    setDate(new Date());

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
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-4">
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
                placeholder="Select income date"
                className="h-14 sm:h-10"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category" className="text-base sm:text-sm font-medium">Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="text-base sm:text-sm h-14 sm:h-10">
                <SelectValue placeholder="Select a category (optional)" />
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
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Enter income description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
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
          disabled={addIncome.isPending || updateIncome.isPending}
          onClick={handleSubmit}
          className="flex-1 text-base sm:text-sm h-14 sm:h-10 px-6 font-medium"
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
