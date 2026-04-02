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

const tagColors: Record<string, string> = {
  Hot: 'bg-red-500/20 text-red-400',
  Warm: 'bg-orange-500/20 text-orange-400',
  Cold: 'bg-blue-500/20 text-blue-400',
  Enterprise: 'bg-purple-500/20 text-purple-400',
  SMB: 'bg-cyan-500/20 text-cyan-400',
  Converted: 'bg-green-500/20 text-green-400',
  Trial: 'bg-yellow-500/20 text-yellow-400',
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
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) {
      setForm(prev => ({ ...prev, tags: [...prev.tags, t] }));
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    setForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const addContact = () => {
    if (!form.name || !form.email) return;
    const newContact: Contact = {
      ...form,
      id: `c${Date.now()}`,
      linkedLead: false,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setContacts(prev => [newContact, ...prev]);
    setForm(emptyContact());
    setTagInput('');
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Contacts</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your CRM contact database</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <UserPlus className="h-4 w-4" />
          Add Contact
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Contacts</p>
          <p className="text-2xl font-bold text-foreground mt-1">{contacts.length}</p>
        </div>
        <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4">
          <p className="text-sm text-muted-foreground">Linked to Leads</p>
          <p className="text-2xl font-bold text-green-400 mt-1">{contacts.filter(c => c.linkedLead).length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Sources</p>
          <p className="text-2xl font-bold text-foreground mt-1">{new Set(contacts.map(c => c.source)).size}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search contacts..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full rounded-lg border border-border bg-card pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Name</th>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Phone</th>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Source</th>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Tags</th>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Lead</th>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Added</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.email}</p>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{c.phone}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.source}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {c.tags.map(tag => (
                      <span key={tag} className={`rounded-full px-2 py-0.5 text-xs font-medium ${tagColors[tag] ?? 'bg-secondary text-muted-foreground'}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {c.linkedLead ? (
                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-green-500/20 text-green-400">Linked</span>
                  ) : (
                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-secondary text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{c.createdAt}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No contacts found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Contact Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-foreground mb-4">Add New Contact</h2>
            <div className="space-y-3">
              {[
                { label: 'Name', key: 'name', type: 'text', placeholder: 'Full name' },
                { label: 'Email', key: 'email', type: 'email', placeholder: 'email@example.com' },
                { label: 'Phone', key: 'phone', type: 'text', placeholder: '+1-555-0000' },
                { label: 'Source', key: 'source', type: 'text', placeholder: 'Website / Referral / LinkedIn' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">{f.label}</label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    value={(form as unknown as Record<string, string>)[f.key] as string
                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Tags</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add tag..."
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addTag()}
                    className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button onClick={addTag} className="rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-accent transition-colors">Add</button>
                </div>
                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {form.tags.map(tag => (
                      <button key={tag} onClick={() => removeTag(tag)} className="rounded-full px-2 py-0.5 text-xs font-medium bg-primary/20 text-primary hover:bg-primary/30 transition-colors">
                        {tag} ×
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={addContact}
                className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Add Contact
              </button>
              <button
                onClick={() => { setShowModal(false); setForm(emptyContact()); setTagInput(''); }}
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

export default ResellerContactsPage;
