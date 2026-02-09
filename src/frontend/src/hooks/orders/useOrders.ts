import { useQuery } from '@tanstack/react-query';
import { useAdminActor } from '../useAdminActor';
import { useAdminStatus } from '../auth/useAdminStatus';
import type { CustomerOrder, OrderStatus } from '../../backend';
import { OrderStatus as OrderStatusEnum } from '../../backend';

export function useGetOrdersByStatus(status: OrderStatus) {
  const { actor } = useAdminActor();
  const { token } = useAdminStatus();

  return useQuery<CustomerOrder[]>({
    queryKey: ['orders', 'status', status, token],
    queryFn: async () => {
      if (!actor || !token) return [];
      return actor.getOrdersByStatus(token, status);
    },
    enabled: !!actor && !!token,
  });
}

export function useGetAllOrders() {
  const { actor } = useAdminActor();
  const { token } = useAdminStatus();

  return useQuery<CustomerOrder[]>({
    queryKey: ['orders', 'all', token],
    queryFn: async () => {
      if (!actor || !token) return [];
      const [pending, confirmed, completed] = await Promise.all([
        actor.getOrdersByStatus(token, OrderStatusEnum.pending),
        actor.getOrdersByStatus(token, OrderStatusEnum.confirmed),
        actor.getOrdersByStatus(token, OrderStatusEnum.completed),
      ]);
      return [...pending, ...confirmed, ...completed];
    },
    enabled: !!actor && !!token,
  });
}
