import { useState, useEffect, useRef } from "react";
import { generateLog } from "@/lib/mockData";
import { useAdminLogs } from "@/hooks/useAdminData";
import { cn } from "@/lib/utils";
import { Search, Filter } from "lucide-react";
import type { LogEntry } from "@/lib/api";

export default function LogsPage() {
  const { data: fetchedLogs = [] } = useAdminLogs(80);
  const [localLogs, setLocalLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState("");
  const [eventFilter, setEventFilter] = useState("all");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (fetchedLogs.length > 0) setLocalLogs(fetchedLogs);
  }, [fetchedLogs]);

  useEffect(() => {
    const iv = setInterval(() => {
      setLocalLogs(prev => [...prev.slice(-200), generateLog(prev.length)]);
    }, 2000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [localLogs]);

  const filtered = localLogs.filter(l => {
    const matchText = !filter || l.userId.includes(filter) || l.appName.toLowerCase().includes(filter.toLowerCase()) || l.message.toLowerCase().includes(filter.toLowerCase());
    const matchEvent = eventFilter === "all" || l.eventType === eventFilter;
    return matchText && matchEvent;
  });

  return (
    <div className="flex flex-col h-full gap-3">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Filter by user, app, message..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full h-8 pl-8 pr-3 bg-secondary border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex items-center gap-1 bg-secondary rounded-md p-0.5">
          {["all", "login", "payment", "error", "app_launch", "api_call"].map(t => (
            <button
              key={t}
              onClick={() => setEventFilter(t)}
              className={cn(
                "px-2 py-1 text-xs rounded-sm transition-colors capitalize",
                eventFilter === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Filter className="w-3 h-3" />
          <span>{filtered.length} events</span>
        </div>
      </div>

      <div className="dd-panel flex-1 flex flex-col min-h-0">
        <div className="grid grid-cols-[140px_100px_100px_120px_70px_1fr] gap-2 px-3 py-2 border-b border-border text-xs text-muted-foreground uppercase tracking-wider font-medium">
          <span>Timestamp</span>
          <span>Event</span>
          <span>User ID</span>
          <span>App</span>
          <span>Status</span>
          <span>Message</span>
        </div>
        <div ref={scrollRef} className="flex-1 overflow-auto">
          {filtered.map((log) => (
            <div
              key={log.id + log.timestamp}
              className={cn(
                "grid grid-cols-[140px_100px_100px_120px_70px_1fr] gap-2 px-3 py-1.5 text-xs border-b border-border/50 hover:bg-accent/50 cursor-pointer transition-colors",
                log.status === 'fail' && "bg-dd-error/5"
              )}
            >
              <span className="dd-text-mono text-muted-foreground">{new Date(log.timestamp).toLocaleTimeString()}</span>
              <span className={cn(
                "dd-badge-info w-fit",
                log.eventType === 'error' && "dd-badge-error",
                log.eventType === 'payment' && "dd-badge-success",
                log.eventType === 'login' && "dd-badge-info"
              )}>
                {log.eventType}
              </span>
              <span className="dd-text-mono text-muted-foreground truncate">{log.userId}</span>
              <span className="text-foreground truncate">{log.appName}</span>
              <span className={log.status === 'success' ? "dd-badge-success w-fit" : "dd-badge-error w-fit"}>
                {log.status}
              </span>
              <span className={cn("truncate", log.status === 'fail' ? "text-dd-error" : "text-muted-foreground")}>
                {log.message}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
