import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Saving {
  id: string;
  amount: number;
  description: string;
  goal_name: string | null;
  goal_amount: number | null;
  date: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export function useSavings() {
  return useQuery({
    queryKey: ['savings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('savings')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      return data as Saving[];
    },
  });
}

export function useAddSaving() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (saving: {
      amount: number;
      description: string;
      goal_name: string | null;
      goal_amount: number | null;
      date: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('savings')
        .insert([{ ...saving, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savings'] });
      toast({
        title: "Saving added",
        description: "Your saving has been successfully added.",
        variant: "success",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error adding saving",
        description: error.message,
        variant: "error",
      });
    },
  });
}

export function useUpdateSaving() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      id,
      ...saving
    }: {
      id: string;
      amount: number;
      description: string;
      goal_name: string | null;
      goal_amount: number | null;
      date: string;
    }) => {
      const { data, error } = await supabase
        .from('savings')
        .update(saving)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savings'] });
      toast({
        title: "Saving updated",
        description: "Your saving has been successfully updated.",
        variant: "success",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating saving",
        description: error.message,
        variant: "error",
      });
    },
  });
}

export function useDeleteSaving() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('savings')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savings'] });
      toast({
        title: "Saving deleted",
        description: "Your saving has been successfully deleted.",
        variant: "success",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting saving",
        description: error.message,
        variant: "error",
      });
    },
  });
}

