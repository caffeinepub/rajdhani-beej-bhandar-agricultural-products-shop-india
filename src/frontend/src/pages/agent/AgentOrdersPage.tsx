import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useGetAgentOrders } from '../../hooks/orders/useAgentOrders';
import { useI18n } from '../../i18n/I18nProvider';
import LoadingState from '../../components/system/LoadingState';
import ErrorState from '../../components/system/ErrorState';
import { OrderStatus } from '../../backend';
import { getProductTypeLabel } from '../../utils/productType';

export default function AgentOrdersPage() {
  const { t } = useI18n();
  const { data: orders, isLoading, error, refetch } = useGetAgentOrders();

  if (isLoading) {
    return (
      <div className="container py-8">
        <LoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <ErrorState message={t('agent.ordersError')} onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">{t('agent.ordersTitle')}</h1>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('agent.orderId')}</TableHead>
                <TableHead>{t('agent.customer')}</TableHead>
                <TableHead>{t('agent.product')}</TableHead>
                <TableHead>{t('agent.productType')}</TableHead>
                <TableHead>{t('agent.quantity')}</TableHead>
                <TableHead>{t('agent.amount')}</TableHead>
                <TableHead>{t('agent.status')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!orders || orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    {t('agent.noOrders')}
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-sm">{order.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-sm text-muted-foreground">{order.customerMobile}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.productName}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {order.productSummary}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{getProductTypeLabel(order.productType)}</Badge>
                    </TableCell>
                    <TableCell>{order.quantity.toString()}</TableCell>
                    <TableCell>₹{order.totalAmount.toString()}</TableCell>
                    <TableCell>
                      <OrderStatusBadge status={order.status} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const getVariant = () => {
    if (status === OrderStatus.pending) return 'secondary';
    if (status === OrderStatus.confirmed) return 'default';
    if (status === OrderStatus.completed) return 'outline';
    return 'destructive';
  };

  const getLabel = () => {
    if (status === OrderStatus.pending) return 'Pending';
    if (status === OrderStatus.confirmed) return 'Confirmed';
    if (status === OrderStatus.completed) return 'Completed';
    return 'Cancelled';
  };

  return <Badge variant={getVariant() as any}>{getLabel()}</Badge>;
}
