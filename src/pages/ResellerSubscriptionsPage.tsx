import { useState } from 'react';
import { Plus, Power, PowerOff } from 'lucide-react';
import { audit } from '@/lib/auditLog';
import { useAuth } from '@/contexts/AuthContext';

type SubStatus = 'Active' | 'Expired' | 'Disabled';

interface Subscription {
  id: string;
  userName: string;
  userEmail: string;
  plan: string;
  productName: string;
  status: SubStatus;
  startDate: string;
  expiryDate: string;
}

const initialSubs: Subscription[] = [
  { id: 's1', userName: 'Alex Chen', userEmail: 'alex.chen@example.com', plan: 'Pro', productName: 'EduFlow Pro', status: 'Active', startDate: '2026-01-01', expiryDate: '2026-12-31' },
  { id: 's2', userName: 'Sarah Kumar', userEmail: 'sarah.k@example.com', plan: 'Basic', productName: 'ShopEngine', status: 'Active', startDate: '2026-02-15', expiryDate: '2026-08-15' },
  { id: 's3', userName: 'Mike Ross', userEmail: 'mike.ross@example.com', plan: 'Unlimited', productName: 'MediCore 360', status: 'Expired', startDate: '2025-09-01', expiryDate: '2026-03-01' },
  { id: 's4', userName: 'Priya Patel', userEmail: 'priya.p@example.com', plan: 'Pro', productName: 'HotelNest', status: 'Active', startDate: '2026-03-01', expiryDate: '2027-03-01' },
  { id: 's5', userName: 'James Wilson', userEmail: 'james.w@example.com', plan: 'Basic', productName: 'EduFlow Pro', status: 'Disabled', startDate: '2026-01-15', expiryDate: '2026-07-15' },
];

const statusStyles: Record<SubStatus, { bg: string; text: string }> = {
  Active: { bg: '#e4f3e8', text: '#008060' },
  Expired: { bg: '#fce4ec', text: '#d32f2f' },
  Disabled: { bg: '#f6f6f7', text: '#6d7175' },
};

const plans = ['Basic', 'Pro', 'Unlimited'];
const products = ['EduFlow Pro', 'MediCore 360', 'ShopEngine', 'HotelNest', 'AnalyticsHub'];
const mockUsers = ['Alex Chen', 'Sarah Kumar', 'Mike Ross', 'Priya Patel', 'James Wilson', 'Emily Davis'];

const emptyForm = () => ({
  userName: '', userEmail: '', plan: 'Basic', productName: products[0],
  startDate: new Date().toISOString().split('T')[0],
  expiryDate: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
});

