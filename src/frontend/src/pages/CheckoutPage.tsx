import { useState } from 'react';
import { useParams, useNavigate, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetProduct } from '../hooks/products/useProducts';
import { useCreateOrder } from '../hooks/orders/useCreateOrder';
import { useI18n } from '../i18n/I18nProvider';
import LoadingState from '../components/system/LoadingState';
import ErrorState from '../components/system/ErrorState';
import { validateRequired, validateMobile, validatePincode, validateQuantity } from '../utils/validation';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function CheckoutPage() {
  const { productId } = useParams({ strict: false }) as { productId: string };
  const { t } = useI18n();
  const navigate = useNavigate();
  const { data: product, isLoading, error } = useGetProduct(productId);
  const createOrder = useCreateOrder();

  const [formData, setFormData] = useState({
    customerName: '',
    customerMobile: '',
    customerAddress: '',
    city: '',
    state: '',
    pincode: '',
    quantity: product?.minimumOrderQuantity.toString() || '1',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    const nameError = validateRequired(formData.customerName, 'Name');
    if (nameError) newErrors.customerName = nameError;

    const mobileError = validateMobile(formData.customerMobile);
    if (mobileError) newErrors.customerMobile = mobileError;

    const addressError = validateRequired(formData.customerAddress, 'Address');
    if (addressError) newErrors.customerAddress = addressError;

    const cityError = validateRequired(formData.city, 'City');
    if (cityError) newErrors.city = cityError;

    const stateError = validateRequired(formData.state, 'State');
    if (stateError) newErrors.state = stateError;

    const pincodeError = validatePincode(formData.pincode);
    if (pincodeError) newErrors.pincode = pincodeError;

    const quantity = parseInt(formData.quantity, 10);
    const quantityError = validateQuantity(quantity, Number(product.minimumOrderQuantity));
    if (quantityError) newErrors.quantity = quantityError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const fullAddress = `${formData.customerAddress}, ${formData.city}, ${formData.state} - ${formData.pincode}`;

    try {
      await createOrder.mutateAsync({
        productId: product.id,
        quantity: BigInt(formData.quantity),
        customerName: formData.customerName,
        customerMobile: formData.customerMobile,
        customerAddress: fullAddress,
      });
      navigate({ to: '/products' });
    } catch (error) {
      // Error handled by mutation
    }
  };

  const totalAmount = Number(product.price) * parseInt(formData.quantity || '1', 10);

  return (
    <div className="container py-8 max-w-4xl">
      <Button variant="ghost" asChild className="mb-6">
        <Link to="/products/$productId" params={{ productId }}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('nav.products')}
        </Link>
      </Button>

      <h1 className="text-3xl font-bold mb-8">{t('checkout.title')}</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('checkout.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="customerName">{t('checkout.name')} *</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => handleChange('customerName', e.target.value)}
                    className={errors.customerName ? 'border-destructive' : ''}
                  />
                  {errors.customerName && (
                    <p className="text-sm text-destructive mt-1">{errors.customerName}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="customerMobile">{t('checkout.mobile')} *</Label>
                  <Input
                    id="customerMobile"
                    type="tel"
                    value={formData.customerMobile}
                    onChange={(e) => handleChange('customerMobile', e.target.value)}
                    className={errors.customerMobile ? 'border-destructive' : ''}
                  />
                  {errors.customerMobile && (
                    <p className="text-sm text-destructive mt-1">{errors.customerMobile}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="customerAddress">{t('checkout.address')} *</Label>
                  <Textarea
                    id="customerAddress"
                    value={formData.customerAddress}
                    onChange={(e) => handleChange('customerAddress', e.target.value)}
                    className={errors.customerAddress ? 'border-destructive' : ''}
                    rows={3}
                  />
                  {errors.customerAddress && (
                    <p className="text-sm text-destructive mt-1">{errors.customerAddress}</p>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">{t('checkout.city')} *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      className={errors.city ? 'border-destructive' : ''}
                    />
                    {errors.city && (
                      <p className="text-sm text-destructive mt-1">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="state">{t('checkout.state')} *</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleChange('state', e.target.value)}
                      className={errors.state ? 'border-destructive' : ''}
                    />
                    {errors.state && (
                      <p className="text-sm text-destructive mt-1">{errors.state}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="pincode">{t('checkout.pincode')} *</Label>
                  <Input
                    id="pincode"
                    value={formData.pincode}
                    onChange={(e) => handleChange('pincode', e.target.value)}
                    className={errors.pincode ? 'border-destructive' : ''}
                  />
                  {errors.pincode && (
                    <p className="text-sm text-destructive mt-1">{errors.pincode}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Button type="submit" size="lg" className="w-full" disabled={createOrder.isPending}>
              {createOrder.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('checkout.submit')}
            </Button>
          </form>
        </div>

        <div>
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>{t('checkout.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-semibold">{product.name}</p>
                <p className="text-sm text-muted-foreground">₹{product.price.toString()} per unit</p>
              </div>

              <div>
                <Label htmlFor="quantity">{t('checkout.quantity')} *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min={Number(product.minimumOrderQuantity)}
                  value={formData.quantity}
                  onChange={(e) => handleChange('quantity', e.target.value)}
                  className={errors.quantity ? 'border-destructive' : ''}
                />
                {errors.quantity && (
                  <p className="text-sm text-destructive mt-1">{errors.quantity}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Min: {product.minimumOrderQuantity.toString()} units
                </p>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{t('checkout.total')}</span>
                  <span className="text-2xl font-bold">₹{totalAmount}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
