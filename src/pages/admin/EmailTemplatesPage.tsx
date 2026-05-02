import { Mail, Edit3 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Template { name: string; desc: string; updated: string; subject: string; body: string; }

const seed: Template[] = [
  { name: 'Welcome email', desc: 'Sent on user signup', updated: '2 days ago', subject: 'Welcome to SaaSHub 👋', body: 'Hi {{name}},\n\nThanks for signing up.' },
  { name: 'Order confirmation', desc: 'Sent after successful purchase', updated: '1 week ago', subject: 'Your order is confirmed', body: 'Hi {{name}}, your order #{{id}} is confirmed.' },
  { name: 'Password reset', desc: 'Sent when user requests password reset', updated: '3 weeks ago', subject: 'Reset your password', body: 'Click here to reset: {{link}}' },
  { name: 'Subscription renewal', desc: 'Sent before billing date', updated: '1 month ago', subject: 'Your subscription renews soon', body: 'Heads up — your plan renews on {{date}}.' },
  { name: 'Subscription cancelled', desc: 'Sent when user cancels', updated: '1 month ago', subject: 'Sorry to see you go', body: 'Your subscription was cancelled.' },
  { name: 'Vendor approval', desc: 'Sent when vendor application is approved', updated: '2 months ago', subject: 'Your vendor application is approved', body: 'Welcome aboard, {{vendor}}.' },
];

const EmailTemplatesPage = () => {
  const [templates, setTemplates] = useState<Template[]>(seed);
  const [editing, setEditing] = useState<Template | null>(null);
  const [draft, setDraft] = useState({ subject: '', body: '' });
  const [busy, setBusy] = useState(false);

  const open = (t: Template) => { setEditing(t); setDraft({ subject: t.subject, body: t.body }); };
  const close = () => { if (!busy) setEditing(null); };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    if (!draft.subject.trim()) { toast.error('Subject is required'); return; }
    if (!draft.body.trim()) { toast.error('Body cannot be empty'); return; }
    setBusy(true);
    setTimeout(() => {
      setTemplates(prev => prev.map(t => t.name === editing.name
        ? { ...t, subject: draft.subject, body: draft.body, updated: 'just now' }
        : t));
      toast.success(`Template "${editing.name}" saved`);
      setBusy(false); setEditing(null);
    }, 250);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-1">Email templates</h1>
      <p className="text-sm text-muted-foreground mb-6">Customize transactional and marketing emails.</p>
      <div className="grid grid-cols-2 gap-4">
        {templates.map(t => (
          <div key={t.name} className="rounded-xl border border-border bg-card p-4 flex items-start justify-between">
            <div className="flex gap-3 min-w-0">
              <Mail className="h-8 w-8 text-primary shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.desc}</p>
                <p className="text-xs text-muted-foreground/70 mt-1">Updated {t.updated}</p>
              </div>
            </div>
            <button onClick={() => open(t)} aria-label={`Edit ${t.name}`}
              className="shrink-0 ml-2 p-1.5 rounded hover:bg-accent transition-colors">
              <Edit3 className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={close}>
          <form onClick={e => e.stopPropagation()} onSubmit={save} className="w-full max-w-xl rounded-xl border border-border bg-card p-6 space-y-4 shadow-xl">
            <div>
              <h2 className="text-lg font-semibold text-foreground">{editing.name}</h2>
              <p className="text-xs text-muted-foreground">{editing.desc}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Subject</label>
              <input value={draft.subject} onChange={e => setDraft(d => ({ ...d, subject: e.target.value }))} required
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Body</label>
              <textarea value={draft.body} onChange={e => setDraft(d => ({ ...d, body: e.target.value }))} required rows={8}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono outline-none focus:border-primary resize-y" />
              <p className="text-xs text-muted-foreground mt-1">Use placeholders like <code className="font-mono">{'{{name}}'}</code>.</p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={close} disabled={busy}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-accent disabled:opacity-50">Cancel</button>
              <button type="submit" disabled={busy}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
                {busy ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
export default EmailTemplatesPage;
