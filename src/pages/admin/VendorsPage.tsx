import { Store, CheckCircle2, Clock } from 'lucide-react';

const VendorsPage = () => (
  <div>
    <h1 className="text-2xl font-bold text-foreground mb-1">Vendors</h1>
    <p className="text-sm text-muted-foreground mb-6">Manage marketplace sellers.</p>
    <div className="grid grid-cols-3 gap-4 mb-6">
      {[
        { label: 'Total vendors', value: '128', icon: Store },
        { label: 'Approved', value: '112', icon: CheckCircle2 },
        { label: 'Pending review', value: '16', icon: Clock },
      ].map(s => (
        <div key={s.label} className="rounded-xl border border-border bg-card p-4">
          <s.icon className="h-5 w-5 text-primary mb-2" />
          <p className="text-xs text-muted-foreground">{s.label}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{s.value}</p>
        </div>
      ))}
    </div>
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-secondary text-muted-foreground">
          <tr className="text-left">
            <th className="px-5 py-3 text-xs font-semibold uppercase">Vendor</th>
            <th className="px-5 py-3 text-xs font-semibold uppercase">Products</th>
            <th className="px-5 py-3 text-xs font-semibold uppercase">Revenue</th>
            <th className="px-5 py-3 text-xs font-semibold uppercase">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border text-foreground">
          {[
            { name: 'CodeForge Studios', products: 12, revenue: '$48,200', status: 'Active' },
            { name: 'PixelLab', products: 8, revenue: '$22,800', status: 'Active' },
            { name: 'NextWave Apps', products: 4, revenue: '$9,400', status: 'Pending' },
          ].map(v => (
            <tr key={v.name}>
              <td className="px-5 py-3 font-medium">{v.name}</td>
              <td className="px-5 py-3">{v.products}</td>
              <td className="px-5 py-3 font-semibold">{v.revenue}</td>
              <td className="px-5 py-3"><span className={`text-xs px-2 py-0.5 rounded ${v.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>{v.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
export default VendorsPage;
