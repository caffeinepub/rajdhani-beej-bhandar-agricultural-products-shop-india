import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';

export function useUpdateProductTranslations() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      productId, 
      language, 
      name, 
      description 
    }: { 
      productId: string; 
      language: string; 
      name: string; 
      description: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateProductTranslations(productId, language, name, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
