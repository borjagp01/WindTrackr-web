import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { WiStrongWind, WiWindDeg, WiThermometer } from 'react-icons/wi';
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
            <motion.div
              key={index}
              className="flex-shrink-0 w-28 p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              whileHover={{ scale: 1.05, y: -4 }}
            >
              <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-3 text-center">
                {formatTime(item.timestamp)}
              </div>

              {/* Wind icon with direction - usando React Icons */}
              <div className="flex justify-center mb-3 relative">
                <motion.div
                  animate={{ rotate: item.directionDeg }}
                  transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                  className="relative"
                >
                  <WiWindDeg
                    className="text-primary-500 dark:text-primary-400"
                    size={48}
                  />
                </motion.div>
              </div>

              <div className="text-xs font-bold text-primary-600 dark:text-primary-400 mb-2 text-center">
                {getWindDirectionCardinal(item.directionDeg)}
              </div>

              {/* Wind speed con icono */}
              <div className="flex items-center justify-center gap-1 mb-2">
                <WiStrongWind className="text-blue-500 dark:text-blue-400" size={20} />
                <span className="font-bold text-sm text-gray-900 dark:text-white">
                  {formatWindSpeed(item.windKts, 'kts')}
                </span>
              </div>

              {/* Gust speed */}
              <div className="text-xs text-orange-600 dark:text-orange-400 text-center mb-2 font-semibold">
                ↑ {formatWindSpeed(item.gustKts, 'kts')}
              </div>

              {/* Temperature con icono */}
              {item.tempC !== undefined && (
                <div className="flex items-center justify-center gap-1 pt-2 border-t border-gray-300 dark:border-gray-600">
                  <WiThermometer className="text-red-500 dark:text-red-400" size={20} />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {formatTemperature(item.tempC)}
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
