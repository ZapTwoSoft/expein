import { useState, useEffect } from 'react';
import { useAddSaving, useUpdateSaving, Saving } from '@/hooks/useSavings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ResponsiveModal, ResponsiveModalContent, ResponsiveModalFooter } from '@/components/ui/responsive-modal';
import { DatePicker } from '@/components/ui/date-picker';

interface SavingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  saving?: Saving | null;
}

export function SavingsModal({ isOpen, onClose, saving }: SavingsModalProps) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [goalName, setGoalName] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [date, setDate] = useState<Date>(new Date());

  const addSaving = useAddSaving();
  const updateSaving = useUpdateSaving();

  const isEditing = !!saving;

  useEffect(() => {
    if (saving) {
      setAmount(saving.amount.toString());
      setDescription(saving.description);
      setGoalName(saving.goal_name || '');
      setGoalAmount(saving.goal_amount?.toString() || '');
      setDate(new Date(saving.date));
    } else {
      setAmount('');
      setDescription('');
      setGoalName('');
      setGoalAmount('');
      setDate(new Date());
    }
  }, [saving]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !description || !date) return;

    const savingData = {
      amount: parseFloat(amount),
      description,
      goal_name: goalName || null,
      goal_amount: goalAmount ? parseFloat(goalAmount) : null,
      date: date.toISOString().split('T')[0],
    };

    if (isEditing) {
      await updateSaving.mutateAsync({
        id: saving.id,
        ...savingData,
      });
    } else {
      await addSaving.mutateAsync(savingData);
    }

    // Reset form state
    setAmount('');
    setDescription('');
    setGoalName('');
    setGoalAmount('');
    setDate(new Date());

    onClose();
  };

  return (
    <ResponsiveModal 
      open={isOpen} 
      onOpenChange={onClose}
      title={isEditing ? 'Edit Saving' : 'Add New Saving'}
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
                placeholder="Select saving date"
                className="h-14 sm:h-10"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-base sm:text-sm font-medium">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Enter saving description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="text-base sm:text-sm min-h-[100px] sm:min-h-[80px] px-4 py-3 resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goalName" className="text-base sm:text-sm font-medium">
              Goal Name (Optional)
            </Label>
            <Input
              id="goalName"
              type="text"
              placeholder="e.g., Emergency Fund, Vacation"
              value={goalName}
              onChange={(e) => setGoalName(e.target.value)}
              className="text-base sm:text-sm h-14 sm:h-10 px-4"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goalAmount" className="text-base sm:text-sm font-medium">
              Goal Amount (Optional)
            </Label>
            <Input
              id="goalAmount"
              type="number"
              inputMode="decimal"
              step="0.01"
              placeholder="0.00"
              value={goalAmount}
              onChange={(e) => setGoalAmount(e.target.value)}
              className="text-base sm:text-sm h-14 sm:h-10 px-4"
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
          disabled={addSaving.isPending || updateSaving.isPending}
          onClick={handleSubmit}
          className="flex-1 text-base sm:text-sm h-14 sm:h-10 px-6 font-medium"
        >
          {addSaving.isPending || updateSaving.isPending 
            ? (isEditing ? "Updating..." : "Adding...") 
            : (isEditing ? "Update Saving" : "Add Saving")
          }
        </Button>
      </ResponsiveModalFooter>
    </ResponsiveModal>
  );
}

