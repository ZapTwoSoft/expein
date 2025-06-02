
import { Header } from '@/components/layout/Header';
import { ExpenseSummary } from './ExpenseSummary';
import { IncomeExpenseChart } from './IncomeExpenseChart';

export function Dashboard() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Financial Dashboard
        </h2>
        <p className="text-gray-600">
          Track and manage your expenses and income efficiently
        </p>
      </div>

      <ExpenseSummary />

      <IncomeExpenseChart />
    </div>
  );
}
