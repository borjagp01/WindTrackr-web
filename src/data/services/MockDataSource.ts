import type { Station, Reading, Forecast, ReadingRange } from '@/types';
import type { DataSource } from './DataSource';

/**
 * MockDataSource implementation that loads data from static JSON files.
 * This is used in development and for the initial deployment without Firebase.
 */
export class MockDataSource implements DataSource {
  private stationsCache: Station[] | null = null;

  async getStations(): Promise<Station[]> {
    if (this.stationsCache) {
      return this.stationsCache;
    }

    const response = await fetch('/mock/stations.json');
    if (!response.ok) {
      throw new Error('Failed to fetch stations');
    }

    this.stationsCache = await response.json();
    return this.stationsCache!;
  }

  async getStation(id: string): Promise<Station> {
    const stations = await this.getStations();
    const station = stations.find((s) => s.id === id);

    if (!station) {
      throw new Error(`Station with id ${id} not found`);
    }

    return station;
  }

  async getReadings(id: string, range: ReadingRange): Promise<Reading[]> {
    const filename = range === '24h' ? `readings_${id}_24h.json` : `readings_${id}_7d.json`;
    const response = await fetch(`/mock/${filename}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch readings for station ${id}`);
    }

    return response.json();
  }

  async getForecast(id: string): Promise<Forecast> {
    const response = await fetch(`/mock/forecast_${id}.json`);

    if (!response.ok) {
      throw new Error(`Failed to fetch forecast for station ${id}`);
    }

    return response.json();
  }

  // ==================== PHASE 2: Real-time Subscriptions ====================
  // Mock implementation: simulates real-time by calling callback once with data

  /**
   * Mock implementation of subscribeToStations.
   * Simulates real-time updates by loading data once and calling the callback.
   */
  subscribeToStations(
    onUpdate: (stations: Station[]) => void,
    onError?: (error: Error) => void
  ): () => void {
    // Simulate initial load
    this.getStations()
      .then((stations) => {
        console.log('🔌 [Mock] Subscribed to stations');
        onUpdate(stations);
      })
      .catch((err) => {
        console.error('🔌 [Mock] Error loading stations:', err);
        onError?.(err);
      });

    // Return no-op cleanup function
    return () => {
      console.log('🔌 [Mock] Unsubscribing from stations');
    };
  }

  /**
   * Mock implementation of subscribeToStation.
   * Simulates real-time updates by loading data once and calling the callback.
   */
  subscribeToStation(
    id: string,
    onUpdate: (station: Station) => void,
    onError?: (error: Error) => void
  ): () => void {
    this.getStation(id)
      .then((station) => {
        console.log(`🔌 [Mock] Subscribed to station ${id}`);
        onUpdate(station);
      })
      .catch((err) => {
        console.error(`🔌 [Mock] Error loading station ${id}:`, err);
        onError?.(err);
      });

    return () => {
      console.log(`🔌 [Mock] Unsubscribing from station ${id}`);
    };
  }

  /**
   * Mock implementation of subscribeToReadings.
   * Simulates real-time updates by loading data once and calling the callback.
   */
  subscribeToReadings(
    id: string,
    range: ReadingRange,
    onUpdate: (readings: Reading[]) => void,
    onError?: (error: Error) => void
  ): () => void {
    this.getReadings(id, range)
      .then((readings) => {
        console.log(`🔌 [Mock] Subscribed to readings for ${id} (${range})`);
        onUpdate(readings);
      })
      .catch((err) => {
        console.error(`🔌 [Mock] Error loading readings for ${id}:`, err);
        onError?.(err);
      });

    return () => {
      console.log(`🔌 [Mock] Unsubscribing from readings ${id}`);
    };
  }
}
