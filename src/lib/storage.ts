import { User, Session } from '@/types/auth';
import { Habit } from '@/types/habit';

const USERS_KEY = 'habit-tracker-users';
const SESSION_KEY = 'habit-tracker-session';
const HABITS_KEY = 'habit-tracker-habits';

// Users
export function getUsers(): User[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Session
export function getSession(): Session | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function saveSession(session: Session | null): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(null));
}

// Habits
export function getHabits(): Habit[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(HABITS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveHabits(habits: Habit[]): void {
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
}