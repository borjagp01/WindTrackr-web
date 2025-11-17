import { ref, get, onValue, off } from 'firebase/database';
import type { Station, Reading, Forecast, ReadingRange } from '@/types';
import type { DataSource } from './DataSource';
import { db } from '@/app/firebase';

/**
 * FirebaseDataSource implementation for Arduino weather station data.
 *
 * Expected Firebase Realtime Database structure (V1 - current):
 * {
 *   "weather_stations": {
 *     "<station-id>": {
 *       "info": {
 *         "name": "Station Name",
 *         "latitude": 37.3886,
 *         "longitude": -5.9823,
 *         "altitude": 50,
 *         "country": "España",
 *         "province": "Sevilla",
 *         "station_type": "Automatic",
 *         "operation_mode": "auto",
 *         "version": "0.0.8.5"
 *       },
 *       "current": { current reading snapshot },
 *       "history": {           // V1: uses 'history' instead of 'readings'
 *         "<timestamp>": {
 *           "datetime": "2025-11-15 10:25:46",
 *           "timestamp": 1763198746,
 *           "temperature": 20.5,
 *           "humidity": 65,
 *           "temp_hum_read_ok": true,
 *           "wind": {
 *             "speed_ms": 5.2,
 *             "speed_kmh": 18.72,
 *             "speed_knots": 10.1,
 *             "direction": 225,
 *             "directionCardinal": "SW",
 *             "speed_read_ok": true,
 *             "direction_read_ok": true
 *           }
 *         }
 *       }
 *     }
 *   }
 * }
 *
 * Note: Also supports deprecated structure with 'readings' instead of 'history'
 *
 * Firebase Security Rules:
 * {
 *   "rules": {
 *     "weather_stations": {
 *       ".read": "auth != null",
 *       "$stationId": {
 *         ".read": "auth != null",
 *         ".write": "auth != null"
 *       }
 *     }
 *   }
 * }
 */
