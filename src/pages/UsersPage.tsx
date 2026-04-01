import { useState, useEffect } from "react";
import { useAdminUsers } from "@/hooks/useAdminData";
import { cn } from "@/lib/utils";
import type { UserEntry } from "@/lib/api";

export default function UsersPage() {
  const { data: fetchedUsers = [] } = useAdminUsers(30);
  const [users, setUsers] = useState<UserEntry[]>([]);

  useEffect(() => {
    if (fetchedUsers.length > 0) setUsers(fetchedUsers);
  }, [fetchedUsers]);

  useEffect(() => {
    if (users.length === 0) return;
    const iv = setInterval(() => {
      setUsers(prev => prev.map(u => ({
        ...u,
        status: Math.random() > 0.2 ? 'live' : 'offline' as const,
        sessionDuration: u.status === 'live' ? `${Math.floor(Math.random() * 120)}m ${Math.floor(Math.random() * 60)}s` : u.sessionDuration,
      })));
    }, 4000);
    return () => clearInterval(iv);
  }, [users.length]);

  const liveCount = users.filter(u => u.status === 'live').length;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <h2 className="text-sm font-medium text-foreground">Users Monitoring</h2>
        <span className="dd-badge-success">{liveCount} live</span>
        <span className="dd-badge-warning">{users.length - liveCount} offline</span>
      </div>

      <div className="dd-panel">
        <div className="grid grid-cols-[100px_120px_70px_130px_80px_100px_90px] gap-2 px-3 py-2 border-b border-border text-xs text-muted-foreground uppercase tracking-wider font-medium">
          <span>User ID</span>
          <span>Name</span>
          <span>Status</span>
          <span>Current App</span>
          <span>Location</span>
          <span>Device</span>
          <span>Session</span>
        </div>
        {users.map((user) => (
          <div key={user.id} className="grid grid-cols-[100px_120px_70px_130px_80px_100px_90px] gap-2 px-3 py-1.5 text-xs border-b border-border/50 hover:bg-accent/50 cursor-pointer transition-colors">
            <span className="dd-text-mono text-muted-foreground truncate">{user.id}</span>
            <span className="text-foreground">{user.name}</span>
            <span className="flex items-center gap-1.5">
              <span className={cn("w-1.5 h-1.5 rounded-full", user.status === 'live' ? "bg-dd-success animate-pulse-live" : "bg-muted-foreground")} />
              <span className={user.status === 'live' ? "text-dd-success" : "text-muted-foreground"}>{user.status}</span>
            </span>
            <span className="text-foreground truncate">{user.currentApp}</span>
            <span className="text-muted-foreground">{user.location}</span>
            <span className="text-muted-foreground truncate">{user.device}</span>
            <span className="dd-text-mono text-muted-foreground">{user.sessionDuration}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
