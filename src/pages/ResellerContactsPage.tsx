import { useState } from 'react';
import { UserPlus, Search } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: string;
  tags: string[];
  linkedLead: boolean;
  createdAt: string;
}

const initialContacts: Contact[] = [
  { id: 'c1', name: 'Rahul Sharma', phone: '+91-9876543210', email: 'rahul@example.com', source: 'Referral', tags: ['Hot', 'Enterprise'], linkedLead: true, createdAt: '2026-03-28' },
  { id: 'c2', name: 'Aisha Patel', phone: '+91-9123456789', email: 'aisha@example.com', source: 'Website', tags: ['Warm'], linkedLead: true, createdAt: '2026-03-25' },
  { id: 'c3', name: 'Carlos Torres', phone: '+1-555-0100', email: 'carlos@example.com', source: 'LinkedIn', tags: ['Hot', 'SMB'], linkedLead: true, createdAt: '2026-03-20' },
  { id: 'c4', name: 'Li Wei', phone: '+86-13800138000', email: 'li.wei@example.com', source: 'Email Campaign', tags: ['Converted'], linkedLead: true, createdAt: '2026-03-15' },
  { id: 'c5', name: 'Maria Gonzalez', phone: '+52-5512345678', email: 'maria@example.com', source: 'Social Media', tags: ['Cold'], linkedLead: false, createdAt: '2026-03-10' },
  { id: 'c6', name: 'David Kim', phone: '+82-1012345678', email: 'david.k@example.com', source: 'Google Ads', tags: ['Warm', 'Trial'], linkedLead: false, createdAt: '2026-03-05' },
];

const tagStyles: Record<string, { bg: string; text: string }> = {
  Hot: { bg: '#fce4ec', text: '#d32f2f' },
  Warm: { bg: '#fef3e0', text: '#b98900' },
  Cold: { bg: '#e0f0ff', text: '#0070f3' },
  Enterprise: { bg: '#f3e8ff', text: '#7c3aed' },
  SMB: { bg: '#e0f7fa', text: '#00838f' },
  Converted: { bg: '#e4f3e8', text: '#008060' },
  Trial: { bg: '#fef3e0', text: '#b98900' },
};

const emptyContact = (): Omit<Contact, 'id' | 'createdAt' | 'linkedLead'> => ({
  name: '', phone: '', email: '', source: '', tags: [],
});

