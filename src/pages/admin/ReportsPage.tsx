import { FileBarChart, Download } from 'lucide-react';

const ReportsPage = () => (
  <div>
    <h1 className="text-2xl font-bold text-foreground mb-1">Reports</h1>
    <p className="text-sm text-muted-foreground mb-6">Generate and download platform reports.</p>
    <div className="grid grid-cols-2 gap-4">
      {[
        { name: 'Monthly Revenue Report — April 2025', type: 'PDF', size: '348 KB' },
        { name: 'Vendor Performance — Q1 2025', type: 'XLSX', size: '512 KB' },
        { name: 'User Growth Analytics', type: 'CSV', size: '96 KB' },
        { name: 'Subscription Churn Report', type: 'PDF', size: '184 KB' },
        { name: 'Tax Summary — 2024', type: 'PDF', size: '722 KB' },
        { name: 'Top Products by Category', type: 'XLSX', size: '256 KB' },
      ].map(r => (
        <div key={r.name} className="rounded-xl border border-border bg-card p-4 flex items-start justify-between">
          <div className="flex gap-3 min-w-0">
            <FileBarChart className="h-8 w-8 text-primary shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{r.name}</p>
              <p className="text-xs text-muted-foreground">{r.type} · {r.size}</p>
            </div>
          </div>
          <button className="shrink-0 ml-2 p-1.5 rounded hover:bg-accent">
            <Download className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      ))}
    </div>
  </div>
);
export default ReportsPage;
