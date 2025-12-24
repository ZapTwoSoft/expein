import { useMemo, useState } from 'react';
import { useExpenses } from '@/hooks/useExpenses';
import { useIncome } from '@/hooks/useIncome';
import { useLoans } from '@/hooks/useLoans';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SkeletonList } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown, HandCoins } from 'lucide-react';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/utils';

interface Transaction {
  id: string;
  type: 'income' | 'expense' | 'loan_given' | 'loan_taken';
  amount: number;
  description: string;
  category?: string;
  date: string;
  loanInfo?: {
    borrowerLenderName: string;
    status: string;
  };
}

export function TransactionList() {
  const { data: expenses, isLoading: expensesLoading } = useExpenses();
  const { data: income, isLoading: incomeLoading } = useIncome();
  const { data: loans, isLoading: loansLoading } = useLoans();
  const isLoading = expensesLoading || incomeLoading || loansLoading;

  const transactions = useMemo(() => {
    const allTransactions: Transaction[] = [];

    // Add expenses
    expenses?.forEach(expense => {
      allTransactions.push({
        id: expense.id,
        type: 'expense',
        amount: expense.amount,
        description: expense.description,
        category: expense.categories?.name,
        date: expense.date,
      });
    });

    // Add income
    income?.forEach(incomeItem => {
      allTransactions.push({
        id: incomeItem.id,
        type: 'income',
        amount: incomeItem.amount,
        description: incomeItem.description,
        category: incomeItem.categories?.name,
        date: incomeItem.date,
      });
    });

    // Add loans
    loans?.forEach(loan => {
      allTransactions.push({
        id: loan.id,
        type: loan.loan_type === 'given' ? 'loan_given' : 'loan_taken',
        amount: loan.amount,
        description: loan.description,
        date: loan.date,
        loanInfo: {
          borrowerLenderName: loan.borrower_lender_name,
          status: loan.status,
        },
      });
    });

    // Sort by date (most recent first)
    return allTransactions.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ).slice(0, 15); // Show more transactions since we now have loans too
  }, [expenses, income, loans]);


  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'income':
      case 'loan_taken':
        return <TrendingUp className="h-4 w-4" />;
      case 'expense':
      case 'loan_given':
        return type === 'loan_given' ? <HandCoins className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;
      default:
        return <TrendingDown className="h-4 w-4" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'income':
        return 'bg-brand/20 text-brand';
      case 'expense':
        return 'bg-red-500/20 text-red-400';
      case 'loan_given':
        return 'bg-orange-500/20 text-orange-400';
      case 'loan_taken':
        return 'bg-blue-500/20 text-blue-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getTransactionAmountColor = (type: string) => {
    switch (type) {
      case 'income':
      case 'loan_taken':
        return 'text-brand';
      case 'expense':
      case 'loan_given':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getTransactionLabel = (type: string) => {
    switch (type) {
      case 'income':
        return 'Income';
      case 'expense':
        return 'Expense';
      case 'loan_given':
        return 'Loan Given';
      case 'loan_taken':
        return 'Loan Taken';
      default:
        return 'Transaction';
    }
  };

  if (isLoading) {
    return (
      <Card className="shadow-sm bg-white/5 border-white/10 backdrop-blur animate-in fade-in duration-500">
        <CardHeader className="border-b border-white/10 px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4">
          <CardTitle className="text-sm sm:text-base lg:text-lg font-semibold text-white">
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-6">
          <SkeletonList count={6} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm bg-white/5 border-white/10 backdrop-blur animate-in fade-in duration-500">
      <CardHeader className="border-b border-white/10 px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4">
        <CardTitle className="text-sm sm:text-base lg:text-lg font-semibold text-white">
          Recent Transactions
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {transactions.length === 0 ? (
            <div className="col-span-full text-center py-6 sm:py-8 text-gray-400">
              <p className="text-sm sm:text-base">No transactions found</p>
              <p className="text-xs sm:text-sm mt-1">Start by adding some income, expenses, or loans</p>
            </div>
          ) : (
            transactions.slice(0, 9).map((transaction) => (
              <div
                key={transaction.id}
                className="flex flex-col p-3 sm:p-4 rounded-lg border border-white/10 hover:bg-white/5 transition-colors h-full"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-full flex-shrink-0 ${getTransactionColor(transaction.type)}`}>
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div className="text-right ml-2">
                    <p className={`font-bold text-sm sm:text-base ${getTransactionAmountColor(transaction.type)}`}>
                      {(transaction.type === 'income' || transaction.type === 'loan_taken') ? '+' : '-'}
                      {formatCurrency(transaction.amount).replace('BDT ', '')}
                    </p>
                  </div>
                </div>
                
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white mb-2 line-clamp-2">
                    {transaction.description}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-gray-400">
                    <span className="px-2 py-1 bg-white/10 rounded-full text-xs">
                      {getTransactionLabel(transaction.type)}
                    </span>
                    {transaction.category && (
                      <span className="px-2 py-1 bg-white/10 rounded-full text-xs">
                        {transaction.category}
                      </span>
                    )}
                    {transaction.loanInfo && (
                      <span className="px-2 py-1 bg-white/10 rounded-full text-xs">
                        {transaction.loanInfo.borrowerLenderName}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-white/10">
                  {format(new Date(transaction.date), 'MMM dd, yyyy')}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
} 