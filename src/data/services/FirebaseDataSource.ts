import { ref, get } from 'firebase/database';
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
      // Calculate time range
      const endTime = Math.floor(Date.now() / 1000); // Unix timestamp in seconds
      const startTime = range === '24h'
        ? endTime - 24 * 60 * 60
        : endTime - 7 * 24 * 60 * 60;

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
      let readings: Reading[] = [];
      if (typeof readingsData === 'object') {
        readings = Object.entries(readingsData)
          .map(([key, data]: [string, any]) => {
            // Parse timestamp (can be key or timestamp field)
            const timestamp = this.parseTimestamp(data.timestamp || key);

            return {
              stationId: id,
              timestamp: new Date(timestamp * 1000).toISOString(), // Convert to milliseconds
              windSpeedKts: data.wind?.speed_knots || this.msToKnots(data.wind?.speed_ms || 0),
              windGustKts: data.wind?.speed_knots || this.msToKnots(data.wind?.speed_ms || 0),
              windDirectionDeg: data.wind?.direction || 0,
              temperatureC: data.temperature,
              humidityPct: data.humidity,
              pressureHPa: undefined
            };
          })
          .filter(r => {
            // Filter by time range (timestamp is in seconds)
            const time = Math.floor(new Date(r.timestamp).getTime() / 1000);
            return time >= startTime && time <= endTime;
          });
      }

      // Sort chronologically
      return readings.sort((a, b) => {
        const timeA = new Date(a.timestamp).getTime();
        const timeB = new Date(b.timestamp).getTime();
        return timeA - timeB;
      });
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
      // Try to parse as date string
      const parsed = Date.parse(timestamp);
      return isNaN(parsed) ? Math.floor(Date.now() / 1000) : Math.floor(parsed / 1000);
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
}
