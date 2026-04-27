'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useHabits } from '@/context/HabitContext';
import HabitCard from '@/components/habits/HabitCard';
import HabitForm from '@/components/habits/HabitForm';

export default function DashboardPage() {
  const { session, logout } = useAuth();
  const { habits, createHabit, updateHabit, deleteHabit, toggleCompletion } = useHabits();
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!session) {
      router.push('/login');
    }
  }, [session, router]);

  if (!session) return null;

  return (
    <div data-testid="dashboard-page" className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Habit Tracker</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">{session.email}</span>
            <button
              data-testid="auth-logout-button"
              onClick={() => {
                logout();
                router.push('/login');
              }}
              className="text-sm font-medium text-red-600 hover:text-red-700 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
            >
              Log Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Create button */}
        {!showForm && (
          <button
            data-testid="create-habit-button"
            onClick={() => setShowForm(true)}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-xl transition-colors"
          >
            + Create New Habit
          </button>
        )}

        {/* Create form */}
        {showForm && (
          <HabitForm
            onSave={(name, description) => {
              createHabit(name, description);
              setShowForm(false);
            }}
            onCancel={() => setShowForm(false)}
          />
        )}

        {/* Empty state */}
        {habits.length === 0 && !showForm && (
          <div
            data-testid="empty-state"
            className="text-center py-16 text-gray-500"
          >
            <p className="text-lg font-medium">No habits yet</p>
            <p className="text-sm mt-1">Create your first habit to get started!</p>
          </div>
        )}

        {/* Habit list */}
        {habits.map((habit) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            onToggle={toggleCompletion}
            onEdit={updateHabit}
            onDelete={deleteHabit}
          />
        ))}
      </main>
    </div>
  );
}