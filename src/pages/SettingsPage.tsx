import { Settings as SettingsIcon } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-4 max-w-2xl">
      <h2 className="text-sm font-medium text-foreground">Settings</h2>
      
      <div className="dd-panel p-4 space-y-4">
        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-wider">Organization</label>
          <input className="w-full mt-1 h-8 px-3 bg-secondary border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" defaultValue="Acme Corporation" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-wider">Refresh Interval</label>
          <select className="w-full mt-1 h-8 px-3 bg-secondary border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
            <option>1 second</option>
            <option>5 seconds</option>
            <option>15 seconds</option>
            <option>30 seconds</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-wider">Alert Notifications</label>
          <div className="flex items-center gap-2 mt-1">
            <input type="checkbox" defaultChecked className="accent-primary" /> Email
            <input type="checkbox" defaultChecked className="accent-primary" /> Slack
            <input type="checkbox" className="accent-primary" /> PagerDuty
          </div>
        </div>
      </div>
    </div>
  );
}
