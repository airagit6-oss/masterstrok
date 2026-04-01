// ============================================================
// ROLE SYSTEM (RBAC)
// GET  /api/v1/reseller/roles
// POST /api/v1/reseller/roles
// Middleware: roleCheck(role)
// ============================================================

const API_BASE = '/api/v1';

export type RoleName = 'admin' | 'staff';

export interface Role {
  id: string;
  name: RoleName;
}

export interface UserRole {
  user_id: string;
  role_id: string;
}

// Permissions matrix
const PERMISSIONS: Record<RoleName, string[]> = {
  admin: [
    'users:read', 'users:write', 'users:delete',
    'subscriptions:read', 'subscriptions:write',
    'leads:read', 'leads:write', 'leads:delete',
    'products:read', 'products:write',
    'earnings:read',
    'settings:read', 'settings:write',
    'logs:read',
    'notifications:read',
    'files:read', 'files:write',
    'backup:execute',
    'flags:read', 'flags:write',
  ],
  staff: [
    'users:read',
    'subscriptions:read',
    'leads:read', 'leads:write',
    'products:read',
    'earnings:read',
    'notifications:read',
    'files:read',
    'logs:read',
  ],
};

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json() as Promise<T>;
}

const DEFAULT_ROLES: Role[] = [
  { id: 'role_admin', name: 'admin' },
  { id: 'role_staff', name: 'staff' },
];

// GET /api/v1/reseller/roles
export async function fetchRoles(): Promise<Role[]> {
  try {
    return await apiFetch<Role[]>(`${API_BASE}/reseller/roles`);
  } catch {
    return DEFAULT_ROLES;
  }
}

// POST /api/v1/reseller/roles  (assign role to user)
export async function assignRole(userId: string, roleId: string): Promise<UserRole> {
  const payload: UserRole = { user_id: userId, role_id: roleId };
  try {
    return await apiFetch<UserRole>(`${API_BASE}/reseller/roles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    return payload;
  }
}

// Check whether a role has a specific permission
export function hasPermission(role: RoleName | undefined, permission: string): boolean {
  if (!role) return false;
  return (PERMISSIONS[role] ?? []).includes(permission);
}

// roleCheck middleware — returns true if the user's role satisfies the requirement
// reseller_admin → full access; reseller_staff → limited
export function roleCheck(userRole: RoleName | undefined, requiredRole: RoleName): boolean {
  if (!userRole) return false;
  if (userRole === 'admin') return true;       // admin has full access
  return userRole === requiredRole;
}

// Resolve role name from stored role id
export function resolveRole(roleId: string): RoleName {
  const found = DEFAULT_ROLES.find(r => r.id === roleId);
  return (found?.name as RoleName) ?? 'staff';
}
