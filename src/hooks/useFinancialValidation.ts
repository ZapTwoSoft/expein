import { useMemo } from 'react';
import { useExpenses } from './useExpenses';
import { useIncome } from './useIncome';
import { useLoans } from './useLoans';
import { useSavings } from './useSavings';

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  totalLoansGiven: number;
  totalLoansTaken: number;
  totalSavings: number;
  availableBalance: number;
  isLoading: boolean;
}

/**
 * Hook to validate financial transactions and calculate available balance
 * Formula: Available Balance = Income + Loans Taken - Expenses - Loans Given - Savings
 */
export function useFinancialValidation() {
  const { data: expenses, isLoading: expensesLoading } = useExpenses();
  const { data: income, isLoading: incomeLoading } = useIncome();
  const { data: loans, isLoading: loansLoading } = useLoans();
  const { data: savings, isLoading: savingsLoading } = useSavings();

  const isLoading = expensesLoading || incomeLoading || loansLoading || savingsLoading;

  const financialSummary: FinancialSummary = useMemo(() => {
    const totalIncome = income?.reduce((sum, item) => sum + item.amount, 0) || 0;
    const totalExpenses = expenses?.reduce((sum, item) => sum + item.amount, 0) || 0;
    const totalLoansGiven = loans?.filter(loan => loan.loan_type === 'given')
      .reduce((sum, loan) => sum + loan.amount, 0) || 0;
    const totalLoansTaken = loans?.filter(loan => loan.loan_type === 'taken')
      .reduce((sum, loan) => sum + loan.amount, 0) || 0;
    const totalSavings = savings?.reduce((sum, item) => sum + item.amount, 0) || 0;

    // Calculate available balance
    // Formula: Income + Loans Taken - Expenses - Loans Given - Savings
    const availableBalance = totalIncome + totalLoansTaken - totalExpenses - totalLoansGiven - totalSavings;

    return {
      totalIncome,
      totalExpenses,
      totalLoansGiven,
      totalLoansTaken,
      totalSavings,
      availableBalance,
      isLoading,
    };
  }, [expenses, income, loans, savings, isLoading]);

  /**
   * Validates if a transaction is allowed based on available balance
   * @param amount - The amount of the proposed transaction
   * @param transactionType - Type of transaction: 'expense', 'loan_given', or 'saving'
   * @param excludeId - Optional ID to exclude from calculation (for edit operations)
   * @returns Object with validation result and message
   */
  const validateTransaction = (
    amount: number, 
    transactionType: 'expense' | 'loan_given' | 'saving',
    excludeId?: string
  ): { isValid: boolean; message: string; availableBalance: number } => {
    let adjustedBalance = financialSummary.availableBalance;

    // If editing, add back the old amount to get accurate available balance
    if (excludeId) {
      if (transactionType === 'expense') {
        const oldExpense = expenses?.find(e => e.id === excludeId);
        if (oldExpense) adjustedBalance += oldExpense.amount;
      } else if (transactionType === 'loan_given') {
        const oldLoan = loans?.find(l => l.id === excludeId && l.loan_type === 'given');
        if (oldLoan) adjustedBalance += oldLoan.amount;
      } else if (transactionType === 'saving') {
        const oldSaving = savings?.find(s => s.id === excludeId);
        if (oldSaving) adjustedBalance += oldSaving.amount;
      }
    }

    const newBalance = adjustedBalance - amount;
    
    if (newBalance < 0) {
      return {
        isValid: false,
        message: `Insufficient balance. Available: $${adjustedBalance.toFixed(2)}, Required: $${amount.toFixed(2)}. Please add income or reduce the amount.`,
        availableBalance: adjustedBalance,
      };
    }

    return {
      isValid: true,
      message: 'Transaction is valid',
      availableBalance: adjustedBalance,
    };
  };

  return {
    financialSummary,
    validateTransaction,
    isLoading,
  };
}

