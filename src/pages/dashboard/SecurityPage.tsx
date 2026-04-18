import { Shield, Key, Smartphone, AlertTriangle } from 'lucide-react';

const SecurityPage = () => (
  <div className="max-w-2xl">
    <h1 className="text-2xl font-bold text-foreground mb-1">Security</h1>
    <p className="text-sm text-muted-foreground mb-6">Keep your account safe.</p>
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-5 flex items-start justify-between">
        <div className="flex gap-3">
          <Key className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-foreground">Password</p>
            <p className="text-xs text-muted-foreground">Last changed 3 months ago</p>
          </div>
        </div>
        <button className="text-sm text-primary font-medium hover:underline">Change</button>
      </div>
      <div className="rounded-xl border border-border bg-card p-5 flex items-start justify-between">
        <div className="flex gap-3">
          <Smartphone className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-foreground">Two-factor authentication</p>
            <p className="text-xs text-muted-foreground">Add extra layer of security</p>
          </div>
        </div>
        <button className="text-sm text-primary font-medium hover:underline">Enable</button>
      </div>
      <div className="rounded-xl border border-border bg-card p-5 flex items-start justify-between">
        <div className="flex gap-3">
          <Shield className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-foreground">Active sessions</p>
            <p className="text-xs text-muted-foreground">1 active session (this device)</p>
          </div>
        </div>
        <button className="text-sm text-primary font-medium hover:underline">View all</button>
      </div>
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 flex items-start justify-between">
        <div className="flex gap-3">
          <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-foreground">Delete account</p>
            <p className="text-xs text-muted-foreground">Permanently delete your account and data</p>
          </div>
        </div>
        <button className="text-sm text-destructive font-medium hover:underline">Delete</button>
      </div>
    </div>
  </div>
);
export default SecurityPage;
