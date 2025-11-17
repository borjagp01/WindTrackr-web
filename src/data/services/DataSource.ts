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

  // ==================== PHASE 2: Real-time Subscriptions ====================

  /**
   * Subscribe to real-time updates for all stations.
   * @param onUpdate - Callback invoked when stations data changes
   * @param onError - Optional error handler
   * @returns Cleanup function to unsubscribe
   */
  subscribeToStations(
    onUpdate: (stations: Station[]) => void,
    onError?: (error: Error) => void
  ): () => void;

  /**
   * Subscribe to real-time updates for a specific station.
   * @param id - Station ID
   * @param onUpdate - Callback invoked when station data changes
   * @param onError - Optional error handler
   * @returns Cleanup function to unsubscribe
   */
  subscribeToStation(
    id: string,
    onUpdate: (station: Station) => void,
    onError?: (error: Error) => void
  ): () => void;

  /**
   * Subscribe to real-time updates for station readings.
   * @param id - Station ID
   * @param range - Time range filter ('24h' or '7d')
   * @param onUpdate - Callback invoked when readings data changes
   * @param onError - Optional error handler
   * @returns Cleanup function to unsubscribe
   */
  subscribeToReadings(
    id: string,
    range: ReadingRange,
    onUpdate: (readings: Reading[]) => void,
    onError?: (error: Error) => void
  ): () => void;
}
