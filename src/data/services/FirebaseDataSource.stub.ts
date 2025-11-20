import {
  ref,
  get,
  query,
  orderByChild,
  startAt,
  endAt,
} from 'firebase/database';
import type { Station, Reading, Forecast, ReadingRange } from '@/types';
import type { DataSource } from './DataSource';
import { db } from '@/app/firebase';

/**
 * FirebaseDataSource implementation for Arduino weather station data.
 *
 * Expected Firebase Realtime Database structure:
 * {
 *   "stations": {
 *     "<station-id>": { Station object }
 *   },
 *   "readings": {
 *     "<station-id>": {
 *       "<reading-id>": { Reading object }
 *     }
 *   },
 *   "forecasts": {
 *     "<station-id>": { Forecast object }
 *   }
 * }
 *
 * If Arduino uses a different structure, this class will need to be adapted.
 */
export class FirebaseDataSource implements DataSource {
  /**
   * Get all weather stations from Firebase.
   * Expected path: /stations
   */
  async getStations(): Promise<Station[]> {
    try {
      const dbRef = ref(db, 'stations');
      const snapshot = await get(dbRef);

      if (!snapshot.exists()) {
        console.warn('No stations found in Firebase at /stations');
        return [];
      }

      const stationsData = snapshot.val();

      // Convert object to array if needed
      if (Array.isArray(stationsData)) {
        return stationsData;
      } else if (typeof stationsData === 'object') {
        return Object.values(stationsData);
      }

      return [];
    } catch (error) {
      console.error('Error fetching stations from Firebase:', error);
      throw new Error(
        `Failed to fetch stations: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Stub implementation - not used in production
   */
  subscribeToStations(
    _onUpdate: (stations: Station[]) => void,
    _onError?: (error: Error) => void
  ): () => void {
    console.warn('subscribeToStations called on stub implementation');
    return () => {};
  }

  /**
   * Stub implementation - not used in production
   */
  subscribeToStation(
    _id: string,
    _onUpdate: (station: Station) => void,
    _onError?: (error: Error) => void
  ): () => void {
    console.warn('subscribeToStation called on stub implementation');
    return () => {};
  }

  /**
   * Stub implementation - not used in production
   */
  subscribeToReadings(
    _id: string,
    _range: ReadingRange,
    _onUpdate: (readings: Reading[]) => void,
    _onError?: (error: Error) => void
  ): () => void {
    console.warn('subscribeToReadings called on stub implementation');
    return () => {};
  }

  /**
   * Get a specific station by ID.
   * Expected path: /stations/<id>
   */
  async getStation(id: string): Promise<Station> {
    try {
      const dbRef = ref(db, `stations/${id}`);
      const snapshot = await get(dbRef);

      if (!snapshot.exists()) {
        throw new Error(`Station ${id} not found in Firebase`);
      }

      return snapshot.val() as Station;
    } catch (error) {
      console.error(`Error fetching station ${id} from Firebase:`, error);
      throw error;
    }
  }

  /**
   * Get readings for a station within a time range.
   * Expected path: /readings/<station-id>/<reading-id>
   * Readings are filtered by timestamp.
   */
  async getReadings(id: string, range: ReadingRange): Promise<Reading[]> {
    try {
      // Calculate time range
      const endTime = Date.now();
      const startTime =
        range === '24h'
          ? endTime - 24 * 60 * 60 * 1000
          : endTime - 7 * 24 * 60 * 60 * 1000;

      const dbRef = ref(db, `readings/${id}`);

      // Query with time-based filtering
      // Note: This assumes readings have a 'timestamp' field as ISO string or milliseconds
      const q = query(
        dbRef,
        orderByChild('timestamp'),
        startAt(startTime),
        endAt(endTime)
      );

      const snapshot = await get(q);

      if (!snapshot.exists()) {
        console.warn(`No readings found for station ${id} in range ${range}`);
        return [];
      }

      const readingsData = snapshot.val();

      // Convert object to array
      let readings: Reading[] = [];
      if (Array.isArray(readingsData)) {
        readings = readingsData;
      } else if (typeof readingsData === 'object') {
        readings = Object.values(readingsData);
      }

      // Sort by timestamp (ascending) to ensure chronological order
      return readings.sort((a, b) => {
        const timeA =
          typeof a.timestamp === 'string'
            ? new Date(a.timestamp).getTime()
            : a.timestamp;
        const timeB =
          typeof b.timestamp === 'string'
            ? new Date(b.timestamp).getTime()
            : b.timestamp;
        return timeA - timeB;
      });
    } catch (error) {
      console.error(`Error fetching readings for station ${id}:`, error);
      throw new Error(
        `Failed to fetch readings: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Get weather forecast for a station.
   * Expected path: /forecasts/<station-id>
   */
  async getForecast(id: string): Promise<Forecast> {
    try {
      const dbRef = ref(db, `forecasts/${id}`);
      const snapshot = await get(dbRef);

      if (!snapshot.exists()) {
        // Return empty forecast if not available
        console.warn(`No forecast found for station ${id}`);
        return {
          stationId: id,
          hourly: [],
        };
      }

      return snapshot.val() as Forecast;
    } catch (error) {
      console.error(`Error fetching forecast for station ${id}:`, error);
      // Return empty forecast on error instead of throwing
      return {
        stationId: id,
        hourly: [],
      };
    }
  }
}
