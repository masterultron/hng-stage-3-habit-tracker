import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

// Mock storage
beforeEach(() => {
  localStorage.clear();
});

import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import { AuthProvider } from '@/context/AuthContext';

function renderWithAuth(ui: React.ReactElement) {
  return render(<AuthProvider>{ui}</AuthProvider>);
}

describe('auth flow', () => {
  it('submits the signup form and creates a session', async () => {
    renderWithAuth(<SignupForm />);
    await userEvent.type(screen.getByTestId('auth-signup-email'), 'test@test.com');
    await userEvent.type(screen.getByTestId('auth-signup-password'), 'password123');
    fireEvent.click(screen.getByTestId('auth-signup-submit'));

    await waitFor(() => {
      const session = JSON.parse(localStorage.getItem('habit-tracker-session') || 'null');
      expect(session).not.toBeNull();
      expect(session.email).toBe('test@test.com');
    });
  });

  it('shows an error for duplicate signup email', async () => {
    renderWithAuth(<SignupForm />);
    await userEvent.type(screen.getByTestId('auth-signup-email'), 'test@test.com');
    await userEvent.type(screen.getByTestId('auth-signup-password'), 'password123');
    fireEvent.click(screen.getByTestId('auth-signup-submit'));

    // Try again with same email
    renderWithAuth(<SignupForm />);
    await userEvent.type(screen.getByTestId('auth-signup-email'), 'test@test.com');
    await userEvent.type(screen.getByTestId('auth-signup-password'), 'password123');
    fireEvent.click(screen.getByTestId('auth-signup-submit'));

    await waitFor(() => {
      expect(screen.getByText('User already exists')).toBeInTheDocument();
    });
  });

  it('submits the login form and stores the active session', async () => {
    // Create user first
    const users = [{ id: '1', email: 'login@test.com', password: 'pass123', createdAt: new Date().toISOString() }];
    localStorage.setItem('habit-tracker-users', JSON.stringify(users));

    renderWithAuth(<LoginForm />);
    await userEvent.type(screen.getByTestId('auth-login-email'), 'login@test.com');
    await userEvent.type(screen.getByTestId('auth-login-password'), 'pass123');
    fireEvent.click(screen.getByTestId('auth-login-submit'));

    await waitFor(() => {
      const session = JSON.parse(localStorage.getItem('habit-tracker-session') || 'null');
      expect(session).not.toBeNull();
      expect(session.email).toBe('login@test.com');
    });
  });

  it('shows an error for invalid login credentials', async () => {
    renderWithAuth(<LoginForm />);
    await userEvent.type(screen.getByTestId('auth-login-email'), 'wrong@test.com');
    await userEvent.type(screen.getByTestId('auth-login-password'), 'wrongpass');
    fireEvent.click(screen.getByTestId('auth-login-submit'));

    await waitFor(() => {
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
    });
  });
});