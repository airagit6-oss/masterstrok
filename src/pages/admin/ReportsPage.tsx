import { FileBarChart, Download } from 'lucide-react';
import { toast } from 'sonner';

interface Report { name: string; type: string; size: string; }

const reports: Report[] = [
  { name: 'Monthly Revenue Report — April 2025', type: 'PDF', size: '348 KB' },
  { name: 'Vendor Performance — Q1 2025', type: 'XLSX', size: '512 KB' },
  { name: 'User Growth Analytics', type: 'CSV', size: '96 KB' },
  { name: 'Subscription Churn Report', type: 'PDF', size: '184 KB' },
  { name: 'Tax Summary — 2024', type: 'PDF', size: '722 KB' },
  { name: 'Top Products by Category', type: 'XLSX', size: '256 KB' },
];

const mimeFor: Record<string, string> = {
  PDF: 'application/pdf',
  CSV: 'text/csv',
  XLSX: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
};

const ReportsPage = () => {
  const handleDownload = (r: Report) => {
    const ext = r.type.toLowerCase();
    const content = `${r.name}\nGenerated: ${new Date().toISOString()}\nType: ${r.type}\nSize: ${r.size}\n`;
    const blob = new Blob([content], { type: mimeFor[r.type] ?? 'text/plain' });
    const url = URL.createObjectURL(blob);
    const safe = r.name.replace(/[^\w\d-]+/g, '_').replace(/^_+|_+$/g, '');
    const a = document.createElement('a');
    a.href = url;
    a.download = `${safe}.${ext}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success(`${r.name} downloaded`);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-1">Reports</h1>
      <p className="text-sm text-muted-foreground mb-6">Generate and download platform reports.</p>
      <div className="grid grid-cols-2 gap-4">
        {reports.map(r => (
          <div key={r.name} className="rounded-xl border border-border bg-card p-4 flex items-start justify-between">
            <div className="flex gap-3 min-w-0">
              <FileBarChart className="h-8 w-8 text-primary shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{r.name}</p>
                <p className="text-xs text-muted-foreground">{r.type} · {r.size}</p>
              </div>
            </div>
            <button onClick={() => handleDownload(r)} aria-label={`Download ${r.name}`}
              className="shrink-0 ml-2 p-1.5 rounded hover:bg-accent transition-colors">
              <Download className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ReportsPage;
