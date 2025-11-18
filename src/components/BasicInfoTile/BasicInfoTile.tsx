import { useTranslation } from 'react-i18next';
import type { Station, StationStatus } from '@/types';
import { formatDateTime } from '@/utils';

interface BasicInfoTileProps {
  station: Station;
  lastUpdated?: string;
}

export function BasicInfoTile({ station, lastUpdated }: BasicInfoTileProps) {
  const { t } = useTranslation();

  // Calculate if data is stale (more than 5 minutes old)
  const isDataStale = lastUpdated
    ? Date.now() - new Date(lastUpdated).getTime() > 5 * 60 * 1000
    : false;

  // Determine actual status based on data freshness
  const actualStatus = isDataStale ? 'offline' : station.status;

  const statusColors: Record<StationStatus, string> = {
    online:
      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    offline: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    warning:
      'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    maintenance:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {station.name}
          </h2>
          {station.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {station.description}
            </p>
          )}
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[actualStatus]}`}
        >
          {t(`station.status.${actualStatus}`)}
        </span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span>
            {station.location.lat.toFixed(4)}, {station.location.lon.toFixed(4)}
            {station.location.elevationM &&
              ` • ${station.location.elevationM}m`}
          </span>
        </div>

        {lastUpdated && (
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              {t('station.lastUpdate')}: {formatDateTime(lastUpdated)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
