import { describe, it, expect } from 'vitest';
import { calculateCurrentStreak } from '@/lib/streaks';

/* MENTOR_TRACE_STAGE3_HABIT_A91 */

describe('calculateCurrentStreak', () => {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0];

  it('returns 0 when completions is empty', () => {
    expect(calculateCurrentStreak([])).toBe(0);
  });

  it('returns 0 when today is not completed', () => {
    expect(calculateCurrentStreak([yesterday])).toBe(0);
  });

  it('returns the correct streak for consecutive completed days', () => {
    expect(calculateCurrentStreak([today])).toBe(1);
    expect(calculateCurrentStreak([today, yesterday])).toBe(2);
    expect(calculateCurrentStreak([today, yesterday, twoDaysAgo])).toBe(3);
  });

  it('ignores duplicate completion dates', () => {
    expect(calculateCurrentStreak([today, today, yesterday])).toBe(2);
  });

  it('breaks the streak when a calendar day is missing', () => {
    expect(calculateCurrentStreak([today, twoDaysAgo])).toBe(1);
  });
});