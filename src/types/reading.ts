export interface Reading {
  stationId: string;
  timestamp: string; // ISO 8601
  windSpeedKts: number;
  windGustKts: number;
  windDirectionDeg: number;
  temperatureC?: number;
  humidityPct?: number;
  pressureHPa?: number;
}

export type ReadingRange = '24h' | '7d';
