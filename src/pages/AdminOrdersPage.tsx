import { ShoppingBag, DollarSign, Package } from 'lucide-react';

const mockOrders = Array.from({ length: 10 }, (_, i) => ({
  id: `ORD-${String(i + 100).padStart(4, '0')}`,
  user: ['alex.chen', 'sarah.k', 'mike.r', 'priya.p', 'james.w', 'emily.d', 'omar.h', 'anya.s', 'tom.b', 'lisa.m'][i],
  product: ['EduFlow Pro', 'MediCore 360', 'HotelNest', 'ShopEngine', 'ServiceHub', 'FactoryOS', 'LearnPad', 'ClinicPro', 'CartMax', 'BookMyPro'][i],
  plan: ['Yearly', 'Monthly', 'Lifetime', 'Yearly', 'Monthly', 'Yearly', 'Lifetime', 'Monthly', 'Yearly', 'Monthly'][i],
  amount: [290, 79, 499, 290, 49, 590, 399, 79, 290, 49][i],
  date: `2026-0${Math.floor(i / 4) + 1}-${String((i % 28) + 1).padStart(2, '0')}`,
  status: ['Completed', 'Active', 'Completed', 'Active', 'Active', 'Completed', 'Refunded', 'Active', 'Active', 'Completed'][i],
}));

const AdminOrdersPage = () => {
  const totalRevenue = mockOrders.filter(o => o.status !== 'Refunded').reduce((s, o) => s + o.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Orders</h1>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2">
          <DollarSign className="h-4 w-4 text-green-400" />
          <span className="text-sm font-semibold text-foreground">${totalRevenue.toLocaleString()} total</span>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Order ID</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">User</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Product</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Plan</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Amount</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {mockOrders.map(o => (
              <tr key={o.id} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{o.id}</td>
                <td className="px-4 py-3 text-foreground">{o.user}</td>
                <td className="px-4 py-3 text-foreground">{o.product}</td>
                <td className="px-4 py-3 text-muted-foreground">{o.plan}</td>
                <td className="px-4 py-3 font-medium text-foreground">${o.amount}</td>
                <td className="px-4 py-3 text-muted-foreground">{o.date}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                    o.status === 'Active' ? 'bg-green-500/20 text-green-400' :
                    o.status === 'Completed' ? 'bg-primary/20 text-primary' :
                    'bg-destructive/20 text-destructive'
                  }`}>
                    {o.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
