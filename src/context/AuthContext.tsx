'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@/types/auth';
import { getSession, saveSession, clearSession, getUsers, saveUsers } from '@/lib/storage';

interface AuthContextType {
  session: Session | null;
  loading: boolean;
  signup: (email: string, password: string) => { success: boolean; error?: string };
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const s = getSession();
    setSession(s);
    setLoading(false);
  }, []);

  const signup = (email: string, password: string) => {
    const users = getUsers();
    const existing = users.find((u) => u.email === email);
    if (existing) {
      return { success: false, error: 'User already exists' };
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      password,
      createdAt: new Date().toISOString(),
    };

    saveUsers([...users, newUser]);

    const newSession: Session = { userId: newUser.id, email: newUser.email };
    saveSession(newSession);
    setSession(newSession);

    return { success: true };
  };

  const login = (email: string, password: string) => {
    const users = getUsers();
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) {
      return { success: false, error: 'Invalid email or password' };
    }

    const newSession: Session = { userId: user.id, email: user.email };
    saveSession(newSession);
    setSession(newSession);

    return { success: true };
  };

  const logout = () => {
    clearSession();
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ session, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}