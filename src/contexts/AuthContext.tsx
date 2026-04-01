import React, { createContext, useContext, useState, useCallback } from 'react';
import { audit } from '@/lib/auditLog';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'reseller';
}

interface AuthContextType {
  user: AuthUser | null;
  isLoggedIn: boolean;
  hasSubscription: boolean;
  isAdmin: boolean;
  isReseller: boolean;
  login: (email: string, password: string, role?: 'user' | 'admin' | 'reseller') => void;
  logout: () => void;
  activateSubscription: () => void;
}

const AUTH_KEY = 'saashub_auth';
const SUB_KEY = 'saashub_sub';

function loadAuth(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

function loadSub(): boolean {
  return localStorage.getItem(SUB_KEY) === '1';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(loadAuth);
  const [hasSubscription, setHasSubscription] = useState<boolean>(loadSub);

  const login = useCallback((email: string, _password: string, role: 'user' | 'admin' | 'reseller' = 'user') => {
    const newUser: AuthUser = {
      id: 'u_' + crypto.randomUUID().replace(/-/g, '').slice(0, 9),
      name: email.split('@')[0],
      email,
      role,
    };
    setUser(newUser);
    localStorage.setItem(AUTH_KEY, JSON.stringify(newUser));
    audit.login(newUser.id, { email, role });
  }, []);

  const logout = useCallback(() => {
    const current = loadAuth();
    if (current) audit.logout(current.id);
    setUser(null);
    setHasSubscription(false);
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(SUB_KEY);
  }, []);

  const activateSubscription = useCallback(() => {
    setHasSubscription(true);
    localStorage.setItem(SUB_KEY, '1');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        hasSubscription,
        isAdmin: user?.role === 'admin',
        isReseller: user?.role === 'reseller' || user?.role === 'admin',
        login,
        logout,
        activateSubscription,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
