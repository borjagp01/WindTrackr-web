export interface ForecastHourly {
  timestamp: string; // ISO 8601
  windKts: number;
  gustKts: number;
  directionDeg: number;
  tempC?: number;
}

export interface ForecastDaily {
  date: string; // YYYY-MM-DD
  tempMax: number | null;
  tempMin: number | null;
  windKts: number;
  gustKts: number;
  directionDeg: number;
  skyState: {
    code: string | null;
    description: string | null;
  } | null;
  precipProb: number;
}

export interface Forecast {
  stationId: string;
  hourly: ForecastHourly[];
  weekly?: ForecastDaily[];
}
