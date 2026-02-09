import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { CustomerOrderInput, CustomerOrder } from '../../backend';
import { toast } from 'sonner';

export function useCreateOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderInput: CustomerOrderInput) => {
      if (!actor) throw new Error('Actor not available');
      const result = await actor.createCustomerOrder(orderInput);
      if (!result) throw new Error('Failed to create order');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order placed successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to place order');
    },
  });
}
