import { useState } from 'react';
import { Copy, Check, Download, ArrowUpRight } from 'lucide-react';
import { toast } from 'sonner';
import {
  Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
  Bar, BarChart,
} from 'recharts';

const tt = {
  contentStyle: { background: '#fff', border: '1px solid #e1e3e5', borderRadius: 8, fontSize: 12, boxShadow: '0 4px 14px rgba(0,0,0,0.08)' },
  labelStyle: { color: '#6d7175' },
  itemStyle: { color: '#1a1a1a' },
};

interface EarningEntry {
  id: string;
  source: string;
  type: 'App earnings' | 'Referral bonus' | 'Theme earnings';
  amount: number;
  date: string;
  status: 'Paid' | 'Pending' | 'Processing';
}

const earningsHistory: EarningEntry[] = [
  { id: 'e1', source: 'Alex Chen → EduFlow Pro', type: 'App earnings', amount: 87, date: '2026-03-28', status: 'Paid' },
  { id: 'e2', source: 'Sarah Kumar → ShopEngine', type: 'App earnings', amount: 45, date: '2026-03-25', status: 'Paid' },
  { id: 'e3', source: 'Mike Ross → MediCore 360', type: 'App earnings', amount: 120, date: '2026-03-20', status: 'Processing' },
  { id: 'e4', source: 'Priya Patel → HotelNest', type: 'App earnings', amount: 68, date: '2026-03-15', status: 'Paid' },
  { id: 'e5', source: 'New Referral Signup × 3', type: 'Referral bonus', amount: 30, date: '2026-03-10', status: 'Paid' },
  { id: 'e6', source: 'James Wilson → AnalyticsHub', type: 'App earnings', amount: 95, date: '2026-03-08', status: 'Paid' },
  { id: 'e7', source: 'Emily Davis → EduFlow Pro', type: 'App earnings', amount: 87, date: '2026-03-05', status: 'Pending' },
];

const revenueData = Array.from({ length: 12 }, (_, i) => ({
  month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
  value: Math.floor(400 + Math.random() * 800),
}));

const byType = [
  { name: 'App earnings', value: 502 },
  { name: 'Referral bonus', value: 30 },
  { name: 'Theme earnings', value: 0 },
];

const statusStyles: Record<string, { bg: string; text: string }> = {
  Paid: { bg: '#e4f3e8', text: '#008060' },
  Pending: { bg: '#fef3e0', text: '#b98900' },
  Processing: { bg: '#e0f0ff', text: '#0070f3' },
};

const ResellerEarningsPage = () => {
  const [copied, setCopied] = useState(false);
  const referralLink = 'https://saashub.io/ref/MYCODE123';

  const totalEarned = earningsHistory.reduce((s, e) => s + e.amount, 0);
  const pending = earningsHistory.filter(e => e.status !== 'Paid').reduce((s, e) => s + e.amount, 0);
  const paid = totalEarned - pending;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5 max-w-[1200px]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold" style={{ color: '#1a1a1a' }}>Payouts</h2>
          <p className="text-sm mt-0.5" style={{ color: '#6d7175' }}>Track your earnings, commissions, and payment history</p>
        </div>
        <button
          onClick={() => {
            const csv = ['Source,Type,Amount,Date,Status', ...earningsHistory.map(e => `"${e.source}",${e.type},${e.amount},${e.date},${e.status}`)].join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = 'payouts.csv'; a.click();
            URL.revokeObjectURL(url);
            toast.success('Payouts exported');
          }}
          className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
          style={{ borderColor: '#c9cccf', color: '#1a1a1a' }}
        >
          <Download className="h-4 w-4" />
          Export
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Earned', value: `$${totalEarned}`, sub: 'All time', color: '#1a1a1a' },
          { label: 'Paid Out', value: `$${paid}`, sub: 'Completed payouts', color: '#008060' },
          { label: 'Pending', value: `$${pending}`, sub: 'Processing & pending', color: '#b98900' },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl border p-5" style={{ borderColor: '#e1e3e5' }}>
            <p className="text-xs font-medium" style={{ color: '#6d7175' }}>{k.label}</p>
            <p className="text-2xl font-bold mt-1" style={{ color: k.color }}>{k.value}</p>
            <p className="text-[11px] mt-0.5" style={{ color: '#8c9196' }}>{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Referral Link */}
      <div className="bg-white rounded-xl border p-5" style={{ borderColor: '#e1e3e5' }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-semibold" style={{ color: '#1a1a1a' }}>Your Referral Link</p>
            <p className="text-xs" style={{ color: '#6d7175' }}>Earn 30% commission on every sale</p>
          </div>
          <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ background: '#e4f3e8', color: '#008060' }}>30% commission</span>
        </div>
        <div className="flex items-center gap-2">
          <code className="flex-1 rounded-lg px-3 py-2.5 text-sm font-mono truncate" style={{ background: '#f6f6f7', color: '#6d7175' }}>
            {referralLink}
          </code>
          <button
            onClick={copyLink}
            className="flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors"
            style={{ background: '#008060' }}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border p-5" style={{ borderColor: '#e1e3e5' }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: '#1a1a1a' }}>Earnings Over Time</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6d7175' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6d7175' }} tickLine={false} axisLine={false} tickFormatter={v => `$${v}`} />
              <Tooltip {...tt} />
              <defs>
                <linearGradient id="payoutGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#008060" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#008060" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="value" stroke="#008060" strokeWidth={2} fill="url(#payoutGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border p-5" style={{ borderColor: '#e1e3e5' }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: '#1a1a1a' }}>Earnings by Type</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={byType}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6d7175' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6d7175' }} tickLine={false} axisLine={false} tickFormatter={v => `$${v}`} />
              <Tooltip {...tt} />
              <Bar dataKey="value" fill="#008060" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: '#e1e3e5' }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: '#e1e3e5' }}>
          <h3 className="text-sm font-semibold" style={{ color: '#1a1a1a' }}>Transaction History</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: '#fafbfb', borderBottom: '1px solid #e1e3e5' }}>
              <th className="px-5 py-2.5 text-left text-xs font-medium" style={{ color: '#6d7175' }}>Source</th>
              <th className="px-5 py-2.5 text-left text-xs font-medium" style={{ color: '#6d7175' }}>Type</th>
              <th className="px-5 py-2.5 text-left text-xs font-medium" style={{ color: '#6d7175' }}>Amount</th>
              <th className="px-5 py-2.5 text-left text-xs font-medium" style={{ color: '#6d7175' }}>Date</th>
              <th className="px-5 py-2.5 text-left text-xs font-medium" style={{ color: '#6d7175' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {earningsHistory.map(e => {
              const st = statusStyles[e.status];
              return (
                <tr key={e.id} className="border-b last:border-0 hover:bg-gray-50/50 transition-colors" style={{ borderColor: '#f1f1f1' }}>
                  <td className="px-5 py-3 text-[13px] font-medium" style={{ color: '#1a1a1a' }}>{e.source}</td>
                  <td className="px-5 py-3 text-[13px]" style={{ color: '#6d7175' }}>{e.type}</td>
                  <td className="px-5 py-3 text-[13px] font-semibold" style={{ color: '#1a1a1a' }}>${e.amount}</td>
                  <td className="px-5 py-3 text-[13px]" style={{ color: '#6d7175' }}>{e.date}</td>
                  <td className="px-5 py-3">
                    <span className="rounded-full px-2.5 py-1 text-xs font-medium" style={{ background: st.bg, color: st.text }}>{e.status}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResellerEarningsPage;
