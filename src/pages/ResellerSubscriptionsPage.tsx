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

const statusColors: Record<SubStatus, string> = {
  Active: 'bg-green-500/20 text-green-400',
  Expired: 'bg-red-500/20 text-red-400',
  Disabled: 'bg-secondary text-muted-foreground',
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
    const newSub: Subscription = {
      ...form,
      id: `s${Date.now()}`,
      status: 'Active',
    };
    setSubs(prev => [newSub, ...prev]);
    audit.updateSubscription(resellerId, userId, newSub.id, { action: 'create', product: newSub.productName, plan: newSub.plan });
    setForm(emptyForm());
    setShowModal(false);
  };

  const active = subs.filter(s => s.status === 'Active').length;
  const expired = subs.filter(s => s.status === 'Expired').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Subscriptions</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage user subscriptions and access control</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create Subscription
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Subscriptions</p>
          <p className="text-2xl font-bold text-foreground mt-1">{subs.length}</p>
        </div>
        <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4">
          <p className="text-sm text-muted-foreground">Active</p>
          <p className="text-2xl font-bold text-green-400 mt-1">{active}</p>
        </div>
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
          <p className="text-sm text-muted-foreground">Expired</p>
          <p className="text-2xl font-bold text-red-400 mt-1">{expired}</p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">User</th>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Product</th>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Plan</th>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Start</th>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Expiry</th>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {subs.map(s => (
              <tr key={s.id} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground">{s.userName}</p>
                  <p className="text-xs text-muted-foreground">{s.userEmail}</p>
                </td>
                <td className="px-4 py-3 text-foreground">{s.productName}</td>
                <td className="px-4 py-3 text-muted-foreground">{s.plan}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[s.status]}`}>
                    {s.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{s.startDate}</td>
                <td className="px-4 py-3 text-muted-foreground">{s.expiryDate}</td>
                <td className="px-4 py-3">
                  {s.status !== 'Expired' && (
                    <button
                      onClick={() => toggleStatus(s.id)}
                      className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                        s.status === 'Active'
                          ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                          : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                      }`}
                    >
                      {s.status === 'Active' ? <PowerOff className="h-3 w-3" /> : <Power className="h-3 w-3" />}
                      {s.status === 'Active' ? 'Disable' : 'Enable'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Subscription Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-foreground mb-4">Create Subscription</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">User Name</label>
                <input
                  type="text"
                  placeholder="Select or type user name"
                  list="user-list"
                  value={form.userName}
                  onChange={e => setForm(prev => ({ ...prev, userName: e.target.value }))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <datalist id="user-list">
                  {mockUsers.map(u => <option key={u} value={u} />)}
                </datalist>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">User Email</label>
                <input
                  type="email"
                  placeholder="user@example.com"
                  value={form.userEmail}
                  onChange={e => setForm(prev => ({ ...prev, userEmail: e.target.value }))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Product</label>
                <select
                  value={form.productName}
                  onChange={e => setForm(prev => ({ ...prev, productName: e.target.value }))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {products.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Plan</label>
                <select
                  value={form.plan}
                  onChange={e => setForm(prev => ({ ...prev, plan: e.target.value }))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {plans.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Start Date</label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={e => setForm(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={form.expiryDate}
                    onChange={e => setForm(prev => ({ ...prev, expiryDate: e.target.value }))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={addSubscription}
                className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Create
              </button>
              <button
                onClick={() => { setShowModal(false); setForm(emptyForm()); }}
                className="flex-1 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResellerSubscriptionsPage;
