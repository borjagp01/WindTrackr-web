import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { StationMap } from '@/components/StationMap';
import { useStationsRealtime } from '@/features/stations/hooks';

export function Map() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { stations, loading } = useStationsRealtime(); // ✨ Real-time

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('map.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Haz click en una estación para ver más detalles
        </p>
      </div>

      <div className="mb-6">
        <StationMap
          stations={stations}
          onStationSelect={(id) => navigate(`/station/${id}`)}
          height="calc(100vh - 250px)"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stations.map((station) => (
          <button
            key={station.id}
            onClick={() => navigate(`/station/${station.id}`)}
            className="text-left p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">{station.name}</h3>
              <span
                className={`px-2 py-1 rounded text-xs ${
                  station.status === 'online'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : station.status === 'offline'
                    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                }`}
              >
                {t(`station.status.${station.status}`)}
              </span>
            </div>
            {station.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {station.description}
              </p>
            )}
            <div className="text-xs text-gray-500 dark:text-gray-500">
              {station.location.lat.toFixed(4)}, {station.location.lon.toFixed(4)}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
