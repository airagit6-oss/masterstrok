import { useState } from "react";
import { generateAlerts } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle, XCircle, Clock } from "lucide-react";

export default function AlertsPage() {
  const [alerts] = useState(generateAlerts());

  const severityIcon = (s: string) => {
    if (s === 'Critical') return <XCircle className="w-4 h-4 text-dd-error" />;
    if (s === 'Medium') return <AlertTriangle className="w-4 h-4 text-dd-warning" />;
    return <Clock className="w-4 h-4 text-dd-info" />;
  };

  const activeCount = alerts.filter(a => a.status === 'Active').length;
  const criticalCount = alerts.filter(a => a.severity === 'Critical' && a.status === 'Active').length;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <h2 className="text-sm font-medium text-foreground">Alerts</h2>
        <span className="dd-badge-error">{criticalCount} critical</span>
        <span className="dd-badge-warning">{activeCount} active</span>
      </div>

      <div className="dd-panel">
        <div className="grid grid-cols-[32px_1fr_90px_80px_90px_140px] gap-2 px-3 py-2 border-b border-border text-xs text-muted-foreground uppercase tracking-wider font-medium">
          <span></span>
          <span>Alert</span>
          <span>Severity</span>
          <span>Status</span>
          <span>Time</span>
          <span>Rule</span>
        </div>
        {alerts.map((alert) => (
          <div key={alert.id} className={cn(
            "grid grid-cols-[32px_1fr_90px_80px_90px_140px] gap-2 px-3 py-2.5 border-b border-border/50 hover:bg-accent/50 cursor-pointer transition-colors",
            alert.severity === 'Critical' && alert.status === 'Active' && "bg-dd-error/5"
          )}>
            <span className="flex items-center">{severityIcon(alert.severity)}</span>
            <span className="text-sm text-foreground">{alert.name}</span>
            <span className={cn(
              "text-xs w-fit",
              alert.severity === 'Critical' ? "dd-badge-error" : alert.severity === 'Medium' ? "dd-badge-warning" : "dd-badge-info"
            )}>
              {alert.severity}
            </span>
            <span className={cn("text-xs w-fit", alert.status === 'Active' ? "dd-badge-error" : "dd-badge-success")}>
              {alert.status}
            </span>
            <span className="text-xs text-muted-foreground">{alert.time}</span>
            <span className="text-xs text-muted-foreground font-mono">{alert.rule}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
