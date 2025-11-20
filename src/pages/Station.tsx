import { useIsMobile } from '@/utils/useIsMobilePortrait';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BasicInfoTile } from '@/components/BasicInfoTile';
import { WeatherPanel } from '@/components/WeatherPanel';
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
  const isMobile = useIsMobile();
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

      <div className="col-span-6 gap-6 mb-6">
        <BasicInfoTile
          station={station}
          lastUpdated={latestReading?.timestamp}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
        {/* Left column */}
        <div className="lg:col-span-3 flex flex-col gap-10">
          <StationMap
            stations={stations}
            selectedStation={station}
            onStationSelect={(stationId) => navigate(`/station/${stationId}`)}
            height={isMobile ? '225px' : '505px'}
          />
          {/* Tarjetas de Temperatura y Humedad */}
          {/* {latestReading && (
            <div className="grid grid-cols-2 gap-6">
              {latestReading.temperatureC !== undefined && (
                <DataCard
                  label="Temperatura"
                  value={latestReading.temperatureC}
                  unit="°C"
                  color="orange"
                />
              )}
              {latestReading.humidityPct !== undefined && (
                <DataCard
                  label="Humedad"
                  value={latestReading.humidityPct}
                  unit="%"
                  color="blue"
                />
              )}
            </div>
          )} */}
        </div>

        {/* Right column */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* <BasicInfoTile
            station={station}
            lastUpdated={latestReading?.timestamp}
          /> */}

          {latestReading && (
            <WeatherPanel
              directionDeg={latestReading.windDirectionDeg}
              speedAvgKts={latestReading.windSpeedKts}
              gustKts={latestReading.windGustKts}
              temperatureC={latestReading.temperatureC}
              humidityPct={latestReading.humidityPct}
            />
          )}
        </div>
      </div>

      {/* Graphs - full width below the two-column layout */}
      <div className="w-full mt-6">
        {readingsLoading ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <p className="text-center text-gray-600 dark:text-gray-400">
              {t('common.loading')}
            </p>
          </div>
        ) : readings.length > 0 ? (
          <div className="w-full">
            <GraphViewer readings={readings} />
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <p className="text-center text-gray-600 dark:text-gray-400">
              {t('common.noData')}
            </p>
          </div>
        )}
      </div>

      {/* Forecast section separated from graphs */}
      <div className="w-full mt-6">
        {forecastLoading ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <p className="text-center text-gray-600 dark:text-gray-400">
              {t('common.loading')}
            </p>
          </div>
        ) : forecast ? (
          <div className="w-full">
            <WeatherForecast forecast={forecast} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
