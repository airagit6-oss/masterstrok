export default function TracesPage() {
  const traces = Array.from({ length: 15 }, (_, i) => ({
    id: `trace_${Math.random().toString(36).substring(2, 10)}`,
    service: ['api-gateway', 'auth-service', 'payment-processor', 'data-pipeline', 'cdn-manager'][i % 5],
    operation: ['GET /api/users', 'POST /auth/login', 'POST /payments', 'GET /data/stream', 'GET /cdn/assets'][i % 5],
    duration: Math.floor(Math.random() * 500 + 10),
    status: Math.random() > 0.15 ? 200 : [500, 502, 403][Math.floor(Math.random() * 3)],
    spans: Math.floor(Math.random() * 12 + 2),
    time: `${Math.floor(Math.random() * 60)}s ago`,
  }));

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-medium text-foreground">Traces / APM</h2>
      <div className="dd-panel">
        <div className="grid grid-cols-[120px_120px_1fr_80px_60px_60px_70px] gap-2 px-3 py-2 border-b border-border text-xs text-muted-foreground uppercase tracking-wider font-medium">
          <span>Trace ID</span>
          <span>Service</span>
          <span>Operation</span>
          <span>Duration</span>
          <span>Status</span>
          <span>Spans</span>
          <span>Time</span>
        </div>
        {traces.map((t) => (
          <div key={t.id} className="grid grid-cols-[120px_120px_1fr_80px_60px_60px_70px] gap-2 px-3 py-1.5 text-xs border-b border-border/50 hover:bg-accent/50 cursor-pointer transition-colors">
            <span className="dd-text-mono text-primary truncate">{t.id}</span>
            <span className="text-foreground">{t.service}</span>
            <span className="dd-text-mono text-muted-foreground">{t.operation}</span>
            <span className="dd-text-mono text-foreground">
              <span className="inline-block h-1 rounded-full bg-dd-info mr-1.5" style={{ width: `${Math.min(t.duration / 5, 50)}px` }} />
              {t.duration}ms
            </span>
            <span className={t.status === 200 ? "dd-badge-success w-fit" : "dd-badge-error w-fit"}>{t.status}</span>
            <span className="text-muted-foreground">{t.spans}</span>
            <span className="text-muted-foreground">{t.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
