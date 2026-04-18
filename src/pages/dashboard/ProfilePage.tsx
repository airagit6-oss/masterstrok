import { User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-foreground mb-1">Profile</h1>
      <p className="text-sm text-muted-foreground mb-6">Manage your personal information.</p>
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground uppercase">
            {user?.name?.[0] ?? <User />}
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">{user?.name ?? 'User'}</p>
            <p className="text-sm text-muted-foreground">{user?.email ?? ''}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Full name</label>
            <p className="text-sm text-foreground mt-1">{user?.name ?? '—'}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Role</label>
            <p className="text-sm text-foreground mt-1 capitalize">{user?.role ?? 'user'}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</label>
            <p className="text-sm text-foreground mt-1">{user?.email ?? '—'}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">User ID</label>
            <p className="text-xs text-muted-foreground mt-1 font-mono">{user?.id ?? '—'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
