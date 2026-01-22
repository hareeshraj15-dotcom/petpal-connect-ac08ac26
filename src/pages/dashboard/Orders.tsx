import { Package, Truck, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const orders = [
  { id: 'ORD-001', items: 'Premium Dog Food x2', total: 99.98, status: 'delivered', date: '2026-01-18' },
  { id: 'ORD-002', items: 'Pet Vitamin Supplements', total: 24.99, status: 'shipping', date: '2026-01-20' },
  { id: 'ORD-003', items: 'Interactive Dog Toy, Cat Food', total: 59.98, status: 'processing', date: '2026-01-22' },
];

const Orders = () => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'shipping':
        return <Truck className="h-5 w-5 text-primary" />;
      default:
        return <Package className="h-5 w-5 text-secondary" />;
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'shipping':
        return 'bg-primary/10 text-primary';
      default:
        return 'bg-secondary/10 text-secondary';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Orders</h1>
        <p className="text-muted-foreground">Track your order history</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-card rounded-xl p-12 text-center shadow-card">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No orders yet</h3>
          <p className="text-muted-foreground">Your order history will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-card rounded-xl p-6 shadow-card">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  {getStatusIcon(order.status)}
                  <div>
                    <h3 className="font-semibold text-foreground">{order.id}</h3>
                    <p className="text-muted-foreground text-sm">{order.items}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-foreground">${order.total}</p>
                  <span className={cn(
                    "px-3 py-1 text-xs rounded-full capitalize",
                    getStatusStyles(order.status)
                  )}>
                    {order.status}
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">Ordered on {order.date}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
