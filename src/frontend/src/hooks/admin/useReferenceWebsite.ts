import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { ReferenceWebsite } from '../../backend';

export function useGetReferenceWebsite() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ReferenceWebsite | null>({
    queryKey: ['referenceWebsite'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getReferenceWebsite();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useSaveReferenceWebsite() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reference: ReferenceWebsite) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setReferenceWebsite(reference);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['referenceWebsite'] });
    },
  });
}
