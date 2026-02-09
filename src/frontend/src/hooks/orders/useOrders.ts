import { useQuery } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { CustomerOrder, OrderStatus } from '../../backend';
import { OrderStatus as OrderStatusEnum } from '../../backend';

export function useGetOrdersByStatus(status: OrderStatus) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<CustomerOrder[]>({
    queryKey: ['orders', 'status', status],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getOrdersByStatus(status);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetAllOrders() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<CustomerOrder[]>({
    queryKey: ['orders', 'all'],
    queryFn: async () => {
      if (!actor) return [];
      const [pending, confirmed, completed] = await Promise.all([
        actor.getOrdersByStatus(OrderStatusEnum.pending),
        actor.getOrdersByStatus(OrderStatusEnum.confirmed),
        actor.getOrdersByStatus(OrderStatusEnum.completed),
      ]);
      return [...pending, ...confirmed, ...completed];
    },
    enabled: !!actor && !actorFetching,
  });
}
