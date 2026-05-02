import { CreditCard, Plus, Download } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Card { id: string; brand: string; last4: string; exp: string; }
interface Invoice { id: string; amount: string; date: string; status: 'Paid' | 'Pending'; }

const initialCards: Card[] = [
  { id: 'c1', brand: 'Visa', last4: '4242', exp: '12/27' },
];

const invoices: Invoice[] = [
  { id: 'INV-2024-001', amount: '$29.00', date: 'Mar 15, 2025', status: 'Paid' },
  { id: 'INV-2024-002', amount: '$29.00', date: 'Feb 15, 2025', status: 'Paid' },
];

const BillingPage = () => {
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ number: '', exp: '', cvc: '' });
  const [busy, setBusy] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const digits = form.number.replace(/\s+/g, '');
    if (!/^\d{13,19}$/.test(digits)) { toast.error('Card number must be 13–19 digits'); return; }
    if (!/^\d{2}\/\d{2}$/.test(form.exp)) { toast.error('Expiry must be MM/YY'); return; }
    if (!/^\d{3,4}$/.test(form.cvc)) { toast.error('CVC must be 3 or 4 digits'); return; }
    setBusy(true);
    setTimeout(() => {
      const brand = digits.startsWith('4') ? 'Visa' : digits.startsWith('5') ? 'Mastercard' : digits.startsWith('3') ? 'Amex' : 'Card';
      setCards(prev => [...prev, { id: `c${Date.now()}`, brand, last4: digits.slice(-4), exp: form.exp }]);
      toast.success(`${brand} •••• ${digits.slice(-4)} added`);
      setForm({ number: '', exp: '', cvc: '' });
      setOpen(false); setBusy(false);
    }, 400);
  };

  const removeCard = (id: string) => {
    if (cards.length === 1) { toast.error('You must keep at least one payment method'); return; }
    if (!window.confirm('Remove this payment method?')) return;
    setCards(prev => prev.filter(c => c.id !== id));
    toast.success('Payment method removed');
  };

  const downloadInvoice = (inv: Invoice) => {
    const txt = `Invoice ${inv.id}\nDate: ${inv.date}\nAmount: ${inv.amount}\nStatus: ${inv.status}\n`;
    const blob = new Blob([txt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${inv.id}.txt`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success(`${inv.id} downloaded`);
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-foreground mb-1">Billing</h1>
      <p className="text-sm text-muted-foreground mb-6">Manage payment methods and invoices.</p>
      <div className="rounded-xl border border-border bg-card p-6 mb-4">
        <h2 className="text-sm font-semibold text-foreground mb-4">Payment methods</h2>
        <div className="space-y-2">
          {cards.map((c, i) => (
            <div key={c.id} className="flex items-center justify-between rounded-lg border border-border p-4">
              <div className="flex items-center gap-3">
                <CreditCard className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">{c.brand} •••• {c.last4}</p>
                  <p className="text-xs text-muted-foreground">Expires {c.exp}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {i === 0 && <span className="text-xs font-medium px-2 py-1 rounded bg-primary/10 text-primary">Default</span>}
                <button onClick={() => removeCard(c.id)} className="text-xs text-destructive hover:underline">Remove</button>
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => setOpen(true)} className="mt-3 flex items-center gap-2 text-sm text-primary font-medium hover:underline">
          <Plus className="h-4 w-4" /> Add payment method
        </button>
      </div>
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-sm font-semibold text-foreground mb-4">Recent invoices</h2>
        <div className="space-y-2">
          {invoices.map(inv => (
            <div key={inv.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div>
                <p className="text-sm font-medium text-foreground">{inv.id}</p>
                <p className="text-xs text-muted-foreground">{inv.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-foreground">{inv.amount}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-green-500/10 text-green-500">{inv.status}</span>
                <button onClick={() => downloadInvoice(inv)} aria-label={`Download ${inv.id}`}
                  className="p-1 rounded hover:bg-accent">
                  <Download className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => !busy && setOpen(false)}>
          <form onClick={e => e.stopPropagation()} onSubmit={submit} className="w-full max-w-md rounded-xl border border-border bg-card p-6 space-y-4 shadow-xl">
            <h2 className="text-lg font-semibold text-foreground">Add payment method</h2>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Card number</label>
              <input value={form.number} onChange={e => setForm(f => ({ ...f, number: e.target.value }))} placeholder="4242 4242 4242 4242" inputMode="numeric"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono outline-none focus:border-primary" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Expiry (MM/YY)</label>
                <input value={form.exp} onChange={e => setForm(f => ({ ...f, exp: e.target.value }))} placeholder="12/27" maxLength={5}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">CVC</label>
                <input value={form.cvc} onChange={e => setForm(f => ({ ...f, cvc: e.target.value }))} placeholder="123" inputMode="numeric" maxLength={4}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono outline-none focus:border-primary" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setOpen(false)} disabled={busy}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-accent disabled:opacity-50">Cancel</button>
              <button type="submit" disabled={busy}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
                {busy ? 'Adding…' : 'Add card'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default BillingPage;
