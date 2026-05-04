import { Bell } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const STORAGE_KEY = 'saashub_notification_prefs';
type Prefs = { email: boolean; push: boolean; marketing: boolean; billing: boolean };
const defaultPrefs: Prefs = { email: true, push: true, marketing: false, billing: true };

function loadPrefs(): Prefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaultPrefs, ...JSON.parse(raw) } : defaultPrefs;
  } catch {
    return defaultPrefs;
  }
}

const NotificationsPage = () => {
  const [prefs, setPrefs] = useState<Prefs>(loadPrefs);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs)); } catch { /* ignore */ }
  }, [prefs]);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs)); } catch { /* ignore */ }
      setSaving(false);
      toast.success('Notification preferences saved');
    }, 400);
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-foreground mb-1">Notifications</h1>
      <p className="text-sm text-muted-foreground mb-6">Choose what you want to be notified about.</p>
      <div className="rounded-xl border border-border bg-card divide-y divide-border">
        {[
          { key: 'email', title: 'Email notifications', desc: 'Receive updates via email' },
          { key: 'push', title: 'Push notifications', desc: 'Browser push notifications' },
          { key: 'billing', title: 'Billing alerts', desc: 'Payment receipts and renewals' },
          { key: 'marketing', title: 'Marketing emails', desc: 'Product news and promotions' },
        ].map(item => (
          <div key={item.key} className="flex items-center justify-between p-4">
            <div className="flex items-start gap-3">
              <Bell className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </div>
            <button
              type="button"
              aria-pressed={prefs[item.key as keyof Prefs]}
              onClick={() => setPrefs(p => ({ ...p, [item.key]: !p[item.key as keyof Prefs] }))}
              className={`relative h-5 w-9 rounded-full transition-colors ${prefs[item.key as keyof Prefs] ? 'bg-primary' : 'bg-muted'}`}
            >
              <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-background transition-transform ${prefs[item.key as keyof Prefs] ? 'translate-x-4' : 'translate-x-0.5'}`} />
            </button>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save preferences'}
        </button>
      </div>
    </div>
  );
};
export default NotificationsPage;
