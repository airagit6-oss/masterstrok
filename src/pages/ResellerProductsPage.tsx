import { useState } from 'react';
import { Package, UserCheck, UserX } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  plans: string[];
  assignedUsers: string[];
}

const availableProducts: Product[] = [
  { id: 'prod1', name: 'EduFlow Pro', category: 'Education', description: 'Complete LMS for online education', plans: ['Basic', 'Pro', 'Unlimited'], assignedUsers: ['Alex Chen', 'Emily Davis'] },
  { id: 'prod2', name: 'MediCore 360', category: 'Healthcare', description: 'Patient management & clinic software', plans: ['Pro', 'Enterprise'], assignedUsers: ['Sarah Kumar'] },
  { id: 'prod3', name: 'ShopEngine', category: 'E-Commerce', description: 'Full-stack ecommerce platform', plans: ['Basic', 'Pro', 'Unlimited'], assignedUsers: ['Mike Ross', 'Priya Patel', 'Omar Hassan'] },
  { id: 'prod4', name: 'HotelNest', category: 'Hospitality', description: 'Property management system', plans: ['Pro', 'Unlimited'], assignedUsers: [] },
  { id: 'prod5', name: 'AnalyticsHub', category: 'Analytics', description: 'Business intelligence dashboard', plans: ['Basic', 'Pro'], assignedUsers: ['James Wilson'] },
];

const mockUserList = ['Alex Chen', 'Sarah Kumar', 'Mike Ross', 'Priya Patel', 'James Wilson', 'Emily Davis', 'Omar Hassan', 'Anya Singh'];

const ResellerProductsPage = () => {
  const [products, setProducts] = useState<Product[]>(availableProducts);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [assignModal, setAssignModal] = useState<{ productId: string; productName: string } | null>(null);
  const [selectedUser, setSelectedUser] = useState('');

  const assignUser = () => {
    if (!selectedUser || !assignModal) return;
    setProducts(prev => prev.map(p => {
      if (p.id !== assignModal.productId) return p;
      if (p.assignedUsers.includes(selectedUser)) return p;
      return { ...p, assignedUsers: [...p.assignedUsers, selectedUser] };
    }));
    setSelectedUser('');
    setAssignModal(null);
  };

  const removeUser = (productId: string, user: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id !== productId) return p;
      return { ...p, assignedUsers: p.assignedUsers.filter(u => u !== user) };
    }));
  };

  const totalAssigned = products.reduce((sum, p) => sum + p.assignedUsers.length, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Products</h1>
        <p className="text-sm text-muted-foreground mt-1">Assign products to your users and manage access</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Available Products</p>
          <p className="text-2xl font-bold text-foreground mt-1">{products.length}</p>
        </div>
        <div className="rounded-xl border border-primary/30 bg-primary/10 p-4">
          <p className="text-sm text-muted-foreground">Total Assignments</p>
          <p className="text-2xl font-bold text-primary mt-1">{totalAssigned}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Categories</p>
          <p className="text-2xl font-bold text-foreground mt-1">{new Set(products.map(p => p.category)).size}</p>
        </div>
      </div>

      {/* Product Cards */}
      <div className="space-y-3">
        {products.map(p => (
          <div key={p.id} className="rounded-xl border border-border bg-card overflow-hidden">
            <div
              className="flex items-center gap-4 p-4 cursor-pointer hover:bg-accent/20 transition-colors"
              onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.category} · {p.description}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {p.plans.map(plan => (
                    <span key={plan} className="rounded-full px-2 py-0.5 text-xs font-medium bg-secondary text-muted-foreground">{plan}</span>
                  ))}
                </div>
                <span className="rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary/20 text-primary">
                  {p.assignedUsers.length} users
                </span>
                <span className="text-muted-foreground text-sm">{expandedId === p.id ? '▲' : '▼'}</span>
              </div>
            </div>

            {expandedId === p.id && (
              <div className="border-t border-border px-4 pb-4 pt-3">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-foreground">Assigned Users</p>
                  <button
                    onClick={() => setAssignModal({ productId: p.id, productName: p.name })}
                    className="flex items-center gap-1.5 rounded-lg bg-primary/10 text-primary px-3 py-1.5 text-xs font-medium hover:bg-primary/20 transition-colors"
                  >
                    <UserCheck className="h-3.5 w-3.5" />
                    Assign User
                  </button>
                </div>
                {p.assignedUsers.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No users assigned yet</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {p.assignedUsers.map(user => (
                      <div key={user} className="flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1">
                        <span className="text-xs text-foreground">{user}</span>
                        <button
                          onClick={() => removeUser(p.id, user)}
                          className="text-muted-foreground hover:text-red-400 transition-colors"
                        >
                          <UserX className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Assign User Modal */}
      {assignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-foreground mb-1">Assign User</h2>
            <p className="text-sm text-muted-foreground mb-4">to <span className="text-foreground font-medium">{assignModal.productName}</span></p>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Select User</label>
              <select
                value={selectedUser}
                onChange={e => setSelectedUser(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">— choose user —</option>
                {mockUserList.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={assignUser}
                disabled={!selectedUser}
                className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Assign
              </button>
              <button
                onClick={() => { setAssignModal(null); setSelectedUser(''); }}
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

export default ResellerProductsPage;
