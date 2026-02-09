import { useState } from 'react';
import { Link, useSearch } from '@tanstack/react-router';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useGetProductsByCategory } from '../hooks/products/useProducts';
import { ALLOWED_CATEGORIES, getCategoryLabel } from '../constants/categories';
import { useI18n } from '../i18n/I18nProvider';
import LoadingState from '../components/system/LoadingState';
import ErrorState from '../components/system/ErrorState';
import type { Category } from '../backend';

export default function ProductListPage() {
  const { t } = useI18n();
  const search = useSearch({ strict: false }) as { category?: Category };
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(search.category || null);
  
  const { data: products, isLoading, error, refetch } = useGetProductsByCategory(selectedCategory);

  if (isLoading) {
    return (
      <div className="container py-8">
        <LoadingState message={t('products.loading')} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <ErrorState message={t('products.error')} onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">{t('products.title')}</h1>
        
        <div className="w-full sm:w-64">
          <Select
            value={selectedCategory || 'all'}
            onValueChange={(value) => setSelectedCategory(value === 'all' ? null : value as Category)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('products.filter')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('products.all')}</SelectItem>
              {ALLOWED_CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {t(`category.${cat.value}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {!products || products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t('products.empty')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="flex flex-col">
              <CardHeader>
                {product.images.length > 0 && (
                  <div className="aspect-square rounded-md overflow-hidden bg-muted mb-4">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardTitle className="line-clamp-2">{product.name}</CardTitle>
                <Badge variant="secondary" className="w-fit mt-2">
                  {t(`category.${product.category}`)}
                </Badge>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {product.description}
                </p>
                <div className="mt-4 space-y-1">
                  <p className="text-lg font-bold">₹{product.price.toString()}</p>
                  <p className="text-sm text-muted-foreground">
                    {t('product.stock')}: {product.stock.toString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t('product.minOrder')}: {product.minimumOrderQuantity.toString()}
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to="/products/$productId" params={{ productId: product.id }}>
                    {t('product.viewDetails')}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
