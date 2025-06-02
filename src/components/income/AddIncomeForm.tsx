
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';

interface AddIncomeFormProps {
  onOpenModal: () => void;
}

export function AddIncomeForm({ onOpenModal }: AddIncomeFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-green-600">
          <Plus className="h-5 w-5 mr-2" />
          Add New Income
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={onOpenModal} className="w-full bg-green-600 hover:bg-green-700">
          Open Income Form
        </Button>
      </CardContent>
    </Card>
  );
}
