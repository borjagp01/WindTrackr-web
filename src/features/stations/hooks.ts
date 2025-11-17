import { useEffect, useState } from 'react';
import { getDataSource } from '@/data/services';
import type { Station, Reading, Forecast, ReadingRange } from '@/types';

const dataSource = getDataSource();

export function useStations() {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    dataSource
      .getStations()
      .then(setStations)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { stations, loading, error };
}

export function useStation(id: string | undefined) {
  const [station, setStation] = useState<Station | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    dataSource
      .getStation(id)
      .then(setStation)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  return { station, loading, error };
}

export function useReadings(id: string | undefined, range: ReadingRange = '24h') {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    dataSource
      .getReadings(id, range)
      .then(setReadings)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id, range]);

  return { readings, loading, error, refetch: () => {
    if (!id) return;
    setLoading(true);
    dataSource
      .getReadings(id, range)
      .then(setReadings)
      .catch(setError)
      .finally(() => setLoading(false));
  }};
}

export function useForecast(id: string | undefined) {
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    dataSource
      .getForecast(id)
      .then(setForecast)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  return { forecast, loading, error };
}

// ==================== PHASE 2: Real-time Hooks ====================

/**
 * Subscribe to real-time updates for all stations.
 * Uses Firebase onValue() for automatic updates when data changes.
 */
export function useStationsRealtime() {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);

    const unsubscribe = dataSource.subscribeToStations(
      (updatedStations) => {
        setStations(updatedStations);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    // Cleanup on unmount
    return () => {
      console.log('🧹 Cleaning up stations subscription');
      unsubscribe();
    };
  }, []); // Empty deps: subscribe once

  return { stations, loading, error };
}

/**
 * Subscribe to real-time updates for a single station.
 * Uses Firebase onValue() for automatic updates when data changes.
 */
export function useStationRealtime(id: string | undefined) {
  const [station, setStation] = useState<Station | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = dataSource.subscribeToStation(
      id,
      (updatedStation) => {
        setStation(updatedStation);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => {
      console.log(`🧹 Cleaning up station subscription for ${id}`);
      unsubscribe();
    };
  }, [id]);

  return { station, loading, error };
}

/**
 * Subscribe to real-time updates for station readings.
 * Uses Firebase onValue() for automatic updates when new readings arrive.
 */
export function useReadingsRealtime(id: string | undefined, range: ReadingRange = '24h') {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = dataSource.subscribeToReadings(
      id,
      range,
      (updatedReadings) => {
        setReadings(updatedReadings);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    // Cleanup on unmount or when id/range changes
    return () => {
      console.log(`🧹 Cleaning up readings subscription for ${id}`);
      unsubscribe();
    };
  }, [id, range]); // Re-subscribe when id or range changes

  return { readings, loading, error };
}
