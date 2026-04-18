import { Ticket, Plus } from 'lucide-react';

const CouponsPage = () => (
  <div>
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Coupons</h1>
        <p className="text-sm text-muted-foreground">Discount codes and promotions.</p>
      </div>
      <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
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
          </tr>
        </thead>
        <tbody className="divide-y divide-border text-foreground">
          {[
            { code: 'SUMMER25', disc: '25% off', used: '142 / 500', exp: 'Jul 31, 2025', active: true },
            { code: 'WELCOME10', disc: '10% off', used: '892 / ∞', exp: 'No expiry', active: true },
            { code: 'BFCM50', disc: '50% off', used: '500 / 500', exp: 'Dec 1, 2024', active: false },
          ].map(c => (
            <tr key={c.code}>
              <td className="px-5 py-3"><Ticket className="inline h-4 w-4 mr-2 text-primary" /><span className="font-mono font-semibold">{c.code}</span></td>
              <td className="px-5 py-3 font-semibold">{c.disc}</td>
              <td className="px-5 py-3">{c.used}</td>
              <td className="px-5 py-3">{c.exp}</td>
              <td className="px-5 py-3"><span className={`text-xs px-2 py-0.5 rounded ${c.active ? 'bg-green-500/10 text-green-500' : 'bg-muted text-muted-foreground'}`}>{c.active ? 'Active' : 'Expired'}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
export default CouponsPage;
