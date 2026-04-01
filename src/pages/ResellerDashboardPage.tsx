import { useState } from 'react';
import { TrendingUp, DollarSign, Users, ShoppingBag, Activity } from 'lucide-react';
import { MetricPanel } from '@/components/dashboard/MetricPanel';
import { generateTimeSeries } from '@/lib/mockData';
import {
  Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
  Line, LineChart,
} from 'recharts';

const tt = {
  contentStyle: { background: 'hsl(215,28%,9%)', border: '1px solid hsl(215,18%,14%)', borderRadius: 6, fontSize: 12 },
  labelStyle: { color: 'hsl(210,20%,88%)' },
  itemStyle: { color: 'hsl(210,20%,75%)' },
};

const kpis = [
  { label: 'Total Leads', value: '64', icon: Users, change: '+7 this week', color: 'text-blue-400' },
  { label: 'Active Users', value: '47', icon: Users, change: '+5 this month', color: 'text-green-400' },
  { label: 'Conversion Rate', value: '28%', icon: Activity, change: '+3% vs last month', color: 'text-purple-400' },
  { label: 'Revenue', value: '$1,240', icon: DollarSign, change: '+12% this month', color: 'text-yellow-400' },
  { label: 'Active Subs', value: '4', icon: ShoppingBag, change: '2 expiring soon', color: 'text-primary' },
];

const recentCommissions = [
  { user: 'john_doe', product: 'EduFlow Pro', amount: 87, date: '2026-03-28', status: 'Paid' },
  { user: 'sarah_k', product: 'MediCore 360', amount: 45, date: '2026-03-25', status: 'Paid' },
  { user: 'mike_r', product: 'ShopEngine', amount: 120, date: '2026-03-20', status: 'Pending' },
  { user: 'priya_p', product: 'HotelNest', amount: 68, date: '2026-03-15', status: 'Paid' },
];

const leadsData = generateTimeSeries(30, 2, 12);
const revenueData = generateTimeSeries(30, 150, 600);
const conversionData = generateTimeSeries(30, 15, 45);

const ResellerDashboardPage = () => {
  const [_leads] = useState(leadsData);
  const [_revenue] = useState(revenueData);
  const [_conversion] = useState(conversionData);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reseller Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Your leads, users, and revenue at a glance</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {kpis.map(k => (
          <div key={k.label} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{k.label}</p>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                <k.icon className="h-3.5 w-3.5 text-primary" />
              </div>
            </div>
            <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{k.change}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-3 gap-4">
        <MetricPanel title="Leads Over Time">
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={_leads}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215,18%,14%)" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'hsl(215,15%,50%)' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(215,15%,50%)' }} tickLine={false} axisLine={false} />
              <Tooltip {...tt} />
              <defs>
                <linearGradient id="leadsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(210,100%,56%)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(210,100%,56%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="value" stroke="hsl(210,100%,56%)" strokeWidth={2} fill="url(#leadsGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </MetricPanel>

        <MetricPanel title="Revenue ($)">
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={_revenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215,18%,14%)" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'hsl(215,15%,50%)' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(215,15%,50%)' }} tickLine={false} axisLine={false} />
              <Tooltip {...tt} />
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(142,71%,45%)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(142,71%,45%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="value" stroke="hsl(142,71%,45%)" strokeWidth={2} fill="url(#revenueGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </MetricPanel>

        <MetricPanel title="Conversion Rate (%)">
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={_conversion}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215,18%,14%)" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'hsl(215,15%,50%)' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(215,15%,50%)' }} tickLine={false} axisLine={false} />
              <Tooltip {...tt} />
              <Line type="monotone" dataKey="value" stroke="hsl(270,70%,60%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </MetricPanel>
      </div>

      {/* Recent Commissions */}
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
