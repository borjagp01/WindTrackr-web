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
