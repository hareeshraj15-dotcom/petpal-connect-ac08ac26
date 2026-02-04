import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Package, ChevronDown, ChevronUp, Loader2, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { format } from 'date-fns';

interface OrderItem {
  id: string;
  product_name: string;
  product_price: number;
  quantity: number;
  product: {
    image_url: string | null;
  } | null;
}

interface Order {
  id: string;
  total_amount: number;
  status: string;
  shipping_address: string | null;
  created_at: string;
  order_items: OrderItem[];
}

const statusConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  pending: { label: 'Pending', icon: <Clock className="h-4 w-4" />, color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
  confirmed: { label: 'Confirmed', icon: <CheckCircle className="h-4 w-4" />, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  processing: { label: 'Processing', icon: <Package className="h-4 w-4" />, color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
  shipped: { label: 'Shipped', icon: <Truck className="h-4 w-4" />, color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' },
  delivered: { label: 'Delivered', icon: <CheckCircle className="h-4 w-4" />, color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  cancelled: { label: 'Cancelled', icon: <XCircle className="h-4 w-4" />, color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
};

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;

    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Fetch order items for each order
      const ordersWithItems = await Promise.all(
        (ordersData || []).map(async (order) => {
          const { data: items } = await supabase
            .from('order_items')
            .select(`
              id,
              product_name,
              product_price,
              quantity,
              product:products (image_url)
            `)
            .eq('order_id', order.id);

          return {
            ...order,
            order_items: (items || []).map(item => ({
              ...item,
              product: Array.isArray(item.product) ? item.product[0] : item.product
            })),
          };
        })
      );

      setOrders(ordersWithItems);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleOrder = (orderId: string) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Order History</h1>
        <p className="text-muted-foreground">Track and manage your orders</p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
            <p className="text-muted-foreground text-center">
              When you make a purchase, your orders will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = statusConfig[order.status] || statusConfig.pending;
            const isExpanded = expandedOrders.has(order.id);

            return (
              <Collapsible key={order.id} open={isExpanded} onOpenChange={() => toggleOrder(order.id)}>
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-lg">
                          <Package className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <CardTitle className="text-base">
                            Order #{order.id.slice(0, 8).toUpperCase()}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(order.created_at), 'PPP')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={`${status.color} flex items-center gap-1`}>
                          {status.icon}
                          {status.label}
                        </Badge>
                        <span className="font-semibold">₹{Number(order.total_amount).toFixed(2)}</span>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm">
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                    </div>
                  </CardHeader>

                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-3">Order Items</h4>
                        <div className="space-y-3">
                          {order.order_items.map((item) => (
                            <div key={item.id} className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
                                <img
                                  src={item.product?.image_url || '/placeholder.svg'}
                                  alt={item.product_name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm line-clamp-1">{item.product_name}</p>
                                <p className="text-sm text-muted-foreground">
                                  Qty: {item.quantity} × ₹{Number(item.product_price).toFixed(2)}
                                </p>
                              </div>
                              <p className="font-semibold text-sm">
                                ₹{(Number(item.product_price) * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* Order Timeline */}
                        <div className="mt-6 pt-4 border-t">
                          <h4 className="font-medium mb-3">Order Status</h4>
                          <div className="flex items-center gap-2 overflow-x-auto pb-2">
                            {['pending', 'confirmed', 'processing', 'shipped', 'delivered'].map((step, index) => {
                              const stepConfig = statusConfig[step];
                              const currentIndex = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'].indexOf(order.status);
                              const isCompleted = index <= currentIndex;
                              const isCurrent = step === order.status;

                              return (
                                <div key={step} className="flex items-center">
                                  <div className={`flex flex-col items-center ${isCurrent ? 'text-primary' : isCompleted ? 'text-green-600' : 'text-muted-foreground'}`}>
                                    <div className={`p-2 rounded-full ${isCurrent ? 'bg-primary/10' : isCompleted ? 'bg-green-100 dark:bg-green-900' : 'bg-muted'}`}>
                                      {stepConfig.icon}
                                    </div>
                                    <span className="text-xs mt-1 whitespace-nowrap">{stepConfig.label}</span>
                                  </div>
                                  {index < 4 && (
                                    <div className={`w-8 h-0.5 mx-1 ${isCompleted && index < currentIndex ? 'bg-green-600' : 'bg-muted'}`} />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
