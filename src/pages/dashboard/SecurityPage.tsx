import { Shield, Key, Smartphone, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const SecurityPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [twoFA, setTwoFA] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showSessions, setShowSessions] = useState(false);
  const [pwd, setPwd] = useState({ current: '', next: '', confirm: '' });
  const [busy, setBusy] = useState(false);

  const changePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pwd.current || !pwd.next || !pwd.confirm) { toast.error('All fields are required'); return; }
    if (pwd.next.length < 8) { toast.error('New password must be at least 8 characters'); return; }
    if (pwd.next !== pwd.confirm) { toast.error('Passwords do not match'); return; }
    setBusy(true);
    setTimeout(() => {
      toast.success('Password updated');
      setPwd({ current: '', next: '', confirm: '' });
      setShowPwd(false); setBusy(false);
    }, 400);
  };

  const toggle2FA = () => {
    setTwoFA(v => !v);
    toast.success(twoFA ? 'Two-factor authentication disabled' : 'Two-factor authentication enabled');
  };

  const deleteAccount = () => {
    const t = window.prompt('Type DELETE to permanently remove your account:');
    if (t !== 'DELETE') { if (t !== null) toast.error('Confirmation text did not match'); return; }
    toast.success('Account deleted. Logging out…');
    setTimeout(() => { logout(); navigate('/'); }, 600);
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-foreground mb-1">Security</h1>
      <p className="text-sm text-muted-foreground mb-6">Keep your account safe.</p>
      <div className="space-y-4">
        <div className="rounded-xl border border-border bg-card p-5 flex items-start justify-between">
          <div className="flex gap-3">
            <Key className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-foreground">Password</p>
              <p className="text-xs text-muted-foreground">Last changed 3 months ago</p>
            </div>
          </div>
          <button onClick={() => setShowPwd(s => !s)} className="text-sm text-primary font-medium hover:underline">
            {showPwd ? 'Cancel' : 'Change'}
          </button>
        </div>
        {showPwd && (
          <form onSubmit={changePassword} className="rounded-xl border border-border bg-card p-5 space-y-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Current password</label>
              <input type="password" value={pwd.current} onChange={e => setPwd(p => ({ ...p, current: e.target.value }))} required
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">New password</label>
              <input type="password" value={pwd.next} onChange={e => setPwd(p => ({ ...p, next: e.target.value }))} required minLength={8}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Confirm new password</label>
              <input type="password" value={pwd.confirm} onChange={e => setPwd(p => ({ ...p, confirm: e.target.value }))} required minLength={8}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
            </div>
            <button type="submit" disabled={busy}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
              {busy ? 'Updating…' : 'Update password'}
            </button>
          </form>
        )}

        <div className="rounded-xl border border-border bg-card p-5 flex items-start justify-between">
          <div className="flex gap-3">
            <Smartphone className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-foreground">Two-factor authentication</p>
              <p className="text-xs text-muted-foreground">{twoFA ? 'Enabled' : 'Add extra layer of security'}</p>
            </div>
          </div>
          <button onClick={toggle2FA} className="text-sm text-primary font-medium hover:underline">
            {twoFA ? 'Disable' : 'Enable'}
          </button>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-start justify-between">
            <div className="flex gap-3">
              <Shield className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground">Active sessions</p>
                <p className="text-xs text-muted-foreground">1 active session (this device)</p>
              </div>
            </div>
            <button onClick={() => setShowSessions(s => !s)} className="text-sm text-primary font-medium hover:underline">
              {showSessions ? 'Hide' : 'View all'}
            </button>
          </div>
          {showSessions && (
            <div className="mt-4 rounded-lg border border-border p-3 text-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{navigator.userAgent.split(' ').slice(-1)[0] || 'Current device'}</p>
                  <p className="text-xs text-muted-foreground">Active now</p>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-green-500/10 text-green-500">This device</span>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 flex items-start justify-between">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-foreground">Delete account</p>
              <p className="text-xs text-muted-foreground">Permanently delete your account and data</p>
            </div>
          </div>
          <button onClick={deleteAccount} className="text-sm text-destructive font-medium hover:underline">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default SecurityPage;
