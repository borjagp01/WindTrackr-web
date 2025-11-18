import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BasicInfoTile } from '@/components/BasicInfoTile';
import { WindCompass } from '@/components/WindCompass';
import { GraphViewer } from '@/components/GraphViewer';
import { WeatherForecast } from '@/components/WeatherForecast';
import { StationMap } from '@/components/StationMap';
import {
  useStationRealtime,
  useReadingsRealtime,
  useForecast,
  useStationsRealtime,
} from '@/features/stations/hooks';

export function Station() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { station, loading: stationLoading, error } = useStationRealtime(id); // ✨ Real-time
  const { readings, loading: readingsLoading } = useReadingsRealtime(id, '7d'); // ✨ Cargar siempre 7 días
  const { forecast, loading: forecastLoading } = useForecast(id);
  const { stations } = useStationsRealtime(); // ✨ Real-time

  if (stationLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            {t('common.loading')}
          </p>
        </div>
      </div>
    );
  }

  if (error || !station) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t('common.error')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error?.message || 'Estación no encontrada'}
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  const latestReading = readings[readings.length - 1];

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/')}
        className="mb-6 flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Volver
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          <BasicInfoTile
            station={station}
            lastUpdated={latestReading?.timestamp}
          />
          <StationMap
            stations={stations}
            selectedStation={station}
            onStationSelect={(stationId) => navigate(`/station/${stationId}`)}
            height="400px"
          />

          {readingsLoading ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <p className="text-center text-gray-600 dark:text-gray-400">
                {t('common.loading')}
              </p>
            </div>
          ) : readings.length > 0 ? (
            <GraphViewer readings={readings} />
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <p className="text-center text-gray-600 dark:text-gray-400">
                {t('common.noData')}
              </p>
            </div>
          )}

          {forecastLoading ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <p className="text-center text-gray-600 dark:text-gray-400">
                {t('common.loading')}
              </p>
            </div>
          ) : forecast ? (
            <WeatherForecast forecast={forecast} />
          ) : null}
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {latestReading && (
            <WindCompass
              directionDeg={latestReading.windDirectionDeg}
              speedAvgKts={latestReading.windSpeedKts}
              gustKts={latestReading.windGustKts}
            />
          )}
        </div>
      </div>
    </div>
  );
}
