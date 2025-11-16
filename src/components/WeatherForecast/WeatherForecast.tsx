import { useTranslation } from 'react-i18next';
import type { Forecast } from '@/types';
import { formatTime, formatWindSpeed, formatTemperature, getWindDirectionCardinal } from '@/utils';

interface WeatherForecastProps {
  forecast: Forecast;
}

export function WeatherForecast({ forecast }: WeatherForecastProps) {
  const { t } = useTranslation();

  // Show only next 24 hours (first 24 items)
  const next24Hours = forecast.hourly.slice(0, 24);

  // Show every 3 hours for better visibility
  const displayItems = next24Hours.filter((_, index) => index % 3 === 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {t('weather.forecast')} (24h)
      </h3>

      <div className="overflow-x-auto">
        <div className="flex gap-4 pb-2">
          {displayItems.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-24 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center"
            >
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                {formatTime(item.timestamp)}
              </div>

              {/* Wind icon with direction */}
              <div className="flex justify-center mb-2">
                <div
                  className="w-8 h-8 flex items-center justify-center"
                  style={{ transform: `rotate(${item.directionDeg}deg)` }}
                >
                  <svg className="w-6 h-6 text-primary-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l-2 8h4l-2-8zm0 20l2-8h-4l2 8z" />
                  </svg>
                </div>
              </div>

              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {getWindDirectionCardinal(item.directionDeg)}
              </div>

              <div className="font-semibold text-sm text-gray-900 dark:text-white">
                {formatWindSpeed(item.windKts, 'kts')}
              </div>

              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                ↑ {formatWindSpeed(item.gustKts, 'kts')}
              </div>

              {item.tempC !== undefined && (
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  {formatTemperature(item.tempC)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
