import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { StationSelector } from '@/components/StationSelector';
import { BasicInfoTile } from '@/components/BasicInfoTile';
import { WindCompass } from '@/components/WindCompass';
import { GraphViewer } from '@/components/GraphViewer';
import { WeatherForecast } from '@/components/WeatherForecast';
import { StationMap } from '@/components/StationMap';
import { useStationsRealtime, useReadingsRealtime, useForecast } from '@/features/stations/hooks';
import type { ReadingRange } from '@/types';

export function Home() {
  const { t } = useTranslation();
  const { stations, loading: stationsLoading } = useStationsRealtime(); // ✨ Real-time
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);
  const [range, setRange] = useState<ReadingRange>('24h');

  const { readings, loading: readingsLoading } = useReadingsRealtime(selectedStationId || undefined, range); // ✨ Real-time
  const { forecast, loading: forecastLoading } = useForecast(selectedStationId || undefined);

  // Auto-select first station on load
  useEffect(() => {
    if (stations.length > 0 && !selectedStationId) {
      setSelectedStationId(stations[0].id);
    }
  }, [stations, selectedStationId]);

  const selectedStation = stations.find((s) => s.id === selectedStationId);
  const latestReading = readings[readings.length - 1];

  if (stationsLoading) {
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
        <StationSelector
          stations={stations}
          selectedId={selectedStationId}
          onSelect={setSelectedStationId}
        />
      </div>

      {selectedStation && (
        <div className="space-y-6">
          {/* Two column layout - Map + Info | Wind Compass */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - Map + BasicInfo */}
            <div className="lg:col-span-2 space-y-6">
              <BasicInfoTile
                station={selectedStation}
                lastUpdated={latestReading?.timestamp}
              />
              <StationMap
                stations={stations}
                selectedStation={selectedStation}
                onStationSelect={setSelectedStationId}
                height="300px"
              />
            </div>

            {/* Right column - Wind Compass */}
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

          {/* Graphs - Full width */}
          <div className="w-full">
            {readingsLoading ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <p className="text-center text-gray-600 dark:text-gray-400">
                  {t('common.loading')}
                </p>
              </div>
            ) : readings.length > 0 ? (
              <GraphViewer readings={readings} range={range} onRangeChange={setRange} />
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <p className="text-center text-gray-600 dark:text-gray-400">
                  {t('common.noData')}
                </p>
              </div>
            )}
          </div>

          {/* Forecast - Full width */}
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
      )}

      {!selectedStation && stations.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">{t('common.noData')}</p>
        </div>
      )}
    </div>
  );
}
