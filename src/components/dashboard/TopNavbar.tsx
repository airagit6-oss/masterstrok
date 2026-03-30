import { Search, Bell, PanelLeft, User } from "lucide-react";
import { useDashboard } from "./DashboardLayout";
import { cn } from "@/lib/utils";

const timeRanges = ["5m", "15m", "1h", "4h", "24h", "7d"];

export function TopNavbar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const { timeRange, setTimeRange, isLive, setIsLive, searchQuery, setSearchQuery } = useDashboard();

  return (
    <header className="h-12 border-b border-border bg-dd-deep flex items-center px-3 gap-3 shrink-0">
      <button onClick={onToggleSidebar} className="p-1.5 rounded-md hover:bg-accent text-muted-foreground">
        <PanelLeft className="w-4 h-4" />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search logs, metrics, users, apps..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-8 pl-8 pr-3 bg-secondary border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Time Range */}
      <div className="flex items-center gap-0.5 bg-secondary rounded-md p-0.5">
        {timeRanges.map((t) => (
          <button
            key={t}
            onClick={() => setTimeRange(t)}
            className={cn(
              "px-2 py-1 text-xs rounded-sm transition-colors",
              timeRange === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Live Toggle */}
      <button
        onClick={() => setIsLive(!isLive)}
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
          isLive ? "bg-dd-success/20 text-dd-success" : "bg-secondary text-muted-foreground"
        )}
      >
        <span className={cn("w-1.5 h-1.5 rounded-full", isLive ? "bg-dd-success animate-pulse-live" : "bg-muted-foreground")} />
        LIVE
      </button>

      {/* Notifications */}
      <button className="relative p-1.5 rounded-md hover:bg-accent text-muted-foreground">
        <Bell className="w-4 h-4" />
        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-dd-error rounded-full text-[8px] flex items-center justify-center text-primary-foreground font-bold">3</span>
      </button>

      {/* Profile */}
      <button className="w-7 h-7 rounded-full bg-accent flex items-center justify-center">
        <User className="w-3.5 h-3.5 text-muted-foreground" />
      </button>
    </header>
  );
}
