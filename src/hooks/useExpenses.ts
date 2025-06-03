import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Expense {
  id: string;
  amount: number;
  description: string;
  category_id: string | null;
  date: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  categories?: {
    id: string;
    name: string;
    icon: string | null;
    color: string | null;
    type: string;
  };
}

export interface Category {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
  type: string;
  created_at: string | null;
}

export function useExpenses() {
  return useQuery({
    queryKey: ['expenses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('expenses')
        .select(`
          *,
          categories (
            id,
            name,
            icon,
            color,
            type
          )
        `)
        .order('date', { ascending: false });

      if (error) throw error;
      return data as Expense[];
    },
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories', 'expense'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('type', 'expense')
        .order('name');

      if (error) throw error;
      return data as Category[];
    },
  });
}

export function useIncomeCategories() {
  return useQuery({
    queryKey: ['categories', 'income'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('type', 'income')
        .order('name');

      if (error) throw error;
      return data as Category[];
    },
  });
}

export function useAddExpense() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (expense: {
      amount: number;
      description: string;
      category_id: string | null;
      date: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('expenses')
        .insert([{ ...expense, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast({
        title: "Expense added",
        description: "Your expense has been successfully added.",
        variant: "success",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error adding expense",
        description: error.message,
        variant: "error",
      });
    },
  });
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      id,
      ...expense
    }: {
      id: string;
      amount: number;
      description: string;
      category_id: string | null;
      date: string;
    }) => {
      const { data, error } = await supabase
        .from('expenses')
        .update(expense)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast({
        title: "Expense updated",
        description: "Your expense has been successfully updated.",
        variant: "success",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating expense",
        description: error.message,
        variant: "error",
      });
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast({
        title: "Expense deleted",
        description: "Your expense has been successfully deleted.",
        variant: "success",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting expense",
        description: error.message,
        variant: "error",
      });
    },
  });
}
