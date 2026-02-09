import { useQuery } from '@tanstack/react-query';
import { type backendInterface } from '../backend';
import { createActorWithConfig } from '../config';

export function useAdminActor() {
  const actorQuery = useQuery<backendInterface>({
    queryKey: ['adminActor'],
    queryFn: async () => {
      // Create anonymous actor for admin operations
      return await createActorWithConfig();
    },
    staleTime: Infinity,
    enabled: true,
  });

  return { 
    actor: actorQuery.data || null,
    isFetching: actorQuery.isFetching,
  };
}
