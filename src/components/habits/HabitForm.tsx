'use client';

import { useState } from 'react';
import { validateHabitName } from '@/lib/validators';
import { Habit } from '@/types/habit';

interface HabitFormProps {
  initial?: Habit;
  onSave: (name: string, description: string) => void;
  onCancel: () => void;
}

export default function HabitForm({ initial, onSave, onCancel }: HabitFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateHabitName(name);
    if (!result.valid) {
      setError(result.error!);
      return;
    }
    setError('');
    onSave(result.value, description.trim());
  };

  return (
    <form
      data-testid="habit-form"
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 rounded-xl p-5 space-y-4"
    >
      <div>
        <label htmlFor="habit-name" className="block text-sm font-medium text-gray-700 mb-1">
          Habit Name <span className="text-red-500">*</span>
        </label>
        <input
          id="habit-name"
          type="text"
          data-testid="habit-name-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="e.g. Drink Water"
        />
        {error && <p className="text-red-600 text-xs mt-1" role="alert">{error}</p>}
      </div>
      <div>
        <label htmlFor="habit-description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <input
          id="habit-description"
          type="text"
          data-testid="habit-description-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Optional description"
        />
      </div>
      <div>
        <label htmlFor="habit-frequency" className="block text-sm font-medium text-gray-700 mb-1">
          Frequency
        </label>
        <select
          id="habit-frequency"
          data-testid="habit-frequency-select"
          defaultValue="daily"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="daily">Daily</option>
        </select>
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          data-testid="habit-save-button"
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition-colors text-sm"
        >
          {initial ? 'Update Habit' : 'Save Habit'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 rounded-lg transition-colors text-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}