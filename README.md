# Habit Tracker PWA

A mobile-first Progressive Web App for tracking daily habits.

## Setup
npm install
npm run dev

## Run Tests
npm run test:unit        # Unit tests with coverage
npm run test:integration # Integration/component tests
npm run test:e2e         # End-to-end Playwright tests
npm test                 # All tests

## Local Persistence
- habit-tracker-users: Array of registered users
- habit-tracker-session: Active session or null
- habit-tracker-habits: Array of all habits across users

## PWA Support
- public/manifest.json defines app metadata and icons
- public/sw.js caches the app shell for offline use
- Service worker is registered client-side in layout.tsx

## Trade-offs
- Passwords stored in plain text in localStorage (no backend)
- No token expiry — session persists until logout
- Offline support limited to cached app shell

## Test File Map
| File | Verifies |
|------|----------|
| tests/unit/slug.test.ts | getHabitSlug utility |
| tests/unit/validators.test.ts | validateHabitName utility |
| tests/unit/streaks.test.ts | calculateCurrentStreak utility |
| tests/unit/habits.test.ts | toggleHabitCompletion utility |
| tests/integration/auth-flow.test.tsx | Signup, login, error states |
| tests/integration/habit-form.test.tsx | CRUD and completion UI |
| tests/e2e/app.spec.ts | Full user flows end-to-end |