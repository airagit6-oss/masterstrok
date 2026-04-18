import { Percent, TrendingUp, DollarSign } from 'lucide-react';

const ResellerCommissionsPage = () => (
  <div>
    <h1 className="text-2xl font-bold mb-1" style={{ color: '#1a1a1a' }}>Commissions</h1>
    <p className="text-sm mb-6" style={{ color: '#6d7175' }}>Track your commission rates and earnings.</p>
    <div className="grid grid-cols-3 gap-4 mb-6">
      {[
        { icon: Percent, label: 'Commission rate', value: '25%' },
        { icon: DollarSign, label: 'This month', value: '$2,840' },
        { icon: TrendingUp, label: 'Lifetime', value: '$48,231' },
      ].map(s => (
        <div key={s.label} className="rounded-lg bg-white border p-4" style={{ borderColor: '#e1e3e5' }}>
          <s.icon className="h-5 w-5 mb-2" style={{ color: '#008060' }} />
          <p className="text-xs" style={{ color: '#6d7175' }}>{s.label}</p>
          <p className="text-2xl font-bold mt-1" style={{ color: '#1a1a1a' }}>{s.value}</p>
        </div>
      ))}
    </div>
    <div className="rounded-lg bg-white border" style={{ borderColor: '#e1e3e5' }}>
      <div className="px-5 py-4 border-b" style={{ borderColor: '#e1e3e5' }}>
        <h2 className="text-sm font-semibold" style={{ color: '#1a1a1a' }}>Recent commissions</h2>
      </div>
      <div className="divide-y" style={{ borderColor: '#e1e3e5' }}>
        {[
          { id: 'COM-001', client: 'Acme Corp', plan: 'Pro', amount: '$72.50', date: 'Apr 12' },
          { id: 'COM-002', client: 'Globex', plan: 'Starter', amount: '$24.00', date: 'Apr 10' },
          { id: 'COM-003', client: 'Initech', plan: 'Enterprise', amount: '$245.00', date: 'Apr 8' },
        ].map(c => (
          <div key={c.id} className="flex items-center justify-between px-5 py-3">
            <div>
              <p className="text-sm font-medium" style={{ color: '#1a1a1a' }}>{c.client}</p>
              <p className="text-xs" style={{ color: '#6d7175' }}>{c.plan} · {c.date}</p>
            </div>
            <p className="text-sm font-semibold" style={{ color: '#008060' }}>{c.amount}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);
export default ResellerCommissionsPage;
