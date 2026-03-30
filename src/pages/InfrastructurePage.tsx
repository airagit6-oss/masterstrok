import { useState } from "react";
import { generateServers } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

export default function InfrastructurePage() {
  const [servers] = useState(generateServers());

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-medium text-foreground">Infrastructure</h2>
      <div className="grid grid-cols-2 gap-3">
        {servers.map((s) => (
          <div key={s.name} className="dd-panel p-3">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className={cn("w-2 h-2 rounded-full", s.status === 'Healthy' ? "bg-dd-success" : "bg-dd-warning animate-pulse-live")} />
                <span className="text-sm font-medium text-foreground font-mono">{s.name}</span>
              </div>
              <span className={s.status === 'Healthy' ? "dd-badge-success" : "dd-badge-warning"}>{s.status}</span>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div>
                <div className="text-xs text-muted-foreground mb-1">CPU</div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full transition-all", s.cpu > 80 ? "bg-dd-error" : s.cpu > 60 ? "bg-dd-warning" : "bg-dd-info")} style={{ width: `${s.cpu}%` }} />
                </div>
                <div className="text-xs font-mono text-foreground mt-0.5">{s.cpu}%</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">RAM</div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full", s.ram > 80 ? "bg-dd-error" : s.ram > 60 ? "bg-dd-warning" : "bg-dd-success")} style={{ width: `${s.ram}%` }} />
                </div>
                <div className="text-xs font-mono text-foreground mt-0.5">{s.ram}%</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Disk</div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-dd-chart-purple" style={{ width: `${s.disk}%` }} />
                </div>
                <div className="text-xs font-mono text-foreground mt-0.5">{s.disk}%</div>
              </div>
            </div>
            <div className="h-12">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={s.sparkline}>
                  <defs>
                    <linearGradient id={`srv-${s.name}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(210,100%,56%)" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="hsl(210,100%,56%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="v" stroke="hsl(210,100%,56%)" fill={`url(#srv-${s.name})`} strokeWidth={1} dot={false} isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
