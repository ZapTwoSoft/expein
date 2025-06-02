import { ExpenseSummary } from './ExpenseSummary';
import { IncomeExpenseChart } from './IncomeExpenseChart';

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Track and manage your expenses and income efficiently
        </p>
      </div>

      <ExpenseSummary />

      <IncomeExpenseChart />
    </div>
  );
}
