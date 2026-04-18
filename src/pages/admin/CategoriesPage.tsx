import { FolderTree, Plus } from 'lucide-react';

const CategoriesPage = () => {
  const cats = [
    { name: 'E-commerce', subs: ['Marketplace', 'Headless', 'POS'], count: 24 },
    { name: 'Education', subs: ['LMS', 'Live classes', 'Quizzes'], count: 18 },
    { name: 'Manufacturing', subs: ['ERP', 'Quality', 'Lean'], count: 12 },
    { name: 'CRM & Sales', subs: ['Pipeline', 'Email', 'Analytics'], count: 31 },
  ];
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Categories</h1>
          <p className="text-sm text-muted-foreground">Organize the marketplace taxonomy.</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" /> New category
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {cats.map(c => (
          <div key={c.name} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex gap-3">
                <FolderTree className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.count} products</p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {c.subs.map(s => (
                <span key={s} className="text-xs px-2 py-1 rounded bg-secondary text-muted-foreground">{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default CategoriesPage;
