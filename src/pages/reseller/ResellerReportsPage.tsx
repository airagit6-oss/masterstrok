import { FileBarChart, Download } from 'lucide-react';
import { toast } from 'sonner';

interface Report { name: string; size: string; type: 'PDF' | 'CSV' | 'XLSX'; }

const reports: Report[] = [
  { name: 'Sales Summary — April 2025', size: '124 KB', type: 'PDF' },
  { name: 'Commission Statement — Q1 2025', size: '88 KB', type: 'PDF' },
  { name: 'Lead Conversion Report', size: '52 KB', type: 'CSV' },
  { name: 'Client Activity — March', size: '210 KB', type: 'XLSX' },
];

const mimeFor: Record<Report['type'], string> = {
  PDF: 'application/pdf',
  CSV: 'text/csv',
  XLSX: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
};

const ResellerReportsPage = () => {
  const handleDownload = (r: Report) => {
    const content = `${r.name}\nGenerated: ${new Date().toISOString()}\nFormat: ${r.type}\n`;
    const blob = new Blob([content], { type: mimeFor[r.type] });
    const url = URL.createObjectURL(blob);
    const safe = r.name.replace(/[^\w\d-]+/g, '_');
    const a = document.createElement('a');
    a.href = url; a.download = `${safe}.${r.type.toLowerCase()}`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success(`${r.name} downloaded`);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1" style={{ color: '#1a1a1a' }}>Reports</h1>
      <p className="text-sm mb-6" style={{ color: '#6d7175' }}>Download performance reports.</p>
      <div className="grid grid-cols-2 gap-4">
        {reports.map(r => (
          <div key={r.name} className="rounded-lg bg-white border p-4 flex items-start justify-between" style={{ borderColor: '#e1e3e5' }}>
            <div className="flex gap-3 min-w-0">
              <FileBarChart className="h-8 w-8 shrink-0" style={{ color: '#008060' }} />
              <div className="min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: '#1a1a1a' }}>{r.name}</p>
                <p className="text-xs" style={{ color: '#6d7175' }}>{r.type} · {r.size}</p>
              </div>
            </div>
            <button onClick={() => handleDownload(r)} aria-label={`Download ${r.name}`}
              className="shrink-0 ml-2 p-1.5 rounded hover:bg-gray-100 transition-colors">
              <Download className="h-4 w-4" style={{ color: '#6d7175' }} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ResellerReportsPage;
