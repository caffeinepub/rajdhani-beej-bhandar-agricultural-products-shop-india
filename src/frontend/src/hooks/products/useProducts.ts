import { useQuery } from '@tanstack/react-query';
import { useActor } from '../useActor';
import { useI18n } from '../../i18n/I18nProvider';
import type { ProductView, Category } from '../../backend';

// Helper to get translated text with fallback
function getTranslatedText(entries: Array<[string, string]>, language: string): string {
  const translation = entries.find(([lang]) => lang === language)?.[1];
  if (translation) return translation;
  
  // Fallback to English
  const englishTranslation = entries.find(([lang]) => lang === 'en')?.[1];
  return englishTranslation || '';
}

// Transform ProductView to include language-aware name and description
function transformProduct(product: ProductView, language: string) {
  return {
    ...product,
    name: getTranslatedText(product.translations.name.entries, language),
    description: getTranslatedText(product.translations.description.entries, language),
  };
}

export function useGetAllProducts() {
  const { actor, isFetching: actorFetching } = useActor();
  const { language } = useI18n();

  return useQuery({
    queryKey: ['products', 'all', language],
    queryFn: async () => {
      if (!actor) return [];
      const products = await actor.getAllProducts(language);
      return products.map(p => transformProduct(p, language));
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetProductsByCategory(category: Category | null) {
  const { actor, isFetching: actorFetching } = useActor();
  const { language } = useI18n();

  return useQuery({
    queryKey: ['products', 'category', category, language],
    queryFn: async () => {
      if (!actor) return [];
      if (!category) {
        const products = await actor.getAllProducts(language);
        return products.map(p => transformProduct(p, language));
      }
      const products = await actor.getProductsByCategory(category, language);
      return products.map(p => transformProduct(p, language));
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetProduct(productId: string) {
  const { data: products, isLoading, error } = useGetAllProducts();
  
  const product = products?.find(p => p.id === productId);
  
  return {
    data: product,
    isLoading,
    error: error || (!isLoading && !product ? new Error('Product not found') : null),
  };
}
