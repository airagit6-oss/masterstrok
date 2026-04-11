import { useState } from 'react';
import { UserPlus, Search, Filter, MoreHorizontal, ExternalLink } from 'lucide-react';
import { activity } from '@/lib/activityTimeline';
import { notify } from '@/lib/notifications';
import { useAuth } from '@/contexts/AuthContext';

type LeadStatus = 'New Lead' | 'Contacted' | 'Qualified' | 'Converted';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: LeadStatus;
  notes: string;
  createdAt: string;
}

const initialLeads: Lead[] = [
  { id: 'l1', name: 'Rahul Sharma', email: 'rahul@example.com', phone: '+91-9876543210', source: 'Referral Link', status: 'New Lead', notes: 'Interested in Pro plan', createdAt: '2026-03-28' },
  { id: 'l2', name: 'Aisha Patel', email: 'aisha@example.com', phone: '+91-9123456789', source: 'Partner Page', status: 'Contacted', notes: 'Demo scheduled for April', createdAt: '2026-03-25' },
  { id: 'l3', name: 'Carlos Torres', email: 'carlos@example.com', phone: '+1-555-0100', source: 'LinkedIn', status: 'Qualified', notes: 'Budget confirmed $500/mo', createdAt: '2026-03-20' },
  { id: 'l4', name: 'Li Wei', email: 'li.wei@example.com', phone: '+86-13800138000', source: 'Email Campaign', status: 'Converted', notes: 'Signed up for Unlimited plan', createdAt: '2026-03-15' },
  { id: 'l5', name: 'Fatima Al-Rashid', email: 'fatima@example.com', phone: '+971-501234567', source: 'Referral Link', status: 'New Lead', notes: 'Follow-up needed', createdAt: '2026-03-30' },
  { id: 'l6', name: 'John Mitchell', email: 'john.m@example.com', phone: '+1-555-0200', source: 'Google Ads', status: 'Contacted', notes: 'Sent product brochure', createdAt: '2026-03-22' },
];

const statusStyles: Record<LeadStatus, { bg: string; text: string; dot: string }> = {
  'New Lead': { bg: '#e0f0ff', text: '#0070f3', dot: '#0070f3' },
  'Contacted': { bg: '#fef3e0', text: '#b98900', dot: '#b98900' },
  'Qualified': { bg: '#f3e8ff', text: '#7c3aed', dot: '#7c3aed' },
  'Converted': { bg: '#e4f3e8', text: '#008060', dot: '#008060' },
};

const allStatuses: LeadStatus[] = ['New Lead', 'Contacted', 'Qualified', 'Converted'];

const emptyLead = (): Omit<Lead, 'id' | 'createdAt'> => ({
  name: '', email: '', phone: '', source: '', status: 'New Lead', notes: '',
});