const ResellerSubscriptionsPage = () => {
  const { user } = useAuth();
  const resellerId = user?.id ?? 'anonymous';
  const userId = user?.id ?? 'anonymous';
  const [subs, setSubs] = useState<Subscription[]>(initialSubs);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm());

  const toggleStatus = (id: string) => {
    setSubs(prev => prev.map(s => {
      if (s.id !== id) return s;
      const updated = { ...s, status: s.status === 'Active' ? 'Disabled' : 'Active' } as Subscription;
      audit.updateSubscription(resellerId, userId, id, { status: updated.status });
      return updated;
    }));
  };

  const addSubscription = () => {
    if (!form.userName || !form.userEmail) return;
    const newSub: Subscription = { ...form, id: `s${Date.now()}`, status: 'Active' };
    setSubs(prev => [newSub, ...prev]);
    audit.updateSubscription(resellerId, userId, newSub.id, { action: 'create', product: newSub.productName, plan: newSub.plan });
    setForm(emptyForm());
    setShowModal(false);
  };

  const active = subs.filter(s => s.status === 'Active').length;
  const expired = subs.filter(s => s.status === 'Expired').length;

  return (
    <div className="space-y-5 max-w-[1200px]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold" style={{ color: '#1a1a1a' }}>Subscriptions</h2>
          <p className="text-sm mt-0.5" style={{ color: '#6d7175' }}>Manage client subscriptions and access control</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white" style={{ background: '#008060' }}>
          <Plus className="h-4 w-4" />
          Create subscription
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total', value: subs.length },
          { label: 'Active', value: active, color: '#008060' },
          { label: 'Expired', value: expired, color: '#d32f2f' },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl border p-4" style={{ borderColor: '#e1e3e5' }}>
            <p className="text-xs font-medium" style={{ color: '#6d7175' }}>{k.label}</p>
            <p className="text-2xl font-bold mt-1" style={{ color: k.color ?? '#1a1a1a' }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: '#e1e3e5' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: '#fafbfb', borderBottom: '1px solid #e1e3e5' }}>
              <th className="px-5 py-2.5 text-left text-xs font-medium" style={{ color: '#6d7175' }}>Client</th>
              <th className="px-5 py-2.5 text-left text-xs font-medium" style={{ color: '#6d7175' }}>App</th>
              <th className="px-5 py-2.5 text-left text-xs font-medium" style={{ color: '#6d7175' }}>Plan</th>
              <th className="px-5 py-2.5 text-left text-xs font-medium" style={{ color: '#6d7175' }}>Status</th>
              <th className="px-5 py-2.5 text-left text-xs font-medium" style={{ color: '#6d7175' }}>Start</th>
              <th className="px-5 py-2.5 text-left text-xs font-medium" style={{ color: '#6d7175' }}>Expiry</th>
              <th className="px-5 py-2.5 text-left text-xs font-medium" style={{ color: '#6d7175' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {subs.map(s => {
              const st = statusStyles[s.status];
              return (
                <tr key={s.id} className="border-b last:border-0 hover:bg-gray-50/50 transition-colors" style={{ borderColor: '#f1f1f1' }}>
                  <td className="px-5 py-3">
                    <p className="font-medium text-[13px]" style={{ color: '#1a1a1a' }}>{s.userName}</p>
                    <p className="text-[11px]" style={{ color: '#6d7175' }}>{s.userEmail}</p>
                  </td>
                  <td className="px-5 py-3 text-[13px]" style={{ color: '#1a1a1a' }}>{s.productName}</td>
                  <td className="px-5 py-3">
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ background: '#f6f6f7', color: '#6d7175' }}>{s.plan}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="rounded-full px-2.5 py-1 text-xs font-medium" style={{ background: st.bg, color: st.text }}>{s.status}</span>
                  </td>
                  <td className="px-5 py-3 text-[13px]" style={{ color: '#6d7175' }}>{s.startDate}</td>
                  <td className="px-5 py-3 text-[13px]" style={{ color: '#6d7175' }}>{s.expiryDate}</td>
                  <td className="px-5 py-3">
                    {s.status !== 'Expired' && (
                      <button onClick={() => toggleStatus(s.id)} className="rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors" style={{
                        background: s.status === 'Active' ? '#fce4ec' : '#e4f3e8',
                        color: s.status === 'Active' ? '#d32f2f' : '#008060',
                      }}>
                        {s.status === 'Active' ? 'Disable' : 'Enable'}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Create Subscription</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#6d7175' }}>Client Name</label>
                <input type="text" placeholder="Client name" list="user-list" value={form.userName}
                  onChange={e => setForm(prev => ({ ...prev, userName: e.target.value }))}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2" style={{ borderColor: '#c9cccf', color: '#1a1a1a' }}
                />
                <datalist id="user-list">{mockUsers.map(u => <option key={u} value={u} />)}</datalist>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#6d7175' }}>Email</label>
                <input type="email" placeholder="client@example.com" value={form.userEmail}
                  onChange={e => setForm(prev => ({ ...prev, userEmail: e.target.value }))}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2" style={{ borderColor: '#c9cccf', color: '#1a1a1a' }}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#6d7175' }}>App</label>
                <select value={form.productName} onChange={e => setForm(prev => ({ ...prev, productName: e.target.value }))} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2" style={{ borderColor: '#c9cccf', color: '#1a1a1a' }}>
                  {products.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#6d7175' }}>Plan</label>
                <select value={form.plan} onChange={e => setForm(prev => ({ ...prev, plan: e.target.value }))} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2" style={{ borderColor: '#c9cccf', color: '#1a1a1a' }}>
                  {plans.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: '#6d7175' }}>Start</label>
                  <input type="date" value={form.startDate} onChange={e => setForm(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2" style={{ borderColor: '#c9cccf', color: '#1a1a1a' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: '#6d7175' }}>Expiry</label>
                  <input type="date" value={form.expiryDate} onChange={e => setForm(prev => ({ ...prev, expiryDate: e.target.value }))}
                    className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2" style={{ borderColor: '#c9cccf', color: '#1a1a1a' }}
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={addSubscription} className="flex-1 rounded-lg px-4 py-2 text-sm font-medium text-white" style={{ background: '#008060' }}>Create</button>
              <button onClick={() => { setShowModal(false); setForm(emptyForm()); }} className="flex-1 rounded-lg border px-4 py-2 text-sm font-medium" style={{ borderColor: '#c9cccf', color: '#6d7175' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResellerSubscriptionsPage;
