import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetAllOrders } from '../../hooks/orders/useOrders';
import { useUpdateOrderStatus } from '../../hooks/orders/useUpdateOrderStatus';
import { useI18n } from '../../i18n/I18nProvider';
import LoadingState from '../../components/system/LoadingState';
import ErrorState from '../../components/system/ErrorState';
import { OrderStatus, ProductType } from '../../backend';
import { getProductTypeLabel } from '../../utils/productType';

export default function OrderManagementPage() {
  const { t } = useI18n();
  const { data: orders, isLoading, error, refetch } = useGetAllOrders();

  const normalOrders = orders?.filter(o => 
    o.productType === ProductType.agriProduct || 
    o.productType === ProductType.machine || 
    o.productType === ProductType.kitchenGarden
  ) || [];

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
        <ErrorState message="Failed to load orders" onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">{t('admin.orders')}</h1>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">{t('admin.allOrders')}</TabsTrigger>
          <TabsTrigger value="agri">{t('admin.agriOrders')}</TabsTrigger>
          <TabsTrigger value="machine">{t('admin.machineOrders')}</TabsTrigger>
          <TabsTrigger value="kitchen">{t('admin.kitchenOrders')}</TabsTrigger>
          <TabsTrigger value="bulk">{t('admin.bulkOrders')}</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <OrdersTable orders={normalOrders} />
        </TabsContent>

        <TabsContent value="agri" className="mt-6">
          <OrdersTable orders={normalOrders.filter(o => o.productType === ProductType.agriProduct)} />
        </TabsContent>

        <TabsContent value="machine" className="mt-6">
          <OrdersTable orders={normalOrders.filter(o => o.productType === ProductType.machine)} />
        </TabsContent>

        <TabsContent value="kitchen" className="mt-6">
          <OrdersTable orders={normalOrders.filter(o => o.productType === ProductType.kitchenGarden)} />
        </TabsContent>

        <TabsContent value="bulk" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.bulkOrders')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t('admin.bulkOrdersEmpty')}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function OrdersTable({ orders }: { orders: any[] }) {
  const { t } = useI18n();

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('admin.orderId')}</TableHead>
              <TableHead>{t('admin.customer')}</TableHead>
              <TableHead>{t('admin.product')}</TableHead>
              <TableHead>{t('admin.productType')}</TableHead>
              <TableHead>{t('admin.quantity')}</TableHead>
              <TableHead>{t('admin.amount')}</TableHead>
              <TableHead>{t('admin.status')}</TableHead>
              <TableHead>{t('admin.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!orders || orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground">
                  {t('admin.noOrders')}
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
                  <TableCell>
                    <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
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

function OrderStatusSelect({ orderId, currentStatus }: { orderId: string; currentStatus: OrderStatus }) {
  const updateStatus = useUpdateOrderStatus();

  const getCurrentValue = () => {
    if (currentStatus === OrderStatus.pending) return 'pending';
    if (currentStatus === OrderStatus.confirmed) return 'confirmed';
    if (currentStatus === OrderStatus.completed) return 'completed';
    return 'cancelled';
  };

  const handleChange = async (value: string) => {
    let newStatus: OrderStatus;
    switch (value) {
      case 'pending':
        newStatus = OrderStatus.pending;
        break;
      case 'confirmed':
        newStatus = OrderStatus.confirmed;
        break;
      case 'completed':
        newStatus = OrderStatus.completed;
        break;
      case 'cancelled':
        newStatus = OrderStatus.cancelled;
        break;
      default:
        return;
    }
    await updateStatus.mutateAsync({ orderId, status: newStatus });
  };

  return (
    <Select value={getCurrentValue()} onValueChange={handleChange} disabled={updateStatus.isPending}>
      <SelectTrigger className="w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pending">Pending</SelectItem>
        <SelectItem value="confirmed">Confirmed</SelectItem>
        <SelectItem value="completed">Completed</SelectItem>
      </SelectContent>
    </Select>
  );
}
