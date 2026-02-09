import { useParams, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useGetProduct } from '../hooks/products/useProducts';
import { useI18n } from '../i18n/I18nProvider';
import LoadingState from '../components/system/LoadingState';
import ErrorState from '../components/system/ErrorState';
import { ProductImageGallery } from '../components/products/ProductImageGallery';
import { OrderNowDialog } from '../components/orders/OrderNowDialog';
import { ArrowLeft } from 'lucide-react';

export default function ProductDetailPage() {
  const { productId } = useParams({ strict: false }) as { productId: string };
  const { t } = useI18n();
  const { data: product, isLoading, error } = useGetProduct(productId);

  if (isLoading) {
    return (
      <div className="container py-8">
        <LoadingState />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container py-8">
        <ErrorState message={t('products.error')} />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link to="/products">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('nav.products')}
        </Link>
      </Button>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <ProductImageGallery images={product.images} productName={product.name} />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <Badge variant="secondary">
              {t(`category.${product.category}`)}
            </Badge>
          </div>

          <Card>
            <CardContent className="pt-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">{t('product.price')}</span>
                <span className="text-2xl font-bold">₹{product.price.toString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">{t('product.stock')}</span>
                <span className="font-semibold">{product.stock.toString()} units</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">{t('product.minOrder')}</span>
                <span className="font-semibold">{product.minimumOrderQuantity.toString()} units</span>
              </div>
            </CardContent>
          </Card>

          <div>
            <h2 className="text-xl font-semibold mb-3">{t('product.description')}</h2>
            <p className="text-muted-foreground whitespace-pre-wrap">{product.description}</p>
          </div>

          <OrderNowDialog product={product} />
        </div>
      </div>
    </div>
  );
}
