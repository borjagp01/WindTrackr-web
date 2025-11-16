import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Station } from '@/types';

interface StationSelectorProps {
  stations: Station[];
  selectedId: string | null;
  onSelect: (stationId: string) => void;
}

export function StationSelector({ stations, selectedId, onSelect }: StationSelectorProps) {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredStations = useMemo(() => {
    if (!search) return stations;
    const searchLower = search.toLowerCase();
    return stations.filter((s) =>
      s.name.toLowerCase().includes(searchLower) ||
      s.description?.toLowerCase().includes(searchLower)
    );
  }, [stations, search]);

  const selectedStation = stations.find((s) => s.id === selectedId);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 text-left bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              {t('station.select')}
            </div>
            <div className="font-medium text-gray-900 dark:text-white">
              {selectedStation?.name || t('station.select')}
            </div>
          </div>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-80 overflow-hidden">
            <div className="p-2 border-b border-gray-200 dark:border-gray-700">
              <input
                type="text"
                placeholder={t('station.search')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
                autoFocus
              />
            </div>
            <div className="overflow-y-auto max-h-64">
              {filteredStations.map((station) => (
                <button
                  key={station.id}
                  onClick={() => {
                    onSelect(station.id);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    station.id === selectedId ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                  }`}
                >
                  <div className="font-medium text-gray-900 dark:text-white">
                    {station.name}
                  </div>
                  {station.description && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {station.description}
                    </div>
                  )}
                </button>
              ))}
              {filteredStations.length === 0 && (
                <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                  {t('common.noData')}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