const ResellerLeadsPage = () => {
  const { user } = useAuth();
  const resellerId = user?.id ?? 'anonymous';
  const userId = user?.id ?? 'anonymous';
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<LeadStatus | 'All'>('All');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyLead());

  const filtered = leads.filter(l => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) || l.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || l.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const addLead = () => {
    if (!form.name || !form.email) return;
    const newLead: Lead = { ...form, id: `l${Date.now()}`, createdAt: new Date().toISOString().split('T')[0] };
    setLeads(prev => [newLead, ...prev]);
    activity.leadCreated(resellerId, userId, newLead.name);
    notify.newLead(resellerId, newLead.name);
    setForm(emptyLead());
    setShowModal(false);
  };

  const updateStatus = (id: string, status: LeadStatus) => {
    const lead = leads.find(l => l.id === id);
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    if (lead) activity.leadStatusChanged(resellerId, userId, lead.name, status);
  };

  return (
    <div className="space-y-5 max-w-[1200px]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold" style={{ color: '#1a1a1a' }}>Referrals</h2>
          <p className="text-sm mt-0.5" style={{ color: '#6d7175' }}>Track and manage merchants you've referred</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
          style={{ background: '#008060' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#006e52')}
          onMouseLeave={e => (e.currentTarget.style.background = '#008060')}
        >
          <UserPlus className="h-4 w-4" />
          Add referral
        </button>
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-4 gap-3">
        {allStatuses.map(s => {
          const count = leads.filter(l => l.status === s).length;
          const st = statusStyles[s];
          return (
            <div key={s} className="bg-white rounded-xl border p-4 cursor-pointer hover:shadow-sm transition-shadow" style={{ borderColor: '#e1e3e5' }}
              onClick={() => setFilterStatus(filterStatus === s ? 'All' : s)}>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full" style={{ background: st.dot }} />
                <p className="text-xs font-medium" style={{ color: '#6d7175' }}>{s}</p>
              </div>
              <p className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>{count}</p>
            </div>
          );
        })}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#8c9196' }} />
          <input
            type="text"
            placeholder="Search referrals..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-lg border pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2"
            style={{ borderColor: '#c9cccf', color: '#1a1a1a', background: 'white' }}
          />
        </div>
        <div className="flex items-center gap-1.5 bg-white rounded-lg border px-1 py-1" style={{ borderColor: '#c9cccf' }}>
          {(['All', ...allStatuses] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s as LeadStatus | 'All')}
              className="rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
              style={{
                background: filterStatus === s ? '#008060' : 'transparent',
                color: filterStatus === s ? 'white' : '#6d7175',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: '#e1e3e5' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: '#fafbfb', borderBottom: '1px solid #e1e3e5' }}>
              <th className="px-5 py-2.5 text-left text-xs font-medium" style={{ color: '#6d7175' }}>Merchant</th>
              <th className="px-5 py-2.5 text-left text-xs font-medium" style={{ color: '#6d7175' }}>Source</th>
              <th className="px-5 py-2.5 text-left text-xs font-medium" style={{ color: '#6d7175' }}>Status</th>
              <th className="px-5 py-2.5 text-left text-xs font-medium" style={{ color: '#6d7175' }}>Notes</th>
              <th className="px-5 py-2.5 text-left text-xs font-medium" style={{ color: '#6d7175' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(l => {
              const st = statusStyles[l.status];
              return (
                <tr key={l.id} className="border-b last:border-0 hover:bg-gray-50/50 transition-colors" style={{ borderColor: '#f1f1f1' }}>
                  <td className="px-5 py-3">
                    <p className="font-medium text-[13px]" style={{ color: '#1a1a1a' }}>{l.name}</p>
                    <p className="text-[11px]" style={{ color: '#6d7175' }}>{l.email}</p>
                  </td>
                  <td className="px-5 py-3 text-[13px]" style={{ color: '#6d7175' }}>{l.source}</td>
                  <td className="px-5 py-3">
                    <select
                      value={l.status}
                      onChange={e => updateStatus(l.id, e.target.value as LeadStatus)}
                      className="rounded-full px-2.5 py-1 text-xs font-medium border-0 cursor-pointer focus:outline-none"
                      style={{ background: st.bg, color: st.text }}
                    >
                      {allStatuses.map(s => <option key={s} value={s} style={{ background: 'white', color: '#1a1a1a' }}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-5 py-3 text-[13px] max-w-[200px] truncate" style={{ color: '#6d7175' }}>{l.notes}</td>
                  <td className="px-5 py-3 text-[13px]" style={{ color: '#6d7175' }}>{l.createdAt}</td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-sm" style={{ color: '#6d7175' }}>No referrals found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Add New Referral</h2>
            <div className="space-y-3">
              {[
                { label: 'Name', key: 'name', type: 'text', placeholder: 'Merchant name' },
                { label: 'Email', key: 'email', type: 'email', placeholder: 'email@example.com' },
                { label: 'Phone', key: 'phone', type: 'text', placeholder: '+1-555-0000' },
                { label: 'Source', key: 'source', type: 'text', placeholder: 'Referral Link / Partner Page' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-medium mb-1" style={{ color: '#6d7175' }}>{f.label}</label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    value={(form as Record<string, string>)[f.key]}
                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                    style={{ borderColor: '#c9cccf', color: '#1a1a1a' }}
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#6d7175' }}>Status</label>
                <select
                  value={form.status}
                  onChange={e => setForm(prev => ({ ...prev, status: e.target.value as LeadStatus }))}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                  style={{ borderColor: '#c9cccf', color: '#1a1a1a' }}
                >
                  {allStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#6d7175' }}>Notes</label>
                <textarea
                  placeholder="Additional notes..."
                  value={form.notes}
                  onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
                  rows={2}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 resize-none"
                  style={{ borderColor: '#c9cccf', color: '#1a1a1a' }}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={addLead} className="flex-1 rounded-lg px-4 py-2 text-sm font-medium text-white" style={{ background: '#008060' }}>
                Add Referral
              </button>
              <button onClick={() => { setShowModal(false); setForm(emptyLead()); }} className="flex-1 rounded-lg border px-4 py-2 text-sm font-medium" style={{ borderColor: '#c9cccf', color: '#6d7175' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResellerLeadsPage;
