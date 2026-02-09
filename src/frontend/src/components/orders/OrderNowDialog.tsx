import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, MessageCircle, Package } from 'lucide-react';
import { useI18n } from '../../i18n/I18nProvider';

interface OrderNowDialogProps {
  product: any;
}

export function OrderNowDialog({ product }: OrderNowDialogProps) {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();
  const navigate = useNavigate();

  const handleWebsiteOrder = () => {
    setOpen(false);
    navigate({ to: '/checkout/$productId', params: { productId: product.id } });
  };

  const handleWhatsAppOrder = () => {
    const message = `Hi, I'm interested in ordering:\n\nProduct: ${product.name}\nPrice: ₹${product.price}\n\nPlease provide more details.`;
    const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full">
          <ShoppingCart className="mr-2 h-5 w-5" />
          {t('product.orderNow')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('order.title')}</DialogTitle>
          <DialogDescription>
            {t('order.description')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={handleWebsiteOrder}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                {t('order.website')}
              </CardTitle>
              <CardDescription>
                {t('order.websiteDesc')}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={handleWhatsAppOrder}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-green-600" />
                {t('order.whatsapp')}
              </CardTitle>
              <CardDescription>
                {t('order.whatsappDesc')}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="opacity-60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-muted-foreground" />
                {t('order.bulk')}
              </CardTitle>
              <CardDescription>
                {t('order.bulkDesc')}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
