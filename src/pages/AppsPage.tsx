import { useState } from "react";
import { generateApps } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

export default function AppsPage() {
  const [apps] = useState(generateApps());

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-medium text-foreground">Apps Monitoring</h2>
      <div className="grid grid-cols-1 gap-2">
        {apps.map((app) => (
          <div key={app.name} className="dd-panel p-3 flex items-center gap-4 hover:bg-accent/30 cursor-pointer transition-colors">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-foreground">{app.name}</span>
                <span className={app.status === 'Running' ? "dd-badge-success" : "dd-badge-error"}>{app.status}</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span><strong className="text-foreground">{app.activeUsers.toLocaleString()}</strong> users</span>
                <span><strong className="text-foreground">{app.requestsMin.toLocaleString()}</strong> req/min</span>
                <span className={cn(app.errorPercent > 3 ? "text-dd-error" : "text-muted-foreground")}>
                  <strong className={app.errorPercent > 3 ? "text-dd-error" : "text-foreground"}>{app.errorPercent}%</strong> errors
                </span>
              </div>
            </div>
            <div className="w-32 h-8">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={app.sparkline}>
                  <defs>
                    <linearGradient id={`app-${app.name}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={app.status === 'Running' ? "hsl(142,71%,45%)" : "hsl(0,72%,51%)"} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={app.status === 'Running' ? "hsl(142,71%,45%)" : "hsl(0,72%,51%)"} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="v" stroke={app.status === 'Running' ? "hsl(142,71%,45%)" : "hsl(0,72%,51%)"} fill={`url(#app-${app.name})`} strokeWidth={1.5} dot={false} isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
