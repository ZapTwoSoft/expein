import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Income {
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

export function useIncome() {
  return useQuery({
    queryKey: ['income'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('income')
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
      return data as Income[];
    },
  });
}

export function useAddIncome() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (income: {
      amount: number;
      description: string;
      category_id: string | null;
      date: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('income')
        .insert([{ ...income, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['income'] });
      toast({
        title: "Income added",
        description: "Your income has been successfully added.",
        variant: "success",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error adding income",
        description: error.message,
        variant: "error",
      });
    },
  });
}

export function useUpdateIncome() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      id,
      ...income
    }: {
      id: string;
      amount: number;
      description: string;
      category_id: string | null;
      date: string;
    }) => {
      const { data, error } = await supabase
        .from('income')
        .update(income)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['income'] });
      toast({
        title: "Income updated",
        description: "Your income has been successfully updated.",
        variant: "success",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating income",
        description: error.message,
        variant: "error",
      });
    },
  });
}

export function useDeleteIncome() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('income')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['income'] });
      toast({
        title: "Income deleted",
        description: "Your income has been successfully deleted.",
        variant: "success",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting income",
        description: error.message,
        variant: "error",
      });
    },
  });
}
