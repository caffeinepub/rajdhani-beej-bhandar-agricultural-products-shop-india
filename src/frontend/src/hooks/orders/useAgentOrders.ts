import { useQuery } from '@tanstack/react-query';
import { useActor } from '../useActor';
import { useAgentSession } from '../auth/useAgentSession';
import type { CustomerOrder } from '../../backend';

export function useGetAgentOrders() {
  const { actor, isFetching: actorFetching } = useActor();
  const { isAuthenticated } = useAgentSession();

  return useQuery<CustomerOrder[]>({
    queryKey: ['agentOrders'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAgentOrders();
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
  });
}
