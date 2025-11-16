import { create } from 'zustand';
import type { Station } from '@/types';

interface AppState {
  selectedStationId: string | null;
  setSelectedStation: (stationId: string | null) => void;

  stations: Station[];
  setStations: (stations: Station[]) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedStationId: null,
  setSelectedStation: (stationId) => set({ selectedStationId: stationId }),

  stations: [],
  setStations: (stations) => set({ stations }),
}));
