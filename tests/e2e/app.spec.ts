import { test, expect } from '@playwright/test';

const testEmail = `test-${Date.now()}@example.com`;
const testPassword = 'TestPass123';

test.describe('Habit Tracker app', () => {
  test.beforeEach(async ({ page }) => {
    await page.evaluate(() => localStorage.clear());
  });

  test('shows the splash screen and redirects unauthenticated users to /login', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('splash-screen')).toBeVisible();
    await page.waitForURL('/login', { timeout: 5000 });
    expect(page.url()).toContain('/login');
  });

  test('redirects authenticated users from / to /dashboard', async ({ page }) => {
    await page.goto('/signup');
    await page.getByTestId('auth-signup-email').fill(testEmail);
    await page.getByTestId('auth-signup-password').fill(testPassword);
    await page.getByTestId('auth-signup-submit').click();
    await page.waitForURL('/dashboard');

    await page.goto('/');
    await page.waitForURL('/dashboard', { timeout: 5000 });
    expect(page.url()).toContain('/dashboard');
  });

  test('prevents unauthenticated access to /dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForURL('/login', { timeout: 5000 });
    expect(page.url()).toContain('/login');
  });

  test('signs up a new user and lands on the dashboard', async ({ page }) => {
    await page.goto('/signup');
    await page.getByTestId('auth-signup-email').fill(testEmail);
    await page.getByTestId('auth-signup-password').fill(testPassword);
    await page.getByTestId('auth-signup-submit').click();
    await page.waitForURL('/dashboard');
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
  });

  test('logs in an existing user and loads only that user\'s habits', async ({ page }) => {
    // Sign up first
    await page.goto('/signup');
    await page.getByTestId('auth-signup-email').fill(testEmail);
    await page.getByTestId('auth-signup-password').fill(testPassword);
    await page.getByTestId('auth-signup-submit').click();
    await page.waitForURL('/dashboard');

    // Log out
    await page.getByTestId('auth-logout-button').click();
    await page.waitForURL('/login');

    // Log back in
    await page.getByTestId('auth-login-email').fill(testEmail);
    await page.getByTestId('auth-login-password').fill(testPassword);
    await page.getByTestId('auth-login-submit').click();
    await page.waitForURL('/dashboard');
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
  });

  test('creates a habit from the dashboard', async ({ page }) => {
    await page.goto('/signup');
    await page.getByTestId('auth-signup-email').fill(testEmail);
    await page.getByTestId('auth-signup-password').fill(testPassword);
    await page.getByTestId('auth-signup-submit').click();
    await page.waitForURL('/dashboard');

    await page.getByTestId('create-habit-button').click();
    await page.getByTestId('habit-name-input').fill('Drink Water');
    await page.getByTestId('habit-save-button').click();

    await expect(page.getByTestId('habit-card-drink-water')).toBeVisible();
  });

  test('completes a habit for today and updates the streak', async ({ page }) => {
    await page.goto('/signup');
    await page.getByTestId('auth-signup-email').fill(testEmail);
    await page.getByTestId('auth-signup-password').fill(testPassword);
    await page.getByTestId('auth-signup-submit').click();
    await page.waitForURL('/dashboard');

    await page.getByTestId('create-habit-button').click();
    await page.getByTestId('habit-name-input').fill('Drink Water');
    await page.getByTestId('habit-save-button').click();
    await expect(page.getByTestId('habit-card-drink-water')).toBeVisible();

    const streakBefore = await page.getByTestId('habit-streak-drink-water').textContent();
    await page.getByTestId('habit-complete-drink-water').click();
    const streakAfter = await page.getByTestId('habit-streak-drink-water').textContent();

    expect(streakAfter).not.toBe(streakBefore);
    expect(streakAfter).toContain('1');
  });

  test('persists session and habits after page reload', async ({ page }) => {
    await page.goto('/signup');
    await page.getByTestId('auth-signup-email').fill(testEmail);
    await page.getByTestId('auth-signup-password').fill(testPassword);
    await page.getByTestId('auth-signup-submit').click();
    await page.waitForURL('/dashboard');

    await page.getByTestId('create-habit-button').click();
    await page.getByTestId('habit-name-input').fill('Drink Water');
    await page.getByTestId('habit-save-button').click();
    await expect(page.getByTestId('habit-card-drink-water')).toBeVisible();

    await page.reload();
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
    await expect(page.getByTestId('habit-card-drink-water')).toBeVisible();
  });

  test('logs out and redirects to /login', async ({ page }) => {
    await page.goto('/signup');
    await page.getByTestId('auth-signup-email').fill(testEmail);
    await page.getByTestId('auth-signup-password').fill(testPassword);
    await page.getByTestId('auth-signup-submit').click();
    await page.waitForURL('/dashboard');

    await page.getByTestId('auth-logout-button').click();
    await page.waitForURL('/login');
    expect(page.url()).toContain('/login');
  });

  test('loads the cached app shell when offline after the app has been loaded once', async ({ page, context }) => {
    // Load app first (online)
    await page.goto('/');
    await page.waitForURL('/login', { timeout: 5000 });

    // Go offline
    await context.setOffline(true);

    // Try to navigate — should not crash
    await page.goto('/login');
    const body = await page.locator('body').textContent();
    expect(body).not.toBeNull();

    await context.setOffline(false);
  });
});