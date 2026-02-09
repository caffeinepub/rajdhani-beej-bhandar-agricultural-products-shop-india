import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import { useAdminActor } from '../useAdminActor';
import { useAdminStatus } from '../auth/useAdminStatus';
import { useI18n } from '../../i18n/I18nProvider';
import type { LandingPageTranslationsView } from '../../backend';

export function useGetLandingPageTranslations() {
  const { actor, isFetching: actorFetching } = useActor();
  const { language } = useI18n();

  return useQuery<LandingPageTranslationsView>({
    queryKey: ['landingPageTranslations', language],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getLandingPageTranslations(language);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useUpdateLandingPageTranslation() {
  const { actor } = useAdminActor();
  const { token } = useAdminStatus();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ language, title, subtitle }: { language: string; title: string; subtitle: string }) => {
      if (!actor) throw new Error('Actor not available');
      if (!token) throw new Error('Admin login required');
      return actor.updateLandingPageTranslation(token, language, title, subtitle);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landingPageTranslations'] });
    },
  });
}
