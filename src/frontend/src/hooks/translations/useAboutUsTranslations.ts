import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import { useAdminActor } from '../useAdminActor';
import { useAdminStatus } from '../auth/useAdminStatus';
import { useI18n } from '../../i18n/I18nProvider';
import type { AboutUsContentTranslationsView } from '../../backend';

export function useGetAboutUs() {
  const { actor, isFetching } = useActor();
  const { language } = useI18n();

  return useQuery<AboutUsContentTranslationsView | null>({
    queryKey: ['aboutUs', language],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getAboutUs(language);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateAboutUsTranslation() {
  const { actor } = useAdminActor();
  const { token } = useAdminStatus();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      language,
      title,
      content,
    }: {
      language: string;
      title: string;
      content: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      if (!token) throw new Error('Admin login required');
      return actor.updateAboutUsTranslation(token, language, title, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aboutUs'] });
    },
  });
}
