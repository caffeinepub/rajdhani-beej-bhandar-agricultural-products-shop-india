import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAdminActor } from '../useAdminActor';
import { useAdminStatus } from '../auth/useAdminStatus';
import type { OrderStatus } from '../../backend';
import { toast } from 'sonner';

export function useUpdateOrderStatus() {
  const { actor } = useAdminActor();
  const { token } = useAdminStatus();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: OrderStatus }) => {
      if (!actor) throw new Error('Actor not available');
      if (!token) throw new Error('Admin login required');
      await actor.updateOrderStatus(token, orderId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order status updated');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update order status');
    },
  });
}
