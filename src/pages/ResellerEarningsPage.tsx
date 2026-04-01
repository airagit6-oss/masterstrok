import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { MetricPanel } from '@/components/dashboard/MetricPanel';
import { generateTimeSeries } from '@/lib/mockData';
import {
  Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
  Bar, BarChart,
} from 'recharts';

const tt = {
  contentStyle: { background: 'hsl(215,28%,9%)', border: '1px solid hsl(215,18%,14%)', borderRadius: 6, fontSize: 12 },
  labelStyle: { color: 'hsl(210,20%,88%)' },
  itemStyle: { color: 'hsl(210,20%,75%)' },
};

interface EarningEntry {
  id: string;
  source: string;
  type: 'Commission' | 'Referral Bonus';
  amount: number;
  date: string;
  status: 'Paid' | 'Pending';
}

const earningsHistory: EarningEntry[] = [
  { id: 'e1', source: 'Alex Chen → EduFlow Pro', type: 'Commission', amount: 87, date: '2026-03-28', status: 'Paid' },
  { id: 'e2', source: 'Sarah Kumar → ShopEngine', type: 'Commission', amount: 45, date: '2026-03-25', status: 'Paid' },
  { id: 'e3', source: 'Mike Ross → MediCore 360', type: 'Commission', amount: 120, date: '2026-03-20', status: 'Pending' },
  { id: 'e4', source: 'Priya Patel → HotelNest', type: 'Commission', amount: 68, date: '2026-03-15', status: 'Paid' },
  { id: 'e5', source: 'New Referral Signup × 3', type: 'Referral Bonus', amount: 30, date: '2026-03-10', status: 'Paid' },
  { id: 'e6', source: 'James Wilson → AnalyticsHub', type: 'Commission', amount: 95, date: '2026-03-08', status: 'Paid' },
  { id: 'e7', source: 'Emily Davis → EduFlow Pro', type: 'Commission', amount: 87, date: '2026-03-05', status: 'Paid' },
];

const revenueData = generateTimeSeries(30, 200, 800);
const commissionByProduct = [
  { name: 'EduFlow', value: 174 },
  { name: 'MediCore', value: 120 },
  { name: 'ShopEngine', value: 45 },
  { name: 'HotelNest', value: 68 },
  { name: 'Analytics', value: 95 },
];

const ResellerEarningsPage = () => {
  const [copied, setCopied] = useState(false);
  const referralLink = 'https://saashub.io/ref/MYCODE123';

  const totalEarned = earningsHistory.reduce((s, e) => s + e.amount, 0);
  const pending = earningsHistory.filter(e => e.status === 'Pending').reduce((s, e) => s + e.amount, 0);
  const paid = totalEarned - pending;
  const referralCount = earningsHistory.filter(e => e.type === 'Referral Bonus').length;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Earnings</h1>
        <p className="text-sm text-muted-foreground mt-1">Track your commissions, referrals, and revenue</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Total Earned', value: `$${totalEarned}`, color: 'text-foreground' },
          { label: 'Paid Out', value: `$${paid}`, color: 'text-green-400' },
          { label: 'Pending', value: `$${pending}`, color: 'text-yellow-400' },
          { label: 'Referral Sales', value: referralCount.toString(), color: 'text-primary' },
        ].map(k => (
          <div key={k.label} className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">{k.label}</p>
            <p className={`text-2xl font-bold mt-1 ${k.color}`}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Referral Link */}
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-sm font-semibold text-foreground mb-2">Your Referral Link</p>
        <div className="flex items-center gap-2">
          <code className="flex-1 rounded-lg bg-secondary px-3 py-2 text-sm text-muted-foreground font-mono truncate">
            {referralLink}
          </code>
          <button
            onClick={copyLink}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent transition-colors"
          >
            {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">Earn 30% commission on every sale made through your link</p>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4">
        <MetricPanel title="Revenue Over Time ($)">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215,18%,14%)" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'hsl(215,15%,50%)' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(215,15%,50%)' }} tickLine={false} axisLine={false} />
              <Tooltip {...tt} />
              <defs>
                <linearGradient id="earnGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(142,71%,45%)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(142,71%,45%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="value" stroke="hsl(142,71%,45%)" strokeWidth={2} fill="url(#earnGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </MetricPanel>

        <MetricPanel title="Commission by Product ($)">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={commissionByProduct}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215,18%,14%)" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(215,15%,50%)' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(215,15%,50%)' }} tickLine={false} axisLine={false} />
              <Tooltip {...tt} />
              <Bar dataKey="value" fill="hsl(270,70%,60%)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </MetricPanel>
      </div>

      {/* Earnings History */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="font-semibold text-foreground">Earnings History</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Source</th>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Type</th>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Amount</th>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Date</th>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {earningsHistory.map(e => (
              <tr key={e.id} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                <td className="px-4 py-2.5 text-foreground">{e.source}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{e.type}</td>
                <td className="px-4 py-2.5 font-semibold text-foreground">${e.amount}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{e.date}</td>
                <td className="px-4 py-2.5">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                    e.status === 'Paid' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {e.status}
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

export default ResellerEarningsPage;
