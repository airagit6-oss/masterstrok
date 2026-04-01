import { TrendingUp, DollarSign, Users, ShoppingBag } from 'lucide-react';

const stats = [
  { label: 'Total Earnings', value: '$1,240', icon: DollarSign, change: '+12%' },
  { label: 'This Month', value: '$320', icon: TrendingUp, change: '+8%' },
  { label: 'Referred Users', value: '47', icon: Users, change: '+5' },
  { label: 'Converted Sales', value: '18', icon: ShoppingBag, change: '+3' },
];

const recentCommissions = [
  { user: 'john_doe', product: 'EduFlow Pro', amount: 87, date: '2026-03-28', status: 'Paid' },
  { user: 'sarah_k', product: 'MediCore 360', amount: 45, date: '2026-03-25', status: 'Paid' },
  { user: 'mike_r', product: 'ShopEngine', amount: 120, date: '2026-03-20', status: 'Pending' },
  { user: 'priya_p', product: 'HotelNest', amount: 68, date: '2026-03-15', status: 'Paid' },
];

const ResellerDashboardPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reseller Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Your referral earnings and performance</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(s => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <s.icon className="h-4 w-4 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-green-400 mt-0.5">{s.change} this month</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="font-semibold text-foreground">Recent Commissions</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">User</th>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Product</th>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Commission</th>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Date</th>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentCommissions.map((c, i) => (
              <tr key={i} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{c.user}</td>
                <td className="px-4 py-2.5 text-foreground">{c.product}</td>
                <td className="px-4 py-2.5 font-medium text-foreground">${c.amount}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{c.date}</td>
                <td className="px-4 py-2.5">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                    c.status === 'Paid' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {c.status}
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

export default ResellerDashboardPage;
