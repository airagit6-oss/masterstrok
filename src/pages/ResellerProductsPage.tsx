import { useState } from 'react';
import { Package, UserCheck, UserX, Star, BarChart3, ExternalLink } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  plans: string[];
  assignedUsers: string[];
  rating: number;
  installs: number;
}

const availableProducts: Product[] = [
  { id: 'prod1', name: 'EduFlow Pro', category: 'Education', description: 'Complete LMS for online education', plans: ['Basic', 'Pro', 'Unlimited'], assignedUsers: ['Alex Chen', 'Emily Davis'], rating: 4.8, installs: 45 },
  { id: 'prod2', name: 'MediCore 360', category: 'Healthcare', description: 'Patient management & clinic software', plans: ['Pro', 'Enterprise'], assignedUsers: ['Sarah Kumar'], rating: 4.9, installs: 22 },
  { id: 'prod3', name: 'ShopEngine', category: 'E-Commerce', description: 'Full-stack ecommerce platform', plans: ['Basic', 'Pro', 'Unlimited'], assignedUsers: ['Mike Ross', 'Priya Patel', 'Omar Hassan'], rating: 4.6, installs: 38 },
  { id: 'prod4', name: 'HotelNest', category: 'Hospitality', description: 'Property management system', plans: ['Pro', 'Unlimited'], assignedUsers: [], rating: 4.3, installs: 15 },
  { id: 'prod5', name: 'AnalyticsHub', category: 'Analytics', description: 'Business intelligence dashboard', plans: ['Basic', 'Pro'], assignedUsers: ['James Wilson'], rating: 4.7, installs: 31 },
];

const mockUserList = ['Alex Chen', 'Sarah Kumar', 'Mike Ross', 'Priya Patel', 'James Wilson', 'Emily Davis', 'Omar Hassan', 'Anya Singh'];

const categoryColors: Record<string, string> = {
  Education: '#0070f3',
  Healthcare: '#d32f2f',
  'E-Commerce': '#008060',
  Hospitality: '#b98900',
  Analytics: '#7c3aed',
};

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
    <div className="space-y-5 max-w-[1200px]">
      <div>
        <h2 className="text-xl font-semibold" style={{ color: '#1a1a1a' }}>Apps</h2>
        <p className="text-sm mt-0.5" style={{ color: '#6d7175' }}>Manage your apps and assign them to clients</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Apps', value: products.length, color: '#1a1a1a' },
          { label: 'Total Installs', value: products.reduce((s, p) => s + p.installs, 0), color: '#008060' },
          { label: 'Assignments', value: totalAssigned, color: '#0070f3' },
          { label: 'Avg Rating', value: (products.reduce((s, p) => s + p.rating, 0) / products.length).toFixed(1), color: '#b98900' },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl border p-4" style={{ borderColor: '#e1e3e5' }}>
            <p className="text-xs font-medium" style={{ color: '#6d7175' }}>{k.label}</p>
            <p className="text-2xl font-bold mt-1" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* App Cards */}
      <div className="space-y-3">
        {products.map(p => {
          const catColor = categoryColors[p.category] ?? '#6d7175';
          return (
            <div key={p.id} className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: '#e1e3e5' }}>
              <div
                className="flex items-center gap-4 p-5 cursor-pointer hover:bg-gray-50/50 transition-colors"
                onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}
              >
                <div className="h-12 w-12 rounded-xl flex items-center justify-center text-lg font-bold text-white" style={{ background: catColor }}>
                  {p.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[14px]" style={{ color: '#1a1a1a' }}>{p.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#6d7175' }}>{p.category} · {p.description}</p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5" style={{ color: '#b98900' }} />
                    <span className="text-xs font-medium" style={{ color: '#1a1a1a' }}>{p.rating}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium" style={{ color: '#1a1a1a' }}>{p.installs} installs</p>
                    <p className="text-[10px]" style={{ color: '#6d7175' }}>{p.assignedUsers.length} clients</p>
                  </div>
                  <div className="flex gap-1">
                    {p.plans.map(plan => (
                      <span key={plan} className="rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ background: '#f6f6f7', color: '#6d7175' }}>{plan}</span>
                    ))}
                  </div>
                  <span className="text-sm" style={{ color: '#8c9196' }}>{expandedId === p.id ? '▲' : '▼'}</span>
                </div>
              </div>

              {expandedId === p.id && (
                <div className="border-t px-5 pb-5 pt-4" style={{ borderColor: '#e1e3e5', background: '#fafbfb' }}>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium" style={{ color: '#1a1a1a' }}>Assigned Clients</p>
                    <button
                      onClick={() => setAssignModal({ productId: p.id, productName: p.name })}
                      className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-white transition-colors"
                      style={{ background: '#008060' }}
                    >
                      <UserCheck className="h-3.5 w-3.5" />
                      Assign Client
                    </button>
                  </div>
                  {p.assignedUsers.length === 0 ? (
                    <p className="text-sm" style={{ color: '#6d7175' }}>No clients assigned yet</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {p.assignedUsers.map(user => (
                        <div key={user} className="flex items-center gap-1.5 rounded-full border bg-white px-3 py-1" style={{ borderColor: '#e1e3e5' }}>
                          <div className="h-5 w-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ background: '#008060' }}>{user[0]}</div>
                          <span className="text-xs" style={{ color: '#1a1a1a' }}>{user}</span>
                          <button onClick={() => removeUser(p.id, user)} className="hover:text-red-500 transition-colors" style={{ color: '#8c9196' }}>
                            <UserX className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Assign Modal */}
      {assignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-semibold mb-1" style={{ color: '#1a1a1a' }}>Assign Client</h2>
            <p className="text-sm mb-4" style={{ color: '#6d7175' }}>to <span className="font-medium" style={{ color: '#1a1a1a' }}>{assignModal.productName}</span></p>
            <select
              value={selectedUser}
              onChange={e => setSelectedUser(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
              style={{ borderColor: '#c9cccf', color: '#1a1a1a' }}
            >
              <option value="">— choose client —</option>
              {mockUserList.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
            <div className="flex gap-3 mt-5">
              <button onClick={assignUser} disabled={!selectedUser} className="flex-1 rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50" style={{ background: '#008060' }}>Assign</button>
              <button onClick={() => { setAssignModal(null); setSelectedUser(''); }} className="flex-1 rounded-lg border px-4 py-2 text-sm font-medium" style={{ borderColor: '#c9cccf', color: '#6d7175' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResellerProductsPage;
