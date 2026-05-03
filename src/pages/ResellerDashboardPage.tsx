import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, DollarSign, Users, Package, ArrowUpRight, ArrowDownRight, Store, CreditCard, Eye } from 'lucide-react';
import {
  Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
  Bar, BarChart,
} from 'recharts';

const tt = {
  contentStyle: { background: '#fff', border: '1px solid #e1e3e5', borderRadius: 8, fontSize: 12, boxShadow: '0 4px 14px rgba(0,0,0,0.08)' },
  labelStyle: { color: '#6d7175' },
  itemStyle: { color: '#1a1a1a' },
};

const earningsData = Array.from({ length: 12 }, (_, i) => ({
  month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
  earnings: Math.floor(800 + Math.random() * 2200),
  referrals: Math.floor(3 + Math.random() * 12),
}));

const appPerformance = [
  { name: 'EduFlow Pro', installs: 45, revenue: 1240, rating: 4.8 },
  { name: 'ShopEngine', installs: 38, revenue: 980, rating: 4.6 },
  { name: 'MediCore 360', installs: 22, revenue: 760, rating: 4.9 },
  { name: 'HotelNest', installs: 15, revenue: 420, rating: 4.3 },
  { name: 'AnalyticsHub', installs: 31, revenue: 890, rating: 4.7 },
];

const recentActivity = [
  { action: 'New referral signup', detail: 'Rahul Sharma signed up via your link', time: '2 hours ago', type: 'success' },
  { action: 'Commission earned', detail: '$87.00 from EduFlow Pro subscription', time: '5 hours ago', type: 'earning' },
  { action: 'App review received', detail: 'ShopEngine rated 5 stars by user', time: '1 day ago', type: 'info' },
  { action: 'Payout processed', detail: '$532.00 sent to your bank account', time: '3 days ago', type: 'payout' },
  { action: 'New client onboarded', detail: 'Carlos Torres activated MediCore 360', time: '4 days ago', type: 'success' },
];

