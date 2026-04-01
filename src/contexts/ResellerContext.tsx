import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';

export interface ManagedUser {
  id: string;
  resellerId: string;
  name: string;
  email: string;
  phone: string;
  plan: string;
  assignedProduct: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

interface ResellerContextType {
  resellerId: string;
  managedUsers: ManagedUser[];
  createUser: (data: Omit<ManagedUser, 'id' | 'resellerId' | 'createdAt' | 'status'>) => void;
  toggleUserStatus: (id: string) => void;
  assignProduct: (userId: string, product: string, plan: string) => void;
}

const STORAGE_KEY = (resellerId: string) => `reseller_users_${resellerId}`;

function makeDefaultUsers(resellerId: string): ManagedUser[] {
  return [
    {
      id: 'mu1',
      resellerId,
      name: 'Alex Chen',
      email: 'alex.chen@example.com',
      phone: '+1-555-0101',
      plan: 'Pro',
      assignedProduct: 'EduFlow Pro',
      status: 'Active',
      createdAt: '2026-01-10',
    },
    {
      id: 'mu2',
      resellerId,
      name: 'Sarah Kumar',
      email: 'sarah.k@example.com',
      phone: '+1-555-0102',
      plan: 'Basic',
      assignedProduct: 'ShopEngine',
      status: 'Active',
      createdAt: '2026-02-15',
    },
    {
      id: 'mu3',
      resellerId,
      name: 'Mike Ross',
      email: 'mike.ross@example.com',
      phone: '+1-555-0103',
      plan: 'Unlimited',
      assignedProduct: 'MediCore 360',
      status: 'Inactive',
      createdAt: '2026-02-20',
    },
  ];
}

function loadUsers(resellerId: string): ManagedUser[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY(resellerId));
    if (raw) return JSON.parse(raw) as ManagedUser[];
  } catch {
    // ignore
  }
  return makeDefaultUsers(resellerId);
}

const ResellerContext = createContext<ResellerContextType | undefined>(undefined);

export const ResellerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const resellerId = user?.id ?? 'default_reseller';

  const [managedUsers, setManagedUsers] = useState<ManagedUser[]>(() =>
    loadUsers(resellerId)
  );

  const persist = useCallback(
    (users: ManagedUser[]) => {
      localStorage.setItem(STORAGE_KEY(resellerId), JSON.stringify(users));
    },
    [resellerId]
  );

  const createUser = useCallback(
    (data: Omit<ManagedUser, 'id' | 'resellerId' | 'createdAt' | 'status'>) => {
      setManagedUsers(prev => {
        const newUser: ManagedUser = {
          ...data,
          id: `mu_${Date.now()}`,
          resellerId,
          status: 'Active',
          createdAt: new Date().toISOString().split('T')[0],
        };
        const updated = [newUser, ...prev];
        persist(updated);
        return updated;
      });
    },
    [resellerId, persist]
  );

  const toggleUserStatus = useCallback(
    (id: string) => {
      setManagedUsers(prev => {
        const updated = prev.map(u =>
          u.id === id
            ? { ...u, status: (u.status === 'Active' ? 'Inactive' : 'Active') as ManagedUser['status'] }
            : u
        );
        persist(updated);
        return updated;
      });
    },
    [persist]
  );

  const assignProduct = useCallback(
    (userId: string, product: string, plan: string) => {
      setManagedUsers(prev => {
        const updated = prev.map(u =>
          u.id === userId ? { ...u, assignedProduct: product, plan } : u
        );
        persist(updated);
        return updated;
      });
    },
    [persist]
  );

  return (
    <ResellerContext.Provider
      value={{ resellerId, managedUsers, createUser, toggleUserStatus, assignProduct }}
    >
      {children}
    </ResellerContext.Provider>
  );
};

export const useReseller = () => {
  const ctx = useContext(ResellerContext);
  if (!ctx) throw new Error('useReseller must be used within ResellerProvider');
  return ctx;
};