export class FirebaseDataSource implements DataSource {
  /**
   * Get all weather stations from Firebase.
   * Expected path: /weather_stations
   */
  async getStations(): Promise<Station[]> {
    try {
      const dbRef = ref(db, 'weather_stations');
      const snapshot = await get(dbRef);

      if (!snapshot.exists()) {
        console.warn('No stations found in Firebase at /weather_stations');
        return [];
      }

      const stationsData = snapshot.val();

      // Convert weather_stations object to Station array
      const stations: Station[] = [];

      for (const [stationId, stationData] of Object.entries(stationsData)) {
        const data = stationData as any;

        // Use info object for station metadata (V1 structure)
        const info = data.info || {};

        stations.push({
          id: stationId,
          name: info.name || stationId,
          location: {
            lat: info.latitude || 0,
            lon: info.longitude || 0,
            elevationM: info.altitude || 0
          },
          description: `${info.province || ''}, ${info.country || ''}`.trim().replace(/^,\s*/, ''),
          provider: info.station_type === 'Automatic' ? 'internal' : 'external',
          status: 'online'
        });
      }

      return stations;
    } catch (error) {
      console.error('Error fetching stations from Firebase:', error);
      throw new Error(`Failed to fetch stations: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get a specific station by ID.
   * Expected path: /weather_stations/<id>
   */
  async getStation(id: string): Promise<Station> {
    try {
      const dbRef = ref(db, `weather_stations/${id}`);
      const snapshot = await get(dbRef);

      if (!snapshot.exists()) {
        throw new Error(`Station ${id} not found in Firebase`);
      }

      const data = snapshot.val() as any;
      const info = data.info || {};

      return {
        id,
        name: info.name || id,
        location: {
          lat: info.latitude || 0,
          lon: info.longitude || 0,
          elevationM: info.altitude || 0
        },
        description: `${info.province || ''}, ${info.country || ''}`.trim().replace(/^,\s*/, ''),
        provider: info.station_type === 'Automatic' ? 'internal' : 'external',
        status: 'online'
      };
    } catch (error) {
      console.error(`Error fetching station ${id} from Firebase:`, error);
      throw error;
    }
  }

  /**
   * Get readings for a station within a time range.
   * Expected path: /weather_stations/<station-id>/history (V1) or /readings (deprecated)
   * Readings are filtered by timestamp.
   */
  async getReadings(id: string, range: ReadingRange): Promise<Reading[]> {
    try {
      // Try 'history' first (V1 structure), fallback to 'readings' (deprecated)
      let dbRef = ref(db, `weather_stations/${id}/history`);
      let snapshot = await get(dbRef);

      if (!snapshot.exists()) {
        // Try deprecated 'readings' path
        dbRef = ref(db, `weather_stations/${id}/readings`);
        snapshot = await get(dbRef);
      }

      if (!snapshot.exists()) {
        console.warn(`No readings found for station ${id}`);
        return [];
      }

      const readingsData = snapshot.val();

      // Convert object to array and map to Reading type
      let allReadings: Reading[] = [];
      if (typeof readingsData === 'object') {
        allReadings = Object.entries(readingsData)
          .map(([key, data]: [string, any]) => {
            // Parse timestamp (can be key or timestamp field)
            const timestamp = this.parseTimestamp(data.timestamp || data.datetime || key);

            const reading = {
              stationId: id,
              timestamp: new Date(timestamp * 1000).toISOString(), // Convert to milliseconds
              windSpeedKts: data.wind?.speed_knots || this.msToKnots(data.wind?.speed_ms || 0),
              windGustKts: data.wind?.speed_knots || this.msToKnots(data.wind?.speed_ms || 0),
              windDirectionDeg: data.wind?.direction || 0,
              temperatureC: data.temperature,
              humidityPct: data.humidity,
              pressureHPa: undefined
            };

            return reading;
          })
          .sort((a, b) => {
            // Sort chronologically (newest first for filtering)
            const timeA = new Date(a.timestamp).getTime();
            const timeB = new Date(b.timestamp).getTime();
            return timeB - timeA;
          });
      }

      // Filter readings by actual time range (not by count)
      // BUT: if no readings in range, show the most recent available data
      const now = Date.now();
      const timeRangeMs = range === '24h' ? 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;
      const cutoffTime = now - timeRangeMs;

      console.log(`🕐 Filtering readings:`, {
        now: new Date(now).toISOString(),
        cutoffTime: new Date(cutoffTime).toISOString(),
        range,
        totalReadings: allReadings.length,
        oldestReading: allReadings[allReadings.length - 1]?.timestamp,
        newestReading: allReadings[0]?.timestamp
      });

      // Filter readings within the time range
      let filteredReadings = allReadings.filter(reading => {
        const readingTime = new Date(reading.timestamp).getTime();
        return readingTime >= cutoffTime;
      });

      // If no readings in the time range, show the most recent available data
      // (e.g., Arduino offline but we still want to show last known data)
      if (filteredReadings.length === 0 && allReadings.length > 0) {
        console.log(`⚠️ No readings in ${range} range, showing most recent available data`);
        const limit = range === '24h' ? 500 : 1000;
        filteredReadings = allReadings.slice(0, Math.min(limit, allReadings.length));
      }

      // Sort chronologically (oldest first) for display
      const readings = filteredReadings.sort((a, b) => {
        const timeA = new Date(a.timestamp).getTime();
        const timeB = new Date(b.timestamp).getTime();
        return timeA - timeB;
      });

      console.log(`📊 Loaded ${readings.length} readings for ${id} (range: ${range}, total available: ${allReadings.length})`);
      if (readings.length > 0) {
        console.log(`📊 Time range: ${readings[0].timestamp} to ${readings[readings.length - 1].timestamp}`);
        console.log(`📊 Cutoff time: ${new Date(cutoffTime).toISOString()} (${range})`);
      }
      return readings;
    } catch (error) {
      console.error(`Error fetching readings for station ${id}:`, error);
      throw new Error(`Failed to fetch readings: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Convert m/s to knots
   */
  private msToKnots(ms: number): number {
    return ms * 1.94384;
  }

  /**
   * Parse timestamp from various formats
   * Returns Unix timestamp in seconds
   */
  private parseTimestamp(timestamp: any): number {
    if (typeof timestamp === 'number') {
      // Already a Unix timestamp in seconds
      return timestamp;
    }
    if (typeof timestamp === 'string') {
      // Try to parse as date string (handles "2025-11-15 11:52:23" format from Arduino)
      // Replace space with 'T' to make it ISO-compatible
      const isoString = timestamp.includes('T') ? timestamp : timestamp.replace(' ', 'T');
      const parsed = Date.parse(isoString);

      if (!isNaN(parsed)) {
        return Math.floor(parsed / 1000);
      }

      console.warn(`⚠️ Could not parse timestamp: "${timestamp}"`);
      return Math.floor(Date.now() / 1000);
    }
    return Math.floor(Date.now() / 1000);
  }

  /**
   * Get weather forecast for a station.
   * Expected path: /weather_stations/<station-id>/forecast
   */
  async getForecast(id: string): Promise<Forecast> {
    try {
      const dbRef = ref(db, `weather_stations/${id}/forecast`);
      const snapshot = await get(dbRef);

      if (!snapshot.exists()) {
        // Return empty forecast if not available
        console.warn(`No forecast found for station ${id}`);
        return {
          stationId: id,
          hourly: []
        };
      }

      const forecastData = snapshot.val();

      // If forecast data exists but doesn't have the expected structure
      if (!forecastData.stationId) {
        forecastData.stationId = id;
      }

      return forecastData as Forecast;
    } catch (error) {
      console.error(`Error fetching forecast for station ${id}:`, error);
      // Return empty forecast on error instead of throwing
      return {
        stationId: id,
        hourly: []
      };
    }
  }

  // ==================== PHASE 2: Real-time Subscriptions ====================

  /**
   * Subscribe to real-time updates for all stations.
   * Uses Firebase onValue() to listen for changes.
   */
  subscribeToStations(
    onUpdate: (stations: Station[]) => void,
    onError?: (error: Error) => void
  ): () => void {
    const dbRef = ref(db, 'weather_stations');

    const unsubscribe = onValue(
      dbRef,
      (snapshot) => {
        try {
          if (!snapshot.exists()) {
            console.warn('🔄 Real-time: No stations found');
            onUpdate([]);
            return;
          }

          const stationsData = snapshot.val();
          const stations: Station[] = [];

          for (const [stationId, stationData] of Object.entries(stationsData)) {
            const data = stationData as any;
            const info = data.info || {};

            stations.push({
              id: stationId,
              name: info.name || stationId,
              location: {
                lat: info.latitude || 0,
                lon: info.longitude || 0,
                elevationM: info.altitude || 0
              },
              description: `${info.province || ''}, ${info.country || ''}`.trim().replace(/^,\s*/, ''),
              provider: info.station_type === 'Automatic' ? 'internal' : 'external',
              status: 'online'
            });
          }

          console.log(`🔄 Real-time update: ${stations.length} stations`);
          onUpdate(stations);
        } catch (error) {
          console.error('Error processing stations update:', error);
          if (onError) {
            onError(error instanceof Error ? error : new Error('Unknown error'));
          }
        }
      },
      (error) => {
        console.error('Firebase onValue error (stations):', error);
        if (onError) {
          onError(error);
        }
      }
    );

    // Return cleanup function
    return () => {
      console.log('🔌 Unsubscribing from stations');
      off(dbRef);
    };
  }

  /**
   * Subscribe to real-time updates for a specific station.
   */
  subscribeToStation(
    id: string,
    onUpdate: (station: Station) => void,
    onError?: (error: Error) => void
  ): () => void {
    const dbRef = ref(db, `weather_stations/${id}`);

    const unsubscribe = onValue(
      dbRef,
      (snapshot) => {
        try {
          if (!snapshot.exists()) {
            const error = new Error(`Station ${id} not found`);
            console.error(error.message);
            if (onError) {
              onError(error);
            }
            return;
          }

          const data = snapshot.val() as any;
          const info = data.info || {};

          const station: Station = {
            id,
            name: info.name || id,
            location: {
              lat: info.latitude || 0,
              lon: info.longitude || 0,
              elevationM: info.altitude || 0
            },
            description: `${info.province || ''}, ${info.country || ''}`.trim().replace(/^,\s*/, ''),
            provider: info.station_type === 'Automatic' ? 'internal' : 'external',
            status: 'online'
          };

          console.log(`🔄 Real-time update: station ${id}`);
          onUpdate(station);
        } catch (error) {
          console.error(`Error processing station ${id} update:`, error);
          if (onError) {
            onError(error instanceof Error ? error : new Error('Unknown error'));
          }
        }
      },
      (error) => {
        console.error(`Firebase onValue error (station ${id}):`, error);
        if (onError) {
          onError(error);
        }
      }
    );

    return () => {
      console.log(`🔌 Unsubscribing from station ${id}`);
      off(dbRef);
    };
  }

  /**
   * Subscribe to real-time updates for station readings.
   * Filters readings by time range and handles fallback to deprecated paths.
   */
  subscribeToReadings(
    id: string,
    range: ReadingRange,
    onUpdate: (readings: Reading[]) => void,
    onError?: (error: Error) => void
  ): () => void {
    // Try 'history' first (V1 structure)
    const historyRef = ref(db, `weather_stations/${id}/history`);

    const unsubscribe = onValue(
      historyRef,
      (snapshot) => {
        try {
          if (!snapshot.exists()) {
            // Try deprecated 'readings' path as fallback
            const readingsRef = ref(db, `weather_stations/${id}/readings`);
            onValue(
              readingsRef,
              (snapshot2) => {
                if (!snapshot2.exists()) {
                  console.warn(`🔄 Real-time: No readings found for station ${id}`);
                  onUpdate([]);
                  return;
                }
                const readings = this.processReadingsSnapshot(snapshot2, id, range);
                console.log(`🔄 Real-time update: ${readings.length} readings for ${id} (deprecated path)`);
                onUpdate(readings);
              },
              (error) => {
                console.error(`Firebase onValue error (readings ${id} - deprecated):`, error);
                if (onError) {
                  onError(error);
                }
              }
            );
            return;
          }

          const readings = this.processReadingsSnapshot(snapshot, id, range);
          console.log(`🔄 Real-time update: ${readings.length} readings for ${id}`);
          onUpdate(readings);
        } catch (error) {
          console.error(`Error processing readings update for ${id}:`, error);
          if (onError) {
            onError(error instanceof Error ? error : new Error('Unknown error'));
          }
        }
      },
      (error) => {
        console.error(`Firebase onValue error (readings ${id}):`, error);
        if (onError) {
          onError(error);
        }
      }
    );

    return () => {
      console.log(`🔌 Unsubscribing from readings for ${id}`);
      off(historyRef);
    };
  }

  /**
   * Helper: Process readings snapshot (extracted from getReadings).
   * Reusable logic for both one-time fetch and real-time subscriptions.
   */
  private processReadingsSnapshot(snapshot: any, id: string, range: ReadingRange): Reading[] {
    const readingsData = snapshot.val();

    // Convert object to array and map to Reading type
    let allReadings: Reading[] = [];
    if (typeof readingsData === 'object') {
      allReadings = Object.entries(readingsData)
        .map(([key, data]: [string, any]) => {
          // Parse timestamp (can be key or timestamp field)
          const timestamp = this.parseTimestamp(data.timestamp || data.datetime || key);

          const reading = {
            stationId: id,
            timestamp: new Date(timestamp * 1000).toISOString(), // Convert to milliseconds
            windSpeedKts: data.wind?.speed_knots || this.msToKnots(data.wind?.speed_ms || 0),
            windGustKts: data.wind?.speed_knots || this.msToKnots(data.wind?.speed_ms || 0),
            windDirectionDeg: data.wind?.direction || 0,
            temperatureC: data.temperature,
            humidityPct: data.humidity,
            pressureHPa: undefined
          };

          return reading;
        })
        .sort((a, b) => {
          // Sort chronologically (newest first for filtering)
          const timeA = new Date(a.timestamp).getTime();
          const timeB = new Date(b.timestamp).getTime();
          return timeB - timeA;
        });
    }

    // Filter readings by actual time range
    const now = Date.now();
    const timeRangeMs = range === '24h' ? 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;
    const cutoffTime = now - timeRangeMs;

    // Filter readings within the time range
    let filteredReadings = allReadings.filter(reading => {
      const readingTime = new Date(reading.timestamp).getTime();
      return readingTime >= cutoffTime;
    });

    // If no readings in the time range, show the most recent available data
    if (filteredReadings.length === 0 && allReadings.length > 0) {
      const limit = range === '24h' ? 500 : 1000;
      filteredReadings = allReadings.slice(0, Math.min(limit, allReadings.length));
    }

    // Sort chronologically (oldest first) for display
    return filteredReadings.sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return timeA - timeB;
    });
  }
}
