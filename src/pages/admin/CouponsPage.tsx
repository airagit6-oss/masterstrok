import { Ticket, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Coupon { code: string; disc: string; used: string; exp: string; active: boolean; }

const seed: Coupon[] = [
  { code: 'SUMMER25', disc: '25% off', used: '142 / 500', exp: 'Jul 31, 2025', active: true },
  { code: 'WELCOME10', disc: '10% off', used: '892 / ∞', exp: 'No expiry', active: true },
  { code: 'BFCM50', disc: '50% off', used: '500 / 500', exp: 'Dec 1, 2024', active: false },
];

const CouponsPage = () => {
  const [coupons, setCoupons] = useState<Coupon[]>(seed);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ code: '', percent: '10', limit: '', exp: '' });
  const [busy, setBusy] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const code = form.code.trim().toUpperCase();
    const pct = Number(form.percent);
    if (!code) { toast.error('Coupon code is required'); return; }
    if (!/^[A-Z0-9_-]{3,20}$/.test(code)) { toast.error('Code must be 3–20 chars (A-Z, 0-9, _ or -)'); return; }
    if (Number.isNaN(pct) || pct <= 0 || pct > 100) { toast.error('Discount must be 1–100'); return; }
    if (coupons.some(c => c.code === code)) { toast.error('Coupon code already exists'); return; }
    setBusy(true);
    setTimeout(() => {
      const limit = form.limit.trim() || '∞';
      setCoupons(prev => [
        { code, disc: `${pct}% off`, used: `0 / ${limit}`, exp: form.exp.trim() || 'No expiry', active: true },
        ...prev,
      ]);
      toast.success(`Coupon ${code} created`);
      setForm({ code: '', percent: '10', limit: '', exp: '' });
      setOpen(false); setBusy(false);
    }, 250);
  };

  const toggle = (code: string) => {
    setCoupons(prev => prev.map(c => c.code === code ? { ...c, active: !c.active } : c));
    const c = coupons.find(x => x.code === code);
    toast.success(`Coupon ${code} ${c?.active ? 'deactivated' : 'activated'}`);
  };

  const remove = (code: string) => {
    if (!window.confirm(`Delete coupon ${code}?`)) return;
    setCoupons(prev => prev.filter(c => c.code !== code));
    toast.success(`Coupon ${code} deleted`);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Coupons</h1>
          <p className="text-sm text-muted-foreground">Discount codes and promotions.</p>
        </div>
        <button onClick={() => setOpen(true)} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" /> New coupon
        </button>
      </div>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-muted-foreground">
            <tr className="text-left">
              <th className="px-5 py-3 text-xs font-semibold uppercase">Code</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase">Discount</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase">Used</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase">Expires</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase">Status</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-foreground">
            {coupons.map(c => (
              <tr key={c.code}>
                <td className="px-5 py-3"><Ticket className="inline h-4 w-4 mr-2 text-primary" /><span className="font-mono font-semibold">{c.code}</span></td>
                <td className="px-5 py-3 font-semibold">{c.disc}</td>
                <td className="px-5 py-3">{c.used}</td>
                <td className="px-5 py-3">{c.exp}</td>
                <td className="px-5 py-3">
                  <button onClick={() => toggle(c.code)} className={`text-xs px-2 py-0.5 rounded transition-colors ${c.active ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' : 'bg-muted text-muted-foreground hover:bg-muted/70'}`}>
                    {c.active ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => remove(c.code)} aria-label={`Delete ${c.code}`} className="text-muted-foreground hover:text-destructive p-1 rounded">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-muted-foreground">No coupons yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => !busy && setOpen(false)}>
          <form onClick={e => e.stopPropagation()} onSubmit={handleCreate} className="w-full max-w-md rounded-xl border border-border bg-card p-6 space-y-4 shadow-xl">
            <h2 className="text-lg font-semibold text-foreground">New coupon</h2>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Code *</label>
              <input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} required placeholder="SUMMER25"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono uppercase outline-none focus:border-primary" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Discount % *</label>
                <input type="number" min={1} max={100} value={form.percent} onChange={e => setForm(f => ({ ...f, percent: e.target.value }))} required
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Usage limit</label>
                <input value={form.limit} onChange={e => setForm(f => ({ ...f, limit: e.target.value }))} placeholder="Unlimited"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Expires</label>
              <input value={form.exp} onChange={e => setForm(f => ({ ...f, exp: e.target.value }))} placeholder="e.g. Dec 31, 2025"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setOpen(false)} disabled={busy}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-accent disabled:opacity-50">Cancel</button>
              <button type="submit" disabled={busy}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
                {busy ? 'Creating…' : 'Create coupon'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
export default CouponsPage;
