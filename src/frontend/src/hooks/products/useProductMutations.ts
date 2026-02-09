import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAdminActor } from '../useAdminActor';
import { useAdminStatus } from '../auth/useAdminStatus';
import type { ProductInput } from '../../backend';
import { toast } from 'sonner';

export function useCreateProduct() {
  const { actor } = useAdminActor();
  const { token } = useAdminStatus();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: ProductInput) => {
      if (!actor) throw new Error('Actor not available');
      if (!token) throw new Error('Admin login required');
      await actor.createProduct(token, product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create product');
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useAdminActor();
  const { token } = useAdminStatus();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, product }: { id: string; product: ProductInput }) => {
      if (!actor) throw new Error('Actor not available');
      if (!token) throw new Error('Admin login required');
      await actor.updateProduct(token, id, product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update product');
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useAdminActor();
  const { token } = useAdminStatus();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      if (!token) throw new Error('Admin login required');
      await actor.deleteProduct(token, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete product');
    },
  });
}
