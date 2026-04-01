import { Link } from 'react-router-dom';
import { Package, ExternalLink } from 'lucide-react';

const mockOrders = [
  { id: 'ORD-001', product: 'EduFlow Pro', plan: 'Yearly', amount: 290, date: '2026-03-15', status: 'Active' },
  { id: 'ORD-002', product: 'HotelNest', plan: 'Monthly', amount: 79, date: '2026-03-01', status: 'Active' },
  { id: 'ORD-003', product: 'ShopEngine', plan: 'Lifetime', amount: 499, date: '2026-01-20', status: 'Completed' },
];

const OrdersPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Orders</h1>

      {mockOrders.length === 0 ? (
        <div className="flex flex-col items-center py-24 text-center">
          <Package className="mb-4 h-12 w-12 text-muted-foreground/30" />
          <p className="text-lg font-medium text-foreground">No orders yet</p>
          <Link to="/" className="mt-6 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            Browse Apps
          </Link>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Order</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Product</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Plan</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Amount</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {mockOrders.map(order => (
                <tr key={order.id} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{order.id}</td>
                  <td className="px-4 py-3 font-medium text-foreground">{order.product}</td>
                  <td className="px-4 py-3 text-muted-foreground">{order.plan}</td>
                  <td className="px-4 py-3 text-foreground">${order.amount}</td>
                  <td className="px-4 py-3 text-muted-foreground">{order.date}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      order.status === 'Active'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-secondary text-muted-foreground'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link to={`/app/${order.id.toLowerCase()}`} className="flex items-center gap-1 text-xs text-primary hover:underline">
                      Open <ExternalLink className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
