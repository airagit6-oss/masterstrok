import { CreditCard, Users, TrendingUp } from 'lucide-react';

const mockSubs = Array.from({ length: 8 }, (_, i) => ({
  id: `SUB-${String(i + 1).padStart(4, '0')}`,
  user: ['alex.chen', 'sarah.k', 'mike.r', 'priya.p', 'james.w', 'emily.d', 'omar.h', 'anya.s'][i],
  plan: ['Pro', 'Basic', 'Unlimited', 'Pro', 'Pro', 'Basic', 'Unlimited', 'Pro'][i],
  billing: ['Monthly', 'Yearly', 'Monthly', 'Yearly', 'Monthly', 'Monthly', 'Yearly', 'Yearly'][i],
  amount: [79, 290, 149, 790, 79, 29, 1490, 790][i],
  startDate: `2026-01-${String(i + 1).padStart(2, '0')}`,
  status: ['Active', 'Active', 'Active', 'Active', 'Cancelled', 'Active', 'Active', 'Trial'][i],
}));

const AdminSubscriptionsPage = () => {
  const activeCount = mockSubs.filter(s => s.status === 'Active').length;
  const mrr = mockSubs.filter(s => s.status === 'Active').reduce((sum, s) => sum + (s.billing === 'Monthly' ? s.amount : Math.round(s.amount / 12)), 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Subscriptions</h1>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Active Subs', value: activeCount, icon: Users, color: 'text-green-400' },
          { label: 'MRR', value: `$${mrr}`, icon: TrendingUp, color: 'text-primary' },
          { label: 'Total Subs', value: mockSubs.length, icon: CreditCard, color: 'text-foreground' },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Sub ID</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">User</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Plan</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Billing</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Amount</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Since</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {mockSubs.map(s => (
              <tr key={s.id} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{s.id}</td>
                <td className="px-4 py-3 text-foreground">{s.user}</td>
                <td className="px-4 py-3 font-medium text-foreground">{s.plan}</td>
                <td className="px-4 py-3 text-muted-foreground">{s.billing}</td>
                <td className="px-4 py-3 text-foreground">${s.amount}</td>
                <td className="px-4 py-3 text-muted-foreground">{s.startDate}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                    s.status === 'Active' ? 'bg-green-500/20 text-green-400' :
                    s.status === 'Trial' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-secondary text-muted-foreground'
                  }`}>
                    {s.status}
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

export default AdminSubscriptionsPage;
