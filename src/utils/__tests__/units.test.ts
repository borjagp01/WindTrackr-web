import { describe, it, expect } from 'vitest';
import {
  formatWindSpeed,
  getWindDirectionCardinal,
  getWindDirectionName,
  formatTemperature,
  knotsToKmh,
} from '@/utils/units';

describe('units utilities', () => {
  describe('formatWindSpeed', () => {
    it('should format wind speed in knots', () => {
      expect(formatWindSpeed(20, 'kts')).toBe('20 kts');
    });

    it('should format wind speed in km/h', () => {
      expect(formatWindSpeed(20, 'kmh')).toBe('37 km/h');
    });

    it('should format wind speed in m/s', () => {
      expect(formatWindSpeed(20, 'ms')).toBe('10 m/s');
    });
  });

  describe('getWindDirectionCardinal', () => {
    it('should return correct cardinal direction for North', () => {
      expect(getWindDirectionCardinal(0)).toBe('N');
      expect(getWindDirectionCardinal(360)).toBe('N');
    });

    it('should return correct cardinal direction for East', () => {
      expect(getWindDirectionCardinal(90)).toBe('E');
    });

    it('should return correct cardinal direction for South', () => {
      expect(getWindDirectionCardinal(180)).toBe('S');
    });

    it('should return correct cardinal direction for West', () => {
      expect(getWindDirectionCardinal(270)).toBe('W');
    });
  });

  describe('getWindDirectionName', () => {
    it('should return Levante for East winds', () => {
      expect(getWindDirectionName(90)).toBe('Levante');
    });

    it('should return Poniente for West winds', () => {
      expect(getWindDirectionName(270)).toBe('Poniente');
    });

    it('should return Sur for South winds', () => {
      expect(getWindDirectionName(180)).toBe('Sur');
    });

    it('should return Norte for North winds', () => {
      expect(getWindDirectionName(0)).toBe('Norte');
    });
  });

  describe('formatTemperature', () => {
    it('should format temperature in Celsius', () => {
      expect(formatTemperature(20, 'C')).toBe('20°C');
    });

    it('should format temperature in Fahrenheit', () => {
      expect(formatTemperature(20, 'F')).toBe('68°F');
    });
  });

  describe('knotsToKmh', () => {
    it('should convert knots to km/h correctly', () => {
      expect(knotsToKmh(10)).toBeCloseTo(18.52, 1);
    });
  });
});
