export type StationStatus = 'online' | 'offline' | 'maintenance';

export type StationProvider = 'internal' | 'external';

export interface StationLocation {
  lat: number;
  lon: number;
  elevationM?: number;
}

export interface Station {
  id: string;
  name: string;
  location: StationLocation;
  description?: string;
  provider?: StationProvider;
  status: StationStatus;
}