const ResellerContactsPage = () => {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyContact());
  const [tagInput, setTagInput] = useState('');

  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
  );

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) setForm(prev => ({ ...prev, tags: [...prev.tags, t] }));
    setTagInput('');
  };

  const addContact = () => {
    if (!form.name || !form.email) return;
    setContacts(prev => [{ ...form, id: `c${Date.now()}`, linkedLead: false, createdAt: new Date().toISOString().split('T')[0] }, ...prev]);
    setForm(emptyContact());
    setTagInput('');
    setShowModal(false);
  };

  return (
    <div className="space-y-5 max-w-[1200px]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold" style={{ color: '#1a1a1a' }}>Clients</h2>
          <p className="text-sm mt-0.5" style={{ color: '#6d7175' }}>Manage your client contact database</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white" style={{ background: '#008060' }}>
          <UserPlus className="h-4 w-4" />
          Add client
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Clients', value: contacts.length },
          { label: 'Linked Referrals', value: contacts.filter(c => c.linkedLead).length, color: '#008060' },
          { label: 'Sources', value: new Set(contacts.map(c => c.source)).size },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl border p-4" style={{ borderColor: '#e1e3e5' }}>
            <p className="text-xs font-medium" style={{ color: '#6d7175' }}>{k.label}</p>
            <p className="text-2xl font-bold mt-1" style={{ color: k.color ?? '#1a1a1a' }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#8c9196' }} />
        <input
          type="text"
          placeholder="Search clients..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full rounded-lg border pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2"
          style={{ borderColor: '#c9cccf', color: '#1a1a1a', background: 'white' }}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: '#e1e3e5' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: '#fafbfb', borderBottom: '1px solid #e1e3e5' }}>
              <th className="px-5 py-2.5 text-left text-xs font-medium" style={{ color: '#6d7175' }}>Client</th>
              <th className="px-5 py-2.5 text-left text-xs font-medium" style={{ color: '#6d7175' }}>Phone</th>
              <th className="px-5 py-2.5 text-left text-xs font-medium" style={{ color: '#6d7175' }}>Source</th>
              <th className="px-5 py-2.5 text-left text-xs font-medium" style={{ color: '#6d7175' }}>Tags</th>
              <th className="px-5 py-2.5 text-left text-xs font-medium" style={{ color: '#6d7175' }}>Referral</th>
              <th className="px-5 py-2.5 text-left text-xs font-medium" style={{ color: '#6d7175' }}>Added</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} className="border-b last:border-0 hover:bg-gray-50/50 transition-colors" style={{ borderColor: '#f1f1f1' }}>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: '#008060' }}>{c.name[0]}</div>
                    <div>
                      <p className="font-medium text-[13px]" style={{ color: '#1a1a1a' }}>{c.name}</p>
                      <p className="text-[11px]" style={{ color: '#6d7175' }}>{c.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-[13px]" style={{ color: '#6d7175' }}>{c.phone}</td>
                <td className="px-5 py-3 text-[13px]" style={{ color: '#6d7175' }}>{c.source}</td>
                <td className="px-5 py-3">
                  <div className="flex flex-wrap gap-1">
                    {c.tags.map(tag => {
                      const st = tagStyles[tag] ?? { bg: '#f6f6f7', text: '#6d7175' };
                      return <span key={tag} className="rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ background: st.bg, color: st.text }}>{tag}</span>;
                    })}
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span className="rounded-full px-2 py-0.5 text-[10px] font-medium" style={{
                    background: c.linkedLead ? '#e4f3e8' : '#f6f6f7',
                    color: c.linkedLead ? '#008060' : '#6d7175',
                  }}>
                    {c.linkedLead ? 'Linked' : '—'}
                  </span>
                </td>
                <td className="px-5 py-3 text-[13px]" style={{ color: '#6d7175' }}>{c.createdAt}</td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={6} className="px-5 py-8 text-center text-sm" style={{ color: '#6d7175' }}>No clients found</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Add New Client</h2>
            <div className="space-y-3">
              {[
                { label: 'Name', key: 'name', type: 'text', placeholder: 'Client name' },
                { label: 'Email', key: 'email', type: 'email', placeholder: 'email@example.com' },
                { label: 'Phone', key: 'phone', type: 'text', placeholder: '+1-555-0000' },
                { label: 'Source', key: 'source', type: 'text', placeholder: 'Website / Referral / LinkedIn' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-medium mb-1" style={{ color: '#6d7175' }}>{f.label}</label>
                  <input
                    type={f.type} placeholder={f.placeholder}
                    value={(form as unknown as Record<string, string>)[f.key] as string}
                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                    style={{ borderColor: '#c9cccf', color: '#1a1a1a' }}
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#6d7175' }}>Tags</label>
                <div className="flex gap-2">
                  <input type="text" placeholder="Add tag..." value={tagInput} onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addTag()}
                    className="flex-1 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2" style={{ borderColor: '#c9cccf', color: '#1a1a1a' }}
                  />
                  <button onClick={addTag} className="rounded-lg border px-3 py-2 text-sm" style={{ borderColor: '#c9cccf', color: '#6d7175' }}>Add</button>
                </div>
                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {form.tags.map(tag => (
                      <button key={tag} onClick={() => setForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))}
                        className="rounded-full px-2 py-0.5 text-xs font-medium" style={{ background: '#e4f3e8', color: '#008060' }}>
                        {tag} ×
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={addContact} className="flex-1 rounded-lg px-4 py-2 text-sm font-medium text-white" style={{ background: '#008060' }}>Add Client</button>
              <button onClick={() => { setShowModal(false); setForm(emptyContact()); setTagInput(''); }} className="flex-1 rounded-lg border px-4 py-2 text-sm font-medium" style={{ borderColor: '#c9cccf', color: '#6d7175' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResellerContactsPage;
