import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ALLOWED_CATEGORIES } from '../constants/categories';
import { useI18n } from '../i18n/I18nProvider';
import { useGetLandingPageTranslations } from '../hooks/translations/useLandingPageTranslations';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  const { t, language } = useI18n();
  const { data: translations } = useGetLandingPageTranslations();

  // Get hero title and subtitle with fallback
  const getHeroText = (entries: Array<[string, string]> | undefined, fallback: string) => {
    if (!entries) return fallback;
    const translation = entries.find(([lang]) => lang === language)?.[1];
    if (translation) return translation;
    const englishTranslation = entries.find(([lang]) => lang === 'en')?.[1];
    return englishTranslation || fallback;
  };

  const heroTitle = translations 
    ? getHeroText(translations.heroTitle.entries, 'RAJDHANI BEEJ BHANDAR')
    : 'RAJDHANI BEEJ BHANDAR';
    
  const heroSubtitle = translations
    ? getHeroText(translations.heroSubtitle.entries, 'Trusted Agricultural Products Store')
    : 'Trusted Agricultural Products Store';

  return (
    <div className="flex flex-col">
      <section className="relative h-[400px] sm:h-[500px] overflow-hidden">
        <img
          src="/assets/generated/hero-farm.dim_1600x600.png"
          alt="Agricultural farm"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30 flex items-center">
          <div className="container">
            <div className="max-w-2xl text-white">
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                {heroTitle}
              </h1>
              <p className="text-xl sm:text-2xl mb-6 text-white/90">
                {heroSubtitle}
              </p>
              <Button size="lg" asChild className="bg-green-600 hover:bg-green-700">
                <Link to="/products">
                  {t('nav.products')} <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t('categories.title')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {ALLOWED_CATEGORIES.map((category, index) => (
              <Link
                key={category.value}
                to="/products"
                search={{ category: category.value }}
              >
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                      <span className="text-2xl">
                        {['🌿', '🌾', '🐛', '🍄', '📈', '🌱'][index]}
                      </span>
                    </div>
                    <h3 className="font-semibold text-sm">
                      {t(getCategoryTranslationKey(category.value))}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function getCategoryTranslationKey(category: string): string {
  return `category.${category}`;
}
