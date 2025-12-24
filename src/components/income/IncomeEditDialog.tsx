import { useState, useEffect } from 'react';
import { useUpdateIncome } from '@/hooks/useIncome';
import { useIncomeCategories } from '@/hooks/useExpenses';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Income } from '@/hooks/useIncome';

interface IncomeEditDialogProps {
  income: Income | null;
  onClose: () => void;
}

export function IncomeEditDialog({ income, onClose }: IncomeEditDialogProps) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [date, setDate] = useState('');

  const updateIncome = useUpdateIncome();
  const { data: categories } = useIncomeCategories();

  useEffect(() => {
    if (income) {
      setAmount(income.amount.toString());
      setDescription(income.description);
      setCategoryId(income.category_id || '');
      setDate(income.date);
    }
  }, [income]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!income || !amount || !categoryId) return;

    await updateIncome.mutateAsync({
      id: income.id,
      amount: parseFloat(amount),
      description: description || '',
      category_id: categoryId,
      date,
    });

    onClose();
  };

  return (
    <Dialog open={!!income} onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Income</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-income-amount">Amount</Label>
              <Input
                id="edit-income-amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-income-date">Date</Label>
              <Input
                id="edit-income-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-income-category">Category <span className="text-red-500">*</span></Label>
            <Select value={categoryId} onValueChange={setCategoryId} required>
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
          
          <div className="space-y-2">
            <Label htmlFor="edit-income-description">Description</Label>
            <Input
              id="edit-income-description"
              placeholder="Enter income description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateIncome.isPending}>
              {updateIncome.isPending ? "Updating..." : "Update Income"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