const ResellerDashboardPage = () => {
  const [period] = useState('This month');
  const navigate = useNavigate();
  const quickActionRoutes = ['/reseller/products', '/reseller/leads', '/reseller/earnings'];

  const kpis = [
    { label: 'Total Earnings', value: '$12,480', change: '+18.2%', up: true, icon: DollarSign, iconBg: '#e4f3e8', iconColor: '#008060' },
    { label: 'Active Referrals', value: '64', change: '+7', up: true, icon: Users, iconBg: '#e0f0ff', iconColor: '#0070f3' },
    { label: 'Managed Stores', value: '12', change: '+2', up: true, icon: Store, iconBg: '#fef3e0', iconColor: '#b98900' },
    { label: 'App Installs', value: '151', change: '-3.1%', up: false, icon: Package, iconBg: '#fce4ec', iconColor: '#d32f2f' },
  ];

  return (
    <div className="space-y-6 max-w-[1200px]">
      {/* Welcome */}
      <div>
        <h2 className="text-xl font-semibold" style={{ color: '#1a1a1a' }}>Good morning, Partner 👋</h2>
        <p className="text-sm mt-0.5" style={{ color: '#6d7175' }}>Here's what's happening with your partner account today.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(k => (
          <div key={k.label} className="bg-white rounded-xl border p-5 hover:shadow-md transition-shadow" style={{ borderColor: '#e1e3e5' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: k.iconBg }}>
                <k.icon className="h-5 w-5" style={{ color: k.iconColor }} />
              </div>
              <div className={`flex items-center gap-0.5 text-xs font-medium ${k.up ? 'text-green-600' : 'text-red-500'}`}>
                {k.up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                {k.change}
              </div>
            </div>
            <p className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>{k.value}</p>
            <p className="text-xs mt-0.5" style={{ color: '#6d7175' }}>{k.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Earnings Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border p-5" style={{ borderColor: '#e1e3e5' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold" style={{ color: '#1a1a1a' }}>Earnings Overview</h3>
              <p className="text-xs" style={{ color: '#6d7175' }}>{period}</p>
            </div>
            <div className="flex gap-1">
              {['7d', '30d', '90d', '12m'].map(p => (
                <button key={p} className="px-2.5 py-1 rounded-md text-xs font-medium transition-colors" style={{
                  background: p === '12m' ? '#008060' : 'transparent',
                  color: p === '12m' ? 'white' : '#6d7175',
                }}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={earningsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6d7175' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6d7175' }} tickLine={false} axisLine={false} tickFormatter={v => `$${v}`} />
              <Tooltip {...tt} />
              <defs>
                <linearGradient id="earnGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#008060" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#008060" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="earnings" stroke="#008060" strokeWidth={2} fill="url(#earnGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border p-5" style={{ borderColor: '#e1e3e5' }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: '#1a1a1a' }}>Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex gap-3">
                <div className="mt-0.5">
                  <div className="h-2 w-2 rounded-full" style={{
                    background: a.type === 'success' ? '#008060' : a.type === 'earning' ? '#b98900' : a.type === 'payout' ? '#0070f3' : '#6d7175'
                  }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium leading-tight" style={{ color: '#1a1a1a' }}>{a.action}</p>
                  <p className="text-[11px] leading-tight mt-0.5" style={{ color: '#6d7175' }}>{a.detail}</p>
                  <p className="text-[10px] mt-1" style={{ color: '#8c9196' }}>{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* App Performance Table */}
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: '#e1e3e5' }}>
        <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: '#e1e3e5' }}>
          <h3 className="text-sm font-semibold" style={{ color: '#1a1a1a' }}>App Performance</h3>
          <button onClick={() => navigate('/reseller/products')} className="text-xs font-medium" style={{ color: '#008060' }}>View all →</button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: '#fafbfb', borderBottom: '1px solid #e1e3e5' }}>
              <th className="px-5 py-2.5 text-left text-xs font-medium" style={{ color: '#6d7175' }}>App</th>
              <th className="px-5 py-2.5 text-left text-xs font-medium" style={{ color: '#6d7175' }}>Installs</th>
              <th className="px-5 py-2.5 text-left text-xs font-medium" style={{ color: '#6d7175' }}>Revenue</th>
              <th className="px-5 py-2.5 text-left text-xs font-medium" style={{ color: '#6d7175' }}>Rating</th>
            </tr>
          </thead>
          <tbody>
            {appPerformance.map((app, i) => (
              <tr key={i} className="border-b last:border-0 hover:bg-gray-50/50 transition-colors" style={{ borderColor: '#f1f1f1' }}>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{ background: '#008060' }}>
                      {app.name[0]}
                    </div>
                    <span className="font-medium text-[13px]" style={{ color: '#1a1a1a' }}>{app.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-[13px]" style={{ color: '#1a1a1a' }}>{app.installs}</td>
                <td className="px-5 py-3 text-[13px] font-medium" style={{ color: '#1a1a1a' }}>${app.revenue.toLocaleString()}</td>
                <td className="px-5 py-3">
                  <span className="inline-flex items-center gap-1 text-[13px]">
                    <span style={{ color: '#b98900' }}>★</span>
                    <span style={{ color: '#1a1a1a' }}>{app.rating}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { title: 'Add a new app', desc: 'Submit your app to the marketplace', icon: Package, color: '#008060' },
          { title: 'Invite a client', desc: 'Send referral link to a new merchant', icon: Users, color: '#0070f3' },
          { title: 'View payouts', desc: 'Check your earnings and payment history', icon: CreditCard, color: '#b98900' },
        ].map((action, i) => (
          <button key={i} onClick={() => navigate(quickActionRoutes[i])} className="bg-white rounded-xl border p-5 text-left hover:shadow-md transition-all group" style={{ borderColor: '#e1e3e5' }}>
            <div className="h-10 w-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${action.color}15` }}>
              <action.icon className="h-5 w-5" style={{ color: action.color }} />
            </div>
            <p className="text-[13px] font-semibold group-hover:underline" style={{ color: '#1a1a1a' }}>{action.title}</p>
            <p className="text-[12px] mt-0.5" style={{ color: '#6d7175' }}>{action.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ResellerDashboardPage;
