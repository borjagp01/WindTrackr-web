export interface ForecastHourly {
  timestamp: string; // ISO 8601
  windKts: number;
  gustKts: number;
  directionDeg: number;
  tempC?: number;
}

export interface Forecast {
  stationId: string;
  hourly: ForecastHourly[];
}
