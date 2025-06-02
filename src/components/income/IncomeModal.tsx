
import { useState, useEffect } from 'react';
import { useAddIncome, useUpdateIncome, Income } from '@/hooks/useIncome';
import { useCategories } from '@/hooks/useExpenses';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface IncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  income?: Income | null;
}

export function IncomeModal({ isOpen, onClose, income }: IncomeModalProps) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const addIncome = useAddIncome();
  const updateIncome = useUpdateIncome();
  const { data: categories } = useCategories();

  const isEditing = !!income;

  useEffect(() => {
    if (income) {
      setAmount(income.amount.toString());
      setDescription(income.description);
      setCategoryId(income.category_id || '');
      setDate(income.date);
    } else {
      setAmount('');
      setDescription('');
      setCategoryId('');
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [income]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !description) return;

    const incomeData = {
      amount: parseFloat(amount),
      description,
      category_id: categoryId || null,
      date,
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Income' : 'Add New Income'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="income-amount">Amount</Label>
              <Input
                id="income-amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="income-date">Date</Label>
              <Input
                id="income-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="income-description">Description</Label>
            <Input
              id="income-description"
              placeholder="Enter income description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="income-category">Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center">
                      <span className="mr-2">{category.icon}</span>
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-green-600 hover:bg-green-700"
              disabled={addIncome.isPending || updateIncome.isPending}
            >
              {addIncome.isPending || updateIncome.isPending 
                ? (isEditing ? "Updating..." : "Adding...") 
                : (isEditing ? "Update Income" : "Add Income")
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
