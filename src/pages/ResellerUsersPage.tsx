import { useState, useEffect } from 'react';
import { Users, Globe, Smartphone } from 'lucide-react';

interface ReferredUser {
  id: string;
  name: string;
  email: string;
  joinedDate: string;
  status: 'Active' | 'Trial' | 'Churned';
  plan: string;
  commission: number;
}

function generateUsers(): ReferredUser[] {
  const names = [
    ['Alex Chen', 'alex.chen@example.com'],
    ['Sarah Kumar', 'sarah.k@example.com'],
    ['Mike Ross', 'mike.ross@example.com'],
    ['Priya Patel', 'priya.p@example.com'],
    ['James Wilson', 'james.w@example.com'],
    ['Emily Davis', 'emily.d@example.com'],
    ['Omar Hassan', 'omar.h@example.com'],
    ['Anya Singh', 'anya.s@example.com'],
  ];
  const plans = ['Basic', 'Pro', 'Unlimited'];
  const statuses: ReferredUser['status'][] = ['Active', 'Active', 'Trial', 'Active', 'Churned', 'Active', 'Trial', 'Active'];
  return names.map(([name, email], i) => ({
    id: `ref-${i + 1}`,
    name,
    email,
    joinedDate: `2026-0${Math.floor(i / 3) + 1}-${String((i % 28) + 1).padStart(2, '0')}`,
    status: statuses[i],
    plan: plans[i % 3],
    commission: [87, 45, 120, 68, 0, 95, 42, 110][i],
  }));
}

const ResellerUsersPage = () => {
  const [users] = useState(generateUsers);

  const activeCount = users.filter(u => u.status === 'Active').length;
  const totalEarned = users.reduce((s, u) => s + u.commission, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Referred Users</h1>
          <p className="text-sm text-muted-foreground mt-1">Users who signed up through your referral link</p>
        </div>
        <div className="flex gap-3">
          <div className="rounded-lg border border-border bg-card px-4 py-2 text-center">
            <p className="text-2xl font-bold text-foreground">{users.length}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
          <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-2 text-center">
            <p className="text-2xl font-bold text-green-400">{activeCount}</p>
            <p className="text-xs text-muted-foreground">Active</p>
          </div>
          <div className="rounded-lg border border-primary/30 bg-primary/10 px-4 py-2 text-center">
            <p className="text-2xl font-bold text-primary">${totalEarned}</p>
            <p className="text-xs text-muted-foreground">Earned</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">User</th>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Joined</th>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Plan</th>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Commission</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground">{u.name}</p>
                  <p className="text-xs text-muted-foreground">{u.email}</p>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{u.joinedDate}</td>
                <td className="px-4 py-3 text-foreground">{u.plan}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                    u.status === 'Active'
                      ? 'bg-green-500/20 text-green-400'
                      : u.status === 'Trial'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-secondary text-muted-foreground'
                  }`}>
                    {u.status}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium text-foreground">
                  {u.commission > 0 ? `$${u.commission}` : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResellerUsersPage;
