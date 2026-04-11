import { useState, useRef } from 'react';
import { DollarSign } from 'lucide-react';

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

const stageConfig: Record<LeadStatus, { color: string; bg: string; lightBg: string }> = {
  'New Lead': { color: '#0070f3', bg: '#e0f0ff', lightBg: '#f5faff' },
  'Contacted': { color: '#b98900', bg: '#fef3e0', lightBg: '#fffcf5' },
  'Qualified': { color: '#7c3aed', bg: '#f3e8ff', lightBg: '#faf5ff' },
  'Converted': { color: '#008060', bg: '#e4f3e8', lightBg: '#f5fdf8' },
};

const stages: LeadStatus[] = ['New Lead', 'Contacted', 'Qualified', 'Converted'];

const ResellerPipelinePage = () => {
  const [board, setBoard] = useState<PipelineBoard>(initialBoard);
  const dragItem = useRef<{ id: string; fromStage: LeadStatus } | null>(null);
  const [dragOver, setDragOver] = useState<LeadStatus | null>(null);

  const onDragStart = (id: string, fromStage: LeadStatus) => { dragItem.current = { id, fromStage }; };

  const onDrop = (toStage: LeadStatus) => {
    if (!dragItem.current) return;
    const { id, fromStage } = dragItem.current;
    if (fromStage === toStage) { dragItem.current = null; setDragOver(null); return; }
    setBoard(prev => {
      const lead = prev[fromStage].find(l => l.id === id);
      if (!lead) return prev;
      return { ...prev, [fromStage]: prev[fromStage].filter(l => l.id !== id), [toStage]: [lead, ...prev[toStage]] };
    });
    dragItem.current = null;
    setDragOver(null);
  };

  const totalValue = stages.reduce((sum, s) => sum + board[s].reduce((a, l) => a + l.value, 0), 0);
  const totalLeads = stages.reduce((s, st) => s + board[st].length, 0);
  const convertedValue = board['Converted'].reduce((a, l) => a + l.value, 0);
  const conversionRate = totalLeads > 0 ? Math.round((board['Converted'].length / totalLeads) * 100) : 0;

  return (
    <div className="space-y-5 max-w-[1200px]">
      <div>
        <h2 className="text-xl font-semibold" style={{ color: '#1a1a1a' }}>Pipeline</h2>
        <p className="text-sm mt-0.5" style={{ color: '#6d7175' }}>Drag merchants across stages to track your sales pipeline</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Leads', value: totalLeads },
          { label: 'Pipeline Value', value: `$${totalValue.toLocaleString()}` },
          { label: 'Won', value: `$${convertedValue.toLocaleString()}`, color: '#008060' },
          { label: 'Conversion', value: `${conversionRate}%` },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl border p-4" style={{ borderColor: '#e1e3e5' }}>
            <p className="text-xs font-medium" style={{ color: '#6d7175' }}>{k.label}</p>
            <p className="text-2xl font-bold mt-1" style={{ color: k.color ?? '#1a1a1a' }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Kanban */}
      <div className="grid grid-cols-4 gap-4">
        {stages.map(stage => {
          const cfg = stageConfig[stage];
          const stageValue = board[stage].reduce((a, l) => a + l.value, 0);
          return (
            <div
              key={stage}
              onDragOver={e => { e.preventDefault(); setDragOver(stage); }}
              onDragLeave={() => setDragOver(null)}
              onDrop={() => onDrop(stage)}
              className="rounded-xl min-h-[280px] p-3 space-y-2.5 transition-all"
              style={{
                background: cfg.lightBg,
                border: `2px solid ${dragOver === stage ? cfg.color : '#e1e3e5'}`,
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold" style={{ background: cfg.bg, color: cfg.color }}>{stage}</span>
                  <span className="text-xs font-medium" style={{ color: '#8c9196' }}>{board[stage].length}</span>
                </div>
                <span className="text-xs font-medium" style={{ color: cfg.color }}>${stageValue.toLocaleString()}</span>
              </div>

              {board[stage].map(lead => (
                <div
                  key={lead.id}
                  draggable
                  onDragStart={() => onDragStart(lead.id, stage)}
                  className="rounded-xl bg-white border p-3.5 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
                  style={{ borderColor: '#e1e3e5' }}
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: cfg.color }}>
                      {lead.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[13px] truncate" style={{ color: '#1a1a1a' }}>{lead.name}</p>
                      <p className="text-[10px] truncate" style={{ color: '#8c9196' }}>{lead.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px]" style={{ color: '#6d7175' }}>{lead.source}</span>
                    <span className="text-xs font-semibold" style={{ color: cfg.color }}>
                      <DollarSign className="h-3 w-3 inline" />{lead.value}
                    </span>
                  </div>
                </div>
              ))}

              {board[stage].length === 0 && (
                <div className="rounded-xl border-2 border-dashed p-6 text-center" style={{ borderColor: '#e1e3e5' }}>
                  <p className="text-xs" style={{ color: '#8c9196' }}>Drop here</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResellerPipelinePage;
