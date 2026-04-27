import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider } from '@/context/AuthContext';
import { HabitProvider } from '@/context/HabitContext';
import DashboardPage from '@/app/dashboard/page';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

beforeEach(() => {
  localStorage.clear();
  // Set up a logged-in session
  const user = { id: 'user1', email: 'test@test.com', password: 'pass', createdAt: new Date().toISOString() };
  localStorage.setItem('habit-tracker-users', JSON.stringify([user]));
  localStorage.setItem('habit-tracker-session', JSON.stringify({ userId: 'user1', email: 'test@test.com' }));
});

function renderDashboard() {
  return render(
    <AuthProvider>
      <HabitProvider>
        <DashboardPage />
      </HabitProvider>
    </AuthProvider>
  );
}

describe('habit form', () => {
  it('shows a validation error when habit name is empty', async () => {
    renderDashboard();
    fireEvent.click(screen.getByTestId('create-habit-button'));
    fireEvent.click(screen.getByTestId('habit-save-button'));
    await waitFor(() => {
      expect(screen.getByText('Habit name is required')).toBeInTheDocument();
    });
  });

  it('creates a new habit and renders it in the list', async () => {
    renderDashboard();
    fireEvent.click(screen.getByTestId('create-habit-button'));
    await userEvent.type(screen.getByTestId('habit-name-input'), 'Drink Water');
    fireEvent.click(screen.getByTestId('habit-save-button'));
    await waitFor(() => {
      expect(screen.getByTestId('habit-card-drink-water')).toBeInTheDocument();
    });
  });

  it('edits an existing habit and preserves immutable fields', async () => {
    // Create habit first
    const habit = {
      id: 'habit1', userId: 'user1', name: 'Drink Water',
      description: '', frequency: 'daily', createdAt: '2026-01-01T00:00:00.000Z', completions: [],
    };
    localStorage.setItem('habit-tracker-habits', JSON.stringify([habit]));

    renderDashboard();
    await waitFor(() => screen.getByTestId('habit-edit-drink-water'));
    fireEvent.click(screen.getByTestId('habit-edit-drink-water'));

    const nameInput = screen.getByTestId('habit-name-input');
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'Read Books');
    fireEvent.click(screen.getByTestId('habit-save-button'));

    await waitFor(() => {
      expect(screen.getByTestId('habit-card-read-books')).toBeInTheDocument();
      const habits = JSON.parse(localStorage.getItem('habit-tracker-habits') || '[]');
      const updated = habits.find((h: any) => h.id === 'habit1');
      expect(updated.id).toBe('habit1');
      expect(updated.userId).toBe('user1');
      expect(updated.createdAt).toBe('2026-01-01T00:00:00.000Z');
    });
  });

  it('deletes a habit only after explicit confirmation', async () => {
    const habit = {
      id: 'habit1', userId: 'user1', name: 'Drink Water',
      description: '', frequency: 'daily', createdAt: new Date().toISOString(), completions: [],
    };
    localStorage.setItem('habit-tracker-habits', JSON.stringify([habit]));

    renderDashboard();
    await waitFor(() => screen.getByTestId('habit-delete-drink-water'));
    fireEvent.click(screen.getByTestId('habit-delete-drink-water'));

    // Card should still be there before confirmation
    expect(screen.getByTestId('habit-card-drink-water')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('confirm-delete-button'));

    await waitFor(() => {
      expect(screen.queryByTestId('habit-card-drink-water')).not.toBeInTheDocument();
    });
  });

  it('toggles completion and updates the streak display', async () => {
    const habit = {
      id: 'habit1', userId: 'user1', name: 'Drink Water',
      description: '', frequency: 'daily', createdAt: new Date().toISOString(), completions: [],
    };
    localStorage.setItem('habit-tracker-habits', JSON.stringify([habit]));

    renderDashboard();
    await waitFor(() => screen.getByTestId('habit-complete-drink-water'));

    // Before completion
    expect(screen.getByTestId('habit-streak-drink-water')).toHaveTextContent('0');

    fireEvent.click(screen.getByTestId('habit-complete-drink-water'));

    await waitFor(() => {
      expect(screen.getByTestId('habit-streak-drink-water')).toHaveTextContent('1');
    });
  });
});