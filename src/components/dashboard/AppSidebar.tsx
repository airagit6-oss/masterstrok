import {
  BarChart3, FileText, Activity, Server, Users, AppWindow,
  DollarSign, Bell, LayoutDashboard, Settings, Compass, Zap
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Compass, label: "Overview", path: "/" },
  { icon: BarChart3, label: "Metrics Explorer", path: "/metrics" },
  { icon: FileText, label: "Logs Explorer", path: "/logs" },
  { icon: Zap, label: "Traces / APM", path: "/traces" },
  { icon: Server, label: "Infrastructure", path: "/infrastructure" },
  { icon: Users, label: "Users Monitoring", path: "/users" },
  { icon: AppWindow, label: "Apps Monitoring", path: "/apps" },
  { icon: DollarSign, label: "Revenue Metrics", path: "/revenue" },
  { icon: Bell, label: "Alerts", path: "/alerts" },
  { icon: LayoutDashboard, label: "Dashboards", path: "/dashboards" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

interface Props {
  isOpen: boolean;
  onToggle: () => void;
}

export function AppSidebar({ isOpen }: Props) {
  return (
    <aside
      className={cn(
        "h-screen bg-dd-deep border-r border-border flex flex-col transition-all duration-200 shrink-0",
        isOpen ? "w-56" : "w-14"
      )}
    >
      {/* Logo */}
      <div className="h-12 flex items-center px-3 border-b border-border gap-2">
        <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center shrink-0">
          <Activity className="w-4 h-4 text-primary-foreground" />
        </div>
        {isOpen && <span className="font-semibold text-sm text-foreground tracking-tight">BossPanel</span>}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 mx-1 rounded-md text-sm transition-colors",
                isActive
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )
            }
          >
            <item.icon className="w-4 h-4 shrink-0" />
            {isOpen && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-border">
        {isOpen && (
          <div className="text-xs text-muted-foreground">
            v2.4.1 · <span className="text-dd-success">Connected</span>
          </div>
        )}
      </div>
    </aside>
  );
}
