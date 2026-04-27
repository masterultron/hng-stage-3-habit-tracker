'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Habit } from '@/types/habit';
import { getHabits, saveHabits } from '@/lib/storage';
import { useAuth } from './AuthContext';
import { toggleHabitCompletion } from '@/lib/habits';

interface HabitContextType {
  habits: Habit[];
  createHabit: (name: string, description: string) => void;
  updateHabit: (id: string, name: string, description: string) => void;
  deleteHabit: (id: string) => void;
  toggleCompletion: (id: string) => void;
}

const HabitContext = createContext<HabitContextType | null>(null);

export function HabitProvider({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    if (session) {
      const all = getHabits();
setHabits(all.filter((h: Habit) => h.userId === session.userId));
    } else {
      setHabits([]);
    }
  }, [session]);

  const persist = (updated: Habit[]) => {
    const all = getHabits();
    const others = all.filter((h: Habit) => h.userId !== session?.userId);
    saveHabits([...others, ...updated]);
    setHabits(updated);
  };

  const createHabit = (name: string, description: string) => {
    if (!session) return;
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      userId: session.userId,
      name,
      description,
      frequency: 'daily',
      createdAt: new Date().toISOString(),
      completions: [],
    };
    persist([...habits, newHabit]);
  };

  const updateHabit = (id: string, name: string, description: string) => {
    const updated = habits.map((h: Habit) =>
  h.id === id ? { ...h, name, description } : h
);
    persist(updated);
  };

  const deleteHabit = (id: string) => {
    persist(habits.filter((h) => h.id !== id));
  };

  const toggleCompletion = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    const updated = habits.map((h) =>
      h.id === id ? toggleHabitCompletion(h, today) : h
    );
    persist(updated);
  };

  return (
    <HabitContext.Provider value={{ habits, createHabit, updateHabit, deleteHabit, toggleCompletion }}>
      {children}
    </HabitContext.Provider>
  );
}

export function useHabits() {
  const ctx = useContext(HabitContext);
  if (!ctx) throw new Error('useHabits must be used within HabitProvider');
  return ctx;
}