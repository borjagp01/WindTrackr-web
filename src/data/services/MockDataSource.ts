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
}
