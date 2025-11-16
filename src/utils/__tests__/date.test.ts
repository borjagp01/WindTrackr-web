import { describe, it, expect } from 'vitest';
import { formatDate, formatTime, getRelativeTime } from '@/utils/date';

describe('date utilities', () => {
  describe('formatDate', () => {
    it('should format date in Spanish', () => {
      const date = new Date('2024-01-15T10:30:00');
      const formatted = formatDate(date, 'es-ES');
      expect(formatted).toContain('15');
      expect(formatted).toContain('1');
      expect(formatted).toContain('2024');
    });

    it('should handle string dates', () => {
      const formatted = formatDate('2024-01-15T10:30:00', 'es-ES');
      expect(formatted).toContain('15');
    });
  });

  describe('formatTime', () => {
    it('should format time correctly', () => {
      const date = new Date('2024-01-15T10:30:00');
      const formatted = formatTime(date, 'es-ES');
      expect(formatted).toContain('10');
      expect(formatted).toContain('30');
    });
  });

  describe('getRelativeTime', () => {
    it('should return "ahora mismo" for very recent dates', () => {
      const now = new Date();
      expect(getRelativeTime(now)).toBe('ahora mismo');
    });

    it('should return minutes for recent dates', () => {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      expect(getRelativeTime(fiveMinutesAgo)).toBe('hace 5 min');
    });

    it('should return hours for dates within 24 hours', () => {
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
      expect(getRelativeTime(twoHoursAgo)).toBe('hace 2h');
    });
  });
});
