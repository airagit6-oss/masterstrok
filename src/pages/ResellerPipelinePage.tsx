import { useState, useRef } from 'react';

type LeadStatus = 'New Lead' | 'Contacted' | 'Qualified' | 'Converted';

interface PipelineLead {
  id: string;
  name: string;
  email: string;
  value: number;
  source: string;
}

type PipelineBoard = Record<LeadStatus, PipelineLead[]>;

const initialBoard: PipelineBoard = {
  'New Lead': [
    { id: 'p1', name: 'Rahul Sharma', email: 'rahul@example.com', value: 500, source: 'Referral' },
    { id: 'p5', name: 'Fatima Al-Rashid', email: 'fatima@example.com', value: 300, source: 'Referral' },
  ],
  'Contacted': [
    { id: 'p2', name: 'Aisha Patel', email: 'aisha@example.com', value: 750, source: 'Website' },
    { id: 'p6', name: 'John Mitchell', email: 'john.m@example.com', value: 400, source: 'Google Ads' },
  ],
  'Qualified': [
    { id: 'p3', name: 'Carlos Torres', email: 'carlos@example.com', value: 1200, source: 'LinkedIn' },
  ],
  'Converted': [
    { id: 'p4', name: 'Li Wei', email: 'li.wei@example.com', value: 2000, source: 'Email Campaign' },
  ],
};

const stageColors: Record<LeadStatus, string> = {
  'New Lead': 'border-blue-500/40 bg-blue-500/5',
  'Contacted': 'border-yellow-500/40 bg-yellow-500/5',
  'Qualified': 'border-purple-500/40 bg-purple-500/5',
  'Converted': 'border-green-500/40 bg-green-500/5',
};

const stageBadge: Record<LeadStatus, string> = {
  'New Lead': 'bg-blue-500/20 text-blue-400',
  'Contacted': 'bg-yellow-500/20 text-yellow-400',
  'Qualified': 'bg-purple-500/20 text-purple-400',
  'Converted': 'bg-green-500/20 text-green-400',
};

const stages: LeadStatus[] = ['New Lead', 'Contacted', 'Qualified', 'Converted'];

const ResellerPipelinePage = () => {
  const [board, setBoard] = useState<PipelineBoard>(initialBoard);
  const dragItem = useRef<{ id: string; fromStage: LeadStatus } | null>(null);
  const [dragOver, setDragOver] = useState<LeadStatus | null>(null);

  const onDragStart = (id: string, fromStage: LeadStatus) => {
    dragItem.current = { id, fromStage };
  };

  const onDrop = (toStage: LeadStatus) => {
    if (!dragItem.current) return;
    const { id, fromStage } = dragItem.current;
    if (fromStage === toStage) { dragItem.current = null; setDragOver(null); return; }
    setBoard(prev => {
      const lead = prev[fromStage].find(l => l.id === id);
      if (!lead) return prev;
      return {
        ...prev,
        [fromStage]: prev[fromStage].filter(l => l.id !== id),
        [toStage]: [lead, ...prev[toStage]],
      };
    });
    dragItem.current = null;
    setDragOver(null);
  };

  const totalValue = stages.reduce((sum, s) => sum + board[s].reduce((a, l) => a + l.value, 0), 0);
  const convertedValue = board['Converted'].reduce((a, l) => a + l.value, 0);
  const conversionRate = stages.reduce((s, st) => s + board[st].length, 0) > 0
    ? Math.round((board['Converted'].length / stages.reduce((s, st) => s + board[st].length, 0)) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Pipeline</h1>
        <p className="text-sm text-muted-foreground mt-1">Drag leads across stages to track your sales pipeline</p>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Leads</p>
          <p className="text-2xl font-bold text-foreground mt-1">{stages.reduce((s, st) => s + board[st].length, 0)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Pipeline Value</p>
          <p className="text-2xl font-bold text-foreground mt-1">${totalValue.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Converted Value</p>
          <p className="text-2xl font-bold text-green-400 mt-1">${convertedValue.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Conversion Rate</p>
          <p className="text-2xl font-bold text-foreground mt-1">{conversionRate}%</p>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-4 gap-4">
        {stages.map(stage => (
          <div
            key={stage}
            onDragOver={e => { e.preventDefault(); setDragOver(stage); }}
            onDragLeave={() => setDragOver(null)}
            onDrop={() => onDrop(stage)}
            className={`rounded-xl border-2 min-h-64 p-3 space-y-3 transition-colors ${stageColors[stage]} ${dragOver === stage ? 'ring-2 ring-primary' : ''}`}
          >
            <div className="flex items-center justify-between">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${stageBadge[stage]}`}>{stage}</span>
              <span className="text-xs font-medium text-muted-foreground">{board[stage].length}</span>
            </div>

            {board[stage].map(lead => (
              <div
                key={lead.id}
                draggable
                onDragStart={() => onDragStart(lead.id, stage)}
                className="rounded-lg border border-border bg-card p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
              >
                <p className="font-medium text-sm text-foreground">{lead.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{lead.email}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground">{lead.source}</span>
                  <span className="text-xs font-semibold text-primary">${lead.value}</span>
                </div>
              </div>
            ))}

            {board[stage].length === 0 && (
              <div className="rounded-lg border-2 border-dashed border-border/50 p-4 text-center">
                <p className="text-xs text-muted-foreground">Drop here</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResellerPipelinePage;
