import type { DataSource } from './DataSource';
import { MockDataSource } from './MockDataSource';
import { FirebaseDataSource } from './FirebaseDataSource';

export * from './DataSource';

/**
 * Get the configured data source based on environment variable.
 * Set VITE_DATA_SOURCE in .env to 'mock' or 'firebase'.
 */
export function getDataSource(): DataSource {
  const source = import.meta.env.VITE_DATA_SOURCE || 'mock';

  switch (source) {
    case 'mock':
      console.log('Using mock data source');
      return new MockDataSource();
    case 'firebase':
      console.log('Using Firebase data source');
      return new FirebaseDataSource();
    default:
      console.warn(`Unknown data source: ${source}. Falling back to mock.`);
      return new MockDataSource();
  }
}
