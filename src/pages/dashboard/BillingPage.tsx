import { CreditCard, Plus } from 'lucide-react';

const BillingPage = () => (
  <div className="max-w-3xl">
    <h1 className="text-2xl font-bold text-foreground mb-1">Billing</h1>
    <p className="text-sm text-muted-foreground mb-6">Manage payment methods and invoices.</p>
    <div className="rounded-xl border border-border bg-card p-6 mb-4">
      <h2 className="text-sm font-semibold text-foreground mb-4">Payment methods</h2>
      <div className="flex items-center justify-between rounded-lg border border-border p-4">
        <div className="flex items-center gap-3">
          <CreditCard className="h-8 w-8 text-primary" />
          <div>
            <p className="text-sm font-medium text-foreground">Visa •••• 4242</p>
            <p className="text-xs text-muted-foreground">Expires 12/27</p>
          </div>
        </div>
        <span className="text-xs font-medium px-2 py-1 rounded bg-primary/10 text-primary">Default</span>
      </div>
      <button className="mt-3 flex items-center gap-2 text-sm text-primary font-medium hover:underline">
        <Plus className="h-4 w-4" /> Add payment method
      </button>
    </div>
    <div className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-sm font-semibold text-foreground mb-4">Recent invoices</h2>
      <div className="space-y-2">
        {[
          { id: 'INV-2024-001', amount: '$29.00', date: 'Mar 15, 2025', status: 'Paid' },
          { id: 'INV-2024-002', amount: '$29.00', date: 'Feb 15, 2025', status: 'Paid' },
        ].map(inv => (
          <div key={inv.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
            <div>
              <p className="text-sm font-medium text-foreground">{inv.id}</p>
              <p className="text-xs text-muted-foreground">{inv.date}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-foreground">{inv.amount}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-green-500/10 text-green-500">{inv.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
export default BillingPage;
