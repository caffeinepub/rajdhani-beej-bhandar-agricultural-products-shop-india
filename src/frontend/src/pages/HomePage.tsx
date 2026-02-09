import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ALLOWED_CATEGORIES } from '../constants/categories';
import { useI18n } from '../i18n/I18nProvider';
import { useGetLandingPageTranslations } from '../hooks/translations/useLandingPageTranslations';
import { useGetAboutUs } from '../hooks/translations/useAboutUsTranslations';
import { ArrowRight, CheckCircle, Users, ShoppingBag, MessageCircle } from 'lucide-react';
import { openWhatsAppChat } from '../utils/whatsapp';
import { CONTACT_INFO } from '../constants/contact';
import { Category } from '../backend';

export default function HomePage() {
  const { t, language } = useI18n();
  const { data: translations } = useGetLandingPageTranslations();
  const { data: aboutUs } = useGetAboutUs();

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

  // Get About Us content with fallback
  const getAboutContent = (entries: Array<[string, string]> | undefined, fallback: string) => {
    if (!entries) return fallback;
    const translation = entries.find(([lang]) => lang === language)?.[1];
    if (translation) return translation;
    const englishTranslation = entries.find(([lang]) => lang === 'en')?.[1];
    return englishTranslation || fallback;
  };

  const aboutTitle = aboutUs 
    ? getAboutContent(aboutUs.title, t('about.title'))
    : t('about.title');
    
  const aboutContent = aboutUs
    ? getAboutContent(aboutUs.content, t('about.defaultContent'))
    : t('about.defaultContent');

  const handleWhatsAppEnquiry = () => {
    const message = t('whatsapp.generalEnquiry');
    openWhatsAppChat(message);
  };

  const features = [
    {
      icon: CheckCircle,
      title: t('home.features.genuine'),
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/20',
      borderColor: 'border-emerald-200 dark:border-emerald-800',
    },
    {
      icon: Users,
      title: t('home.features.expert'),
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/20',
      borderColor: 'border-amber-200 dark:border-amber-800',
    },
    {
      icon: ShoppingBag,
      title: t('home.features.ordering'),
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/20',
      borderColor: 'border-orange-200 dark:border-orange-800',
    },
  ];

  return (
    <div className="flex flex-col">
      <section className="relative h-[450px] sm:h-[550px] overflow-hidden">
        <img
          src="/assets/generated/hero-farm.dim_1600x600.png"
          alt="Agricultural farm"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent flex items-center">
          <div className="container">
            <div className="max-w-2xl text-white">
              <h1 className="text-4xl sm:text-6xl font-bold mb-4 leading-tight">
                {heroTitle}
              </h1>
              <p className="text-xl sm:text-2xl mb-8 text-white/95 font-medium">
                {heroSubtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all">
                  <Link to="/products">
                    {t('nav.products')} <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={handleWhatsAppEnquiry}
                  className="bg-white/95 hover:bg-white text-green-700 border-2 border-green-600 hover:border-green-700 shadow-lg hover:shadow-xl transition-all"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  {t('whatsapp.enquiry')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-background via-muted/20 to-background">
        <div className="container">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-green-700 to-green-600 dark:from-green-400 dark:to-green-300 bg-clip-text text-transparent">
            {t('home.features.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className={`text-center border-2 ${feature.borderColor} hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}
                >
                  <CardContent className="pt-8 pb-8">
                    <div className={`w-20 h-20 rounded-2xl ${feature.bgColor} flex items-center justify-center mx-auto mb-5 shadow-md`}>
                      <Icon className={`h-10 w-10 ${feature.color}`} />
                    </div>
                    <h3 className="font-bold text-lg leading-snug">
                      {feature.title}
                    </h3>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 dark:from-green-950/20 dark:via-emerald-950/20 dark:to-green-950/20">
        <div className="container max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-green-800 dark:text-green-300">
            {aboutTitle}
          </h2>
          <p className="text-base sm:text-lg text-foreground/80 leading-relaxed whitespace-pre-line">
            {aboutContent}
          </p>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16 bg-gradient-to-r from-green-700 to-amber-600 dark:from-green-400 dark:to-amber-400 bg-clip-text text-transparent">
            {t('categories.title')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {ALLOWED_CATEGORIES.map((category, index) => {
              const gradients = [
                'from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/20',
                'from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/20',
                'from-lime-100 to-lime-200 dark:from-lime-900/30 dark:to-lime-800/20',
                'from-teal-100 to-teal-200 dark:from-teal-900/30 dark:to-teal-800/20',
                'from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/20',
                'from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/20',
                'from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/20',
                'from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/20',
              ];
              const borderColors = [
                'border-green-300 dark:border-green-700',
                'border-emerald-300 dark:border-emerald-700',
                'border-lime-300 dark:border-lime-700',
                'border-teal-300 dark:border-teal-700',
                'border-amber-300 dark:border-amber-700',
                'border-orange-300 dark:border-orange-700',
                'border-blue-300 dark:border-blue-700',
                'border-purple-300 dark:border-purple-700',
              ];
              const icons = ['🌿', '🌾', '🐛', '🍄', '📈', '🌱', '🚜', '🏡'];
              return (
                <Link
                  key={category.value}
                  to="/products"
                  search={{ category: category.value }}
                >
                  <Card className={`hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer h-full border-2 ${borderColors[index]}`}>
                    <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                      <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${gradients[index]} flex items-center justify-center shadow-md`}>
                        <span className="text-3xl">
                          {icons[index]}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm leading-tight">
                        {t(getCategoryTranslationKey(category.value))}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

function getCategoryTranslationKey(category: string): string {
  return `category.${category}`;
}
