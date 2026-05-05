import { User } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: user?.name ?? '', email: user?.email ?? '' });

  const inputClass = 'w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary';

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name.trim().length < 2) return toast.error('Name is too short');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return toast.error('Invalid email');
    setSaving(true);
    setTimeout(() => {
      try {
        updateProfile({ name: form.name, email: form.email });
        toast.success('Profile updated');
        setEditing(false);
      } catch {
        toast.error('Could not save profile');
      } finally {
        setSaving(false);
      }
    }, 400);
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        {!editing && (
          <button onClick={() => setEditing(true)}
            className="text-sm rounded-md border border-border bg-card px-3 py-1.5 hover:bg-accent transition-colors">
            Edit
          </button>
        )}
      </div>
      <p className="text-sm text-muted-foreground mb-6">Manage your personal information.</p>

      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground uppercase">
            {(editing ? form.name : user?.name)?.[0] ?? <User />}
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">{editing ? form.name || 'User' : user?.name ?? 'User'}</p>
            <p className="text-sm text-muted-foreground">{editing ? form.email : user?.email ?? ''}</p>
          </div>
        </div>

        {editing ? (
          <form onSubmit={handleSave} className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            <div className="col-span-2 sm:col-span-1">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Full name</label>
              <input className={`${inputClass} mt-1`} value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</label>
              <input type="email" className={`${inputClass} mt-1`} value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div className="col-span-2 flex gap-2 justify-end">
              <button type="button" onClick={() => { setEditing(false); setForm({ name: user?.name ?? '', email: user?.email ?? '' }); }}
                className="text-sm rounded-md border border-border bg-card px-3 py-1.5 hover:bg-accent">
                Cancel
              </button>
              <button type="submit" disabled={saving}
                className="text-sm rounded-md bg-primary text-primary-foreground px-3 py-1.5 hover:bg-primary/90 disabled:opacity-50">
                {saving ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Full name</label>
              <p className="text-sm text-foreground mt-1">{user?.name ?? '—'}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Role</label>
              <p className="text-sm text-foreground mt-1 capitalize">{user?.role ?? 'user'}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</label>
              <p className="text-sm text-foreground mt-1">{user?.email ?? '—'}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">User ID</label>
              <p className="text-xs text-muted-foreground mt-1 font-mono">{user?.id ?? '—'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default ProfilePage;
