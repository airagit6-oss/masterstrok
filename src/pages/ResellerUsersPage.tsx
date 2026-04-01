import { useState } from 'react';
import { UserPlus, Power, PowerOff, Package } from 'lucide-react';
import { useReseller, ManagedUser } from '@/contexts/ResellerContext';

const PRODUCTS = ['EduFlow Pro', 'MediCore 360', 'ShopEngine', 'HotelNest', 'AnalyticsHub'];
const PLANS = ['Basic', 'Pro', 'Unlimited'];

const emptyForm = () => ({ name: '', email: '', phone: '', plan: 'Basic', assignedProduct: PRODUCTS[0] });

const ResellerUsersPage = () => {
  const { managedUsers, createUser, toggleUserStatus, assignProduct } = useReseller();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [assignModal, setAssignModal] = useState<ManagedUser | null>(null);
  const [assignForm, setAssignForm] = useState({ product: PRODUCTS[0], plan: 'Basic' });

  const activeCount = managedUsers.filter(u => u.status === 'Active').length;

  const handleCreate = () => {
    if (!form.name || !form.email) return;
    createUser(form);
    setForm(emptyForm());
    setShowModal(false);
  };

  const handleAssign = () => {
    if (!assignModal) return;
    assignProduct(assignModal.id, assignForm.product, assignForm.plan);
    setAssignModal(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Create users, assign products and control access</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <UserPlus className="h-4 w-4" />
          Create User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Users</p>
          <p className="text-2xl font-bold text-foreground mt-1">{managedUsers.length}</p>
        </div>
        <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4">
          <p className="text-sm text-muted-foreground">Active</p>
          <p className="text-2xl font-bold text-green-400 mt-1">{activeCount}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Inactive</p>
          <p className="text-2xl font-bold text-muted-foreground mt-1">{managedUsers.length - activeCount}</p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">User</th>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Phone</th>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Product</th>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Plan</th>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Created</th>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {managedUsers.map(u => (
              <tr key={u.id} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground">{u.name}</p>
                  <p className="text-xs text-muted-foreground">{u.email}</p>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{u.phone || '—'}</td>
                <td className="px-4 py-3 text-foreground">{u.assignedProduct}</td>
                <td className="px-4 py-3 text-muted-foreground">{u.plan}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                    u.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-secondary text-muted-foreground'
                  }`}>
                    {u.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{u.createdAt}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setAssignModal(u);
                        setAssignForm({ product: u.assignedProduct, plan: u.plan });
                      }}
                      className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                      title="Assign Product"
                    >
                      <Package className="h-3 w-3" />
                      Assign
                    </button>
                    <button
                      onClick={() => toggleUserStatus(u.id)}
                      className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition-colors ${
                        u.status === 'Active'
                          ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                          : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                      }`}
                      title={u.status === 'Active' ? 'Deactivate' : 'Activate'}
                    >
                      {u.status === 'Active' ? <PowerOff className="h-3 w-3" /> : <Power className="h-3 w-3" />}
                      {u.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {managedUsers.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  No users yet. Create your first user.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-foreground mb-4">Create New User</h2>
            <div className="space-y-3">
              {([
                { label: 'Full Name', key: 'name', type: 'text', placeholder: 'John Smith' },
                { label: 'Email', key: 'email', type: 'email', placeholder: 'user@example.com' },
                { label: 'Phone', key: 'phone', type: 'text', placeholder: '+1-555-0000' },
              ] as const).map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">{f.label}</label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    value={form[f.key]}
                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Assign Product</label>
                <select
                  value={form.assignedProduct}
                  onChange={e => setForm(prev => ({ ...prev, assignedProduct: e.target.value }))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {PRODUCTS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Plan</label>
                <select
                  value={form.plan}
                  onChange={e => setForm(prev => ({ ...prev, plan: e.target.value }))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {PLANS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={handleCreate}
                disabled={!form.name || !form.email}
                className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Create User
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

      {/* Assign Product Modal */}
      {assignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-foreground mb-1">Assign Product</h2>
            <p className="text-sm text-muted-foreground mb-4">
              for <span className="text-foreground font-medium">{assignModal.name}</span>
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Product</label>
                <select
                  value={assignForm.product}
                  onChange={e => setAssignForm(prev => ({ ...prev, product: e.target.value }))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {PRODUCTS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Plan</label>
                <select
                  value={assignForm.plan}
                  onChange={e => setAssignForm(prev => ({ ...prev, plan: e.target.value }))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {PLANS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={handleAssign}
                className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => setAssignModal(null)}
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

export default ResellerUsersPage;

