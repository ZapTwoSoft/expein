
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Loan {
  id: string;
  amount: number;
  description: string;
  loan_type: 'given' | 'taken';
  borrower_lender_name: string;
  date: string;
  due_date: string | null;
  interest_rate: number | null;
  status: 'active' | 'paid' | 'partially_paid';
  created_at: string;
  updated_at: string;
  user_id: string;
}

export function useLoans() {
  return useQuery({
    queryKey: ['loans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('loans')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      return data as Loan[];
    },
  });
}

export function useAddLoan() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (loan: {
      amount: number;
      description: string;
      loan_type: 'given' | 'taken';
      borrower_lender_name: string;
      date: string;
      due_date?: string | null;
      interest_rate?: number | null;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('loans')
        .insert([{ ...loan, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] });
      toast({
        title: "Loan added",
        description: "Your loan has been successfully added.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error adding loan",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateLoan() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      id,
      ...loan
    }: {
      id: string;
      amount: number;
      description: string;
      loan_type: 'given' | 'taken';
      borrower_lender_name: string;
      date: string;
      due_date?: string | null;
      interest_rate?: number | null;
      status: 'active' | 'paid' | 'partially_paid';
    }) => {
      const { data, error } = await supabase
        .from('loans')
        .update(loan)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] });
      toast({
        title: "Loan updated",
        description: "Your loan has been successfully updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating loan",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useDeleteLoan() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('loans')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] });
      toast({
        title: "Loan deleted",
        description: "Your loan has been successfully deleted.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting loan",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
