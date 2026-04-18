import { Mail, Edit3 } from 'lucide-react';

const EmailTemplatesPage = () => (
  <div>
    <h1 className="text-2xl font-bold text-foreground mb-1">Email templates</h1>
    <p className="text-sm text-muted-foreground mb-6">Customize transactional and marketing emails.</p>
    <div className="grid grid-cols-2 gap-4">
      {[
        { name: 'Welcome email', desc: 'Sent on user signup', updated: '2 days ago' },
        { name: 'Order confirmation', desc: 'Sent after successful purchase', updated: '1 week ago' },
        { name: 'Password reset', desc: 'Sent when user requests password reset', updated: '3 weeks ago' },
        { name: 'Subscription renewal', desc: 'Sent before billing date', updated: '1 month ago' },
        { name: 'Subscription cancelled', desc: 'Sent when user cancels', updated: '1 month ago' },
        { name: 'Vendor approval', desc: 'Sent when vendor application is approved', updated: '2 months ago' },
      ].map(t => (
        <div key={t.name} className="rounded-xl border border-border bg-card p-4 flex items-start justify-between">
          <div className="flex gap-3 min-w-0">
            <Mail className="h-8 w-8 text-primary shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.desc}</p>
              <p className="text-xs text-muted-foreground/70 mt-1">Updated {t.updated}</p>
            </div>
          </div>
          <button className="shrink-0 ml-2 p-1.5 rounded hover:bg-accent">
            <Edit3 className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      ))}
    </div>
  </div>
);
export default EmailTemplatesPage;
