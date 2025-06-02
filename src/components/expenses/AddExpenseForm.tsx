
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';

interface AddExpenseFormProps {
  onOpenModal: () => void;
}

export function AddExpenseForm({ onOpenModal }: AddExpenseFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Add New Expense
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={onOpenModal} className="w-full">
          Open Expense Form
        </Button>
      </CardContent>
    </Card>
  );
}
