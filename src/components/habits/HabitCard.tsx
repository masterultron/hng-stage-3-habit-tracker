'use client';

import { useState } from 'react';
import { Habit } from '@/types/habit';
import { getHabitSlug } from '@/lib/slug';
import { calculateCurrentStreak } from '@/lib/streaks';
import HabitForm from './HabitForm';

interface HabitCardProps {
  habit: Habit;
  onToggle: (id: string) => void;
  onEdit: (id: string, name: string, description: string) => void;
  onDelete: (id: string) => void;
}

export default function HabitCard({ habit, onToggle, onEdit, onDelete }: HabitCardProps) {
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const slug = getHabitSlug(habit.name);
  const today = new Date().toISOString().split('T')[0];
  const isCompleted = habit.completions.includes(today);
  const streak = calculateCurrentStreak(habit.completions);

  if (editing) {
    return (
      <HabitForm
        initial={habit}
        onSave={(name, description) => {
          onEdit(habit.id, name, description);
          setEditing(false);
        }}
        onCancel={() => setEditing(false)}
      />
    );
  }

  return (
    <div
      data-testid={`habit-card-${slug}`}
      className={`border rounded-xl p-4 space-y-3 transition-colors ${
        isCompleted ? 'bg-green-50 border-green-300' : 'bg-white border-gray-200'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{habit.name}</h3>
          {habit.description && (
            <p className="text-sm text-gray-500 mt-0.5">{habit.description}</p>
          )}
        </div>
        <span
          data-testid={`habit-streak-${slug}`}
          className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-full"
        >
          🔥 {streak} day{streak !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <button
          data-testid={`habit-complete-${slug}`}
          onClick={() => onToggle(habit.id)}
          className={`text-sm font-medium px-4 py-1.5 rounded-lg transition-colors ${
            isCompleted
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'border border-green-600 text-green-600 hover:bg-green-50'
          }`}
        >
          {isCompleted ? '✓ Done' : 'Mark Done'}
        </button>
        <button
          data-testid={`habit-edit-${slug}`}
          onClick={() => setEditing(true)}
          className="text-sm font-medium px-4 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Edit
        </button>
        <button
          data-testid={`habit-delete-${slug}`}
          onClick={() => setConfirmDelete(true)}
          className="text-sm font-medium px-4 py-1.5 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition-colors"
        >
          Delete
        </button>
      </div>

      {confirmDelete && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 space-y-2">
          <p className="text-sm text-red-700">Are you sure you want to delete this habit?</p>
          <div className="flex gap-2">
            <button
              data-testid="confirm-delete-button"
              onClick={() => onDelete(habit.id)}
              className="text-sm font-medium px-4 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Yes, Delete
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="text-sm font-medium px-4 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}