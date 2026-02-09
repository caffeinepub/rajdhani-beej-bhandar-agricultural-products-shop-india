import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useI18n } from '../../i18n/I18nProvider';
import { FileText, Image, Package, ShoppingCart, ImageIcon, ExternalLink, Globe, Users } from 'lucide-react';
import { useGetReferenceWebsite } from '../../hooks/admin/useReferenceWebsite';

export default function AdminDashboardPage() {
  const { t } = useI18n();
  const { data: referenceWebsite, isLoading: refLoading } = useGetReferenceWebsite();

  const dashboardCards = [
    {
      title: t('admin.editText'),
      description: t('admin.editTextDesc'),
      icon: FileText,
      href: '/admin/edit-text',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    },
    {
      title: t('admin.editImages'),
      description: t('admin.editImagesDesc'),
      icon: Image,
      href: '/admin/edit-images',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
    },
    {
      title: t('admin.manageProducts'),
      description: t('admin.manageProductsDesc'),
      icon: Package,
      href: '/admin/products',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-950/20',
    },
    {
      title: t('admin.ordersTitle'),
      description: t('admin.ordersDesc'),
      icon: ShoppingCart,
      href: '/admin/orders',
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20',
    },
    {
      title: t('admin.agents'),
      description: t('admin.agentsDesc'),
      icon: Users,
      href: '/admin/agents',
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/20',
    },
    {
      title: t('admin.gallery'),
      description: t('admin.galleryDesc'),
      icon: ImageIcon,
      href: '/admin/gallery',
      color: 'text-pink-600 dark:text-pink-400',
      bgColor: 'bg-pink-50 dark:bg-pink-950/20',
    },
    {
      title: t('admin.referenceWebsite'),
      description: t('admin.referenceWebsiteDesc'),
      icon: Globe,
      href: '/admin/reference-website',
      color: 'text-cyan-600 dark:text-cyan-400',
      bgColor: 'bg-cyan-50 dark:bg-cyan-950/20',
    },
  ];

  const handleOpenReference = () => {
    if (referenceWebsite?.url) {
      window.open(referenceWebsite.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('admin.dashboard')}</h1>
        <p className="text-muted-foreground">{t('admin.dashboardManage')}</p>
      </div>

      {!refLoading && (
        <Card className="mb-8 border-cyan-200 dark:border-cyan-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
              {t('admin.referenceWebsiteTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {referenceWebsite ? (
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground mb-1">{t('admin.savedUrl')}</p>
                    <p className="text-sm break-all">{referenceWebsite.url}</p>
                  </div>
                  <Button onClick={handleOpenReference} variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {t('admin.openLink')}
                  </Button>
                </div>
                {referenceWebsite.description && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">{t('admin.designNotes')}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {referenceWebsite.description}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <Alert>
                <AlertDescription>
                  {t('admin.noReferenceSet')}{' '}
                  <Link to="/admin/reference-website" className="text-primary hover:underline font-medium">
                    {t('admin.addNow')}
                  </Link>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.href} to={card.href}>
              <Card className="h-full transition-all hover:shadow-lg hover:scale-105 cursor-pointer">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${card.bgColor} flex items-center justify-center mb-3`}>
                    <Icon className={`h-6 w-6 ${card.color}`} />
                  </div>
                  <CardTitle className="text-lg">{card.title}</CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
