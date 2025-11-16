/**
 * Convert knots to km/h
 */
export function knotsToKmh(knots: number): number {
  return knots * 1.852;
}

/**
 * Convert knots to m/s
 */
export function knotsToMs(knots: number): number {
  return knots * 0.514444;
}

/**
 * Convert knots to mph
 */
export function knotsToMph(knots: number): number {
  return knots * 1.15078;
}

/**
 * Format wind speed with unit
 */
export function formatWindSpeed(knots: number, unit: 'kts' | 'kmh' | 'ms' | 'mph' = 'kts'): string {
  let value: number;
  let unitStr: string;

  switch (unit) {
    case 'kmh':
      value = knotsToKmh(knots);
      unitStr = 'km/h';
      break;
    case 'ms':
      value = knotsToMs(knots);
      unitStr = 'm/s';
      break;
    case 'mph':
      value = knotsToMph(knots);
      unitStr = 'mph';
      break;
    default:
      value = knots;
      unitStr = 'kts';
  }

  return `${Math.round(value)} ${unitStr}`;
}

/**
 * Get wind direction cardinal (N, NE, E, SE, S, SW, W, NW)
 */
export function getWindDirectionCardinal(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(((degrees % 360) / 45)) % 8;
  return directions[index];
}

/**
 * Get wind direction name in Spanish
 */
export function getWindDirectionName(degrees: number): string {
  const normalized = ((degrees % 360) + 360) % 360;

  if (normalized >= 45 && normalized < 135) return 'Levante';
  if (normalized >= 225 && normalized < 315) return 'Poniente';
  if (normalized >= 135 && normalized < 225) return 'Sur';
  return 'Norte';
}

/**
 * Format temperature
 */
export function formatTemperature(celsius: number, unit: 'C' | 'F' = 'C'): string {
  if (unit === 'F') {
    const fahrenheit = (celsius * 9) / 5 + 32;
    return `${Math.round(fahrenheit)}°F`;
  }
  return `${Math.round(celsius)}°C`;
}

/**
 * Format humidity
 */
export function formatHumidity(percent: number): string {
  return `${Math.round(percent)}%`;
}

/**
 * Format pressure
 */
export function formatPressure(hPa: number): string {
  return `${Math.round(hPa)} hPa`;
}
