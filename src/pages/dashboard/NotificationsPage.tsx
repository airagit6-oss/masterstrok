import { Bell } from 'lucide-react';
import { useState } from 'react';

const NotificationsPage = () => {
  const [prefs, setPrefs] = useState({ email: true, push: true, marketing: false, billing: true });
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
              onClick={() => setPrefs(p => ({ ...p, [item.key]: !p[item.key as keyof typeof p] }))}
              className={`relative h-5 w-9 rounded-full transition-colors ${prefs[item.key as keyof typeof prefs] ? 'bg-primary' : 'bg-muted'}`}
            >
              <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-background transition-transform ${prefs[item.key as keyof typeof prefs] ? 'translate-x-4' : 'translate-x-0.5'}`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default NotificationsPage;
