import { useState } from 'react';
import { UserPlus, Search, Filter } from 'lucide-react';

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
  { id: 'l1', name: 'Rahul Sharma', email: 'rahul@example.com', phone: '+91-9876543210', source: 'Referral', status: 'New Lead', notes: 'Interested in Pro plan', createdAt: '2026-03-28' },
  { id: 'l2', name: 'Aisha Patel', email: 'aisha@example.com', phone: '+91-9123456789', source: 'Website', status: 'Contacted', notes: 'Demo scheduled for April', createdAt: '2026-03-25' },
  { id: 'l3', name: 'Carlos Torres', email: 'carlos@example.com', phone: '+1-555-0100', source: 'LinkedIn', status: 'Qualified', notes: 'Budget confirmed $500/mo', createdAt: '2026-03-20' },
  { id: 'l4', name: 'Li Wei', email: 'li.wei@example.com', phone: '+86-13800138000', source: 'Email Campaign', status: 'Converted', notes: 'Signed up for Unlimited plan', createdAt: '2026-03-15' },
  { id: 'l5', name: 'Fatima Al-Rashid', email: 'fatima@example.com', phone: '+971-501234567', source: 'Referral', status: 'New Lead', notes: 'Follow-up needed', createdAt: '2026-03-30' },
  { id: 'l6', name: 'John Mitchell', email: 'john.m@example.com', phone: '+1-555-0200', source: 'Google Ads', status: 'Contacted', notes: 'Sent product brochure', createdAt: '2026-03-22' },
];

const statusColors: Record<LeadStatus, string> = {
  'New Lead': 'bg-blue-500/20 text-blue-400',
  'Contacted': 'bg-yellow-500/20 text-yellow-400',
  'Qualified': 'bg-purple-500/20 text-purple-400',
  'Converted': 'bg-green-500/20 text-green-400',
};

const allStatuses: LeadStatus[] = ['New Lead', 'Contacted', 'Qualified', 'Converted'];

const emptyLead = (): Omit<Lead, 'id' | 'createdAt'> => ({
  name: '', email: '', phone: '', source: '', status: 'New Lead', notes: '',
});

const ResellerLeadsPage = () => {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<LeadStatus | 'All'>('All');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyLead());

  const filtered = leads.filter(l => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || l.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const addLead = () => {
    if (!form.name || !form.email) return;
    const newLead: Lead = {
      ...form,
      id: `l${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setLeads(prev => [newLead, ...prev]);
    setForm(emptyLead());
    setShowModal(false);
  };

  const updateStatus = (id: string, status: LeadStatus) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Leads</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage and track your sales leads</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <UserPlus className="h-4 w-4" />
          Add Lead
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        {allStatuses.map(s => {
          const count = leads.filter(l => l.status === s).length;
          return (
            <div key={s} className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">{s}</p>
              <p className="text-2xl font-bold text-foreground mt-1">{count}</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-card pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {(['All', ...allStatuses] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s as LeadStatus | 'All')}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                filterStatus === s ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground hover:bg-accent'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Name</th>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Contact</th>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Source</th>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Notes</th>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(l => (
              <tr key={l.id} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                <td className="px-4 py-3 font-medium text-foreground">{l.name}</td>
                <td className="px-4 py-3">
                  <p className="text-foreground">{l.email}</p>
                  <p className="text-xs text-muted-foreground">{l.phone}</p>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{l.source}</td>
                <td className="px-4 py-3">
                  <select
                    value={l.status}
                    onChange={e => updateStatus(l.id, e.target.value as LeadStatus)}
                    className={`rounded-full px-2 py-0.5 text-xs font-medium border-0 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary ${statusColors[l.status]}`}
                  >
                    {allStatuses.map(s => (
                      <option key={s} value={s} className="bg-card text-foreground">{s}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">{l.notes}</td>
                <td className="px-4 py-3 text-muted-foreground">{l.createdAt}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No leads found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Lead Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-foreground mb-4">Add New Lead</h2>
            <div className="space-y-3">
              {[
                { label: 'Name', key: 'name', type: 'text', placeholder: 'Full name' },
                { label: 'Email', key: 'email', type: 'email', placeholder: 'email@example.com' },
                { label: 'Phone', key: 'phone', type: 'text', placeholder: '+1-555-0000' },
                { label: 'Source', key: 'source', type: 'text', placeholder: 'Referral / Website / LinkedIn' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">{f.label}</label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    value={(form as Record<string, string>)[f.key]}
                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={e => setForm(prev => ({ ...prev, status: e.target.value as LeadStatus }))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {allStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Notes</label>
                <textarea
                  placeholder="Follow-up notes..."
                  value={form.notes}
                  onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
                  rows={2}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={addLead}
                className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Add Lead
              </button>
              <button
                onClick={() => { setShowModal(false); setForm(emptyLead()); }}
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

export default ResellerLeadsPage;
