import type { Station, Reading, Forecast, ReadingRange } from '@/types';

/**
 * DataSource interface defines the contract for data retrieval.
 * This abstraction allows switching between mock data and real Firebase
 * implementation without changing the UI layer.
 */
export interface DataSource {
  /**
   * Retrieve all available stations
   */
  getStations(): Promise<Station[]>;

  /**
   * Retrieve a specific station by ID
   */
  getStation(id: string): Promise<Station>;

  /**
   * Retrieve readings for a station within a time range
   */
  getReadings(id: string, range: ReadingRange): Promise<Reading[]>;

  /**
   * Retrieve forecast data for a station
   */
  getForecast(id: string): Promise<Forecast>;
}
