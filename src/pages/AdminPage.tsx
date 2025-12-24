import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCategories, useIncomeCategories, Category } from '@/hooks/useExpenses';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ResponsiveModal, ResponsiveModalContent, ResponsiveModalFooter } from '@/components/ui/responsive-modal';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { Edit, Trash2, Plus, Settings } from 'lucide-react';

// Hard-coded admin email - change this to your admin email
const ADMIN_EMAIL = 'alkemy48@gmail.com';

interface CategoryFormData {
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense';
}

export function AdminPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: expenseCategories, isLoading: expenseLoading } = useCategories();
  const { data: incomeCategories, isLoading: incomeLoading } = useIncomeCategories();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    icon: '',
    color: '#3b82f6',
    type: 'expense'
  });

  // Check if user is admin
  const isAdmin = user?.email === ADMIN_EMAIL;

  // Add category mutation
  const addCategoryMutation = useMutation({
    mutationFn: async (categoryData: CategoryFormData) => {
      const { error } = await supabase
        .from('categories')
        .insert([categoryData]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: "Category added",
        description: "New category has been created successfully.",
        variant: "success",
      });
      handleCloseModal();
    },
    onError: (error: any) => {
      toast({
        title: "Error adding category",
        description: error.message,
        variant: "error",
      });
    },
  });

  // Update category mutation
  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, ...categoryData }: { id: string } & CategoryFormData) => {
      const { error } = await supabase
        .from('categories')
        .update(categoryData)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: "Category updated",
        description: "Category has been updated successfully.",
        variant: "success",
      });
      handleCloseModal();
    },
    onError: (error: any) => {
      toast({
        title: "Error updating category",
        description: error.message,
        variant: "error",
      });
    },
  });

  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: "Category deleted",
        description: "Category has been deleted successfully.",
        variant: "success",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting category",
        description: error.message,
        variant: "error",
      });
    },
  });

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      icon: '',
      color: '#3b82f6',
      type: 'expense'
    });
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      icon: category.icon || '',
      color: category.color || '#3b82f6',
      type: category.type as 'income' | 'expense'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.type) return;

    if (editingCategory) {
      await updateCategoryMutation.mutateAsync({
        id: editingCategory.id,
        ...formData
      });
    } else {
      await addCategoryMutation.mutateAsync(formData);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      await deleteCategoryMutation.mutateAsync(id);
    }
  };

  // Access denied for non-admin users
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-center text-red-400">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-400 mb-4">
              You don't have permission to access the admin panel.
            </p>
            <p className="text-sm text-gray-500">
              Only administrators can manage categories.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-white">
            <Settings className="h-6 w-6" />
            Admin Panel
          </h1>
          <p className="text-gray-400">
            Manage income and expense categories
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-brand text-black hover:bg-brand-400 font-medium">
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Expense Categories */}
        <Card className="bg-white/5 border-white/10 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-red-400">Expense Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {expenseLoading ? (
              <p className="text-gray-400">Loading...</p>
            ) : expenseCategories?.length === 0 ? (
              <p className="text-gray-500">No expense categories found</p>
            ) : (
              expenseCategories?.map((category) => (
                <div key={category.id} className="flex items-center justify-between p-3 border border-white/10 rounded-lg bg-white/5">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{category.icon}</span>
                    <div>
                      <p className="font-medium text-white">{category.name}</p>
                      <Badge variant="outline" style={{ backgroundColor: category.color + '20', borderColor: category.color + '40' }}>
                        {category.type}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(category)} className="border-white/20 hover:bg-white/5">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(category.id)} className="bg-red-500/20 border-red-500/20 hover:bg-red-500/30">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Income Categories */}
        <Card className="bg-white/5 border-white/10 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-brand">Income Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {incomeLoading ? (
              <p className="text-gray-400">Loading...</p>
            ) : incomeCategories?.length === 0 ? (
              <p className="text-gray-500">No income categories found</p>
            ) : (
              incomeCategories?.map((category) => (
                <div key={category.id} className="flex items-center justify-between p-3 border border-white/10 rounded-lg bg-white/5">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{category.icon}</span>
                    <div>
                      <p className="font-medium text-white">{category.name}</p>
                      <Badge variant="outline" style={{ backgroundColor: category.color + '20', borderColor: category.color + '40' }}>
                        {category.type}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(category)} className="border-white/20 hover:bg-white/5">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(category.id)} className="bg-red-500/20 border-red-500/20 hover:bg-red-500/30">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Category Modal */}
      <ResponsiveModal
        open={isModalOpen}
        onOpenChange={handleCloseModal}
        title={editingCategory ? 'Edit Category' : 'Add New Category'}
        className="sm:max-w-[500px]"
      >
        <ResponsiveModalContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  placeholder="Enter category name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={formData.type} onValueChange={(value: 'income' | 'expense') => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="icon">Icon (Emoji)</Label>
                <Input
                  id="icon"
                  placeholder="🍔"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                />
              </div>
            </div>
          </form>
        </ResponsiveModalContent>

        <ResponsiveModalFooter>
          <Button type="button" variant="outline" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            onClick={handleSubmit}
            disabled={addCategoryMutation.isPending || updateCategoryMutation.isPending}
          >
            {addCategoryMutation.isPending || updateCategoryMutation.isPending 
              ? (editingCategory ? "Updating..." : "Adding...") 
              : (editingCategory ? "Update Category" : "Add Category")
            }
          </Button>
        </ResponsiveModalFooter>
      </ResponsiveModal>
    </div>
  );
} 