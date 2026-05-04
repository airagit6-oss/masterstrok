import { useState, useEffect } from "react";
import { toast } from "sonner";

const SETTINGS_KEY = "saashub_observability_settings";

interface Settings {
  organization: string;
  refreshInterval: string;
  notifications: { email: boolean; slack: boolean; pagerduty: boolean };
}

const DEFAULTS: Settings = {
  organization: "Acme Corporation",
  refreshInterval: "5 seconds",
  notifications: { email: true, slack: true, pagerduty: false },
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (raw) setSettings({ ...DEFAULTS, ...JSON.parse(raw) });
    } catch { /* ignore */ }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (settings.organization.trim().length < 2) {
      toast.error("Organization name is required");
      return;
    }
    setSaving(true);
    setTimeout(() => {
      try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        toast.success("Settings saved");
      } catch {
        toast.error("Could not save settings");
      } finally {
        setSaving(false);
      }
    }, 350);
  };

  return (
    <form onSubmit={handleSave} className="space-y-4 max-w-2xl">
      <h2 className="text-sm font-medium text-foreground">Settings</h2>

      <div className="dd-panel p-4 space-y-4">
        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-wider">Organization</label>
          <input
            className="w-full mt-1 h-8 px-3 bg-secondary border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            value={settings.organization}
            onChange={e => setSettings(s => ({ ...s, organization: e.target.value }))}
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-wider">Refresh Interval</label>
          <select
            className="w-full mt-1 h-8 px-3 bg-secondary border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            value={settings.refreshInterval}
            onChange={e => setSettings(s => ({ ...s, refreshInterval: e.target.value }))}
          >
            <option>1 second</option>
            <option>5 seconds</option>
            <option>15 seconds</option>
            <option>30 seconds</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-wider">Alert Notifications</label>
          <div className="flex items-center gap-4 mt-1 text-sm text-foreground">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-primary"
                checked={settings.notifications.email}
                onChange={e => setSettings(s => ({ ...s, notifications: { ...s.notifications, email: e.target.checked } }))} />
              Email
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-primary"
                checked={settings.notifications.slack}
                onChange={e => setSettings(s => ({ ...s, notifications: { ...s.notifications, slack: e.target.checked } }))} />
              Slack
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-primary"
                checked={settings.notifications.pagerduty}
                onChange={e => setSettings(s => ({ ...s, notifications: { ...s.notifications, pagerduty: e.target.checked } }))} />
              PagerDuty
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={saving}
          className="text-sm rounded-md bg-primary text-primary-foreground px-4 py-2 hover:bg-primary/90 disabled:opacity-50">
          {saving ? "Saving…" : "Save settings"}
        </button>
      </div>
    </form>
  );
}
