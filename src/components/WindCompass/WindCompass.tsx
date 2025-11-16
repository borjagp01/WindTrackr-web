import { useTranslation } from 'react-i18next';
import { formatWindSpeed, getWindDirectionCardinal, getWindDirectionName } from '@/utils';

interface WindCompassProps {
  directionDeg: number;
  speedAvgKts: number;
  gustKts: number;
}

export function WindCompass({ directionDeg, speedAvgKts, gustKts }: WindCompassProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {t('wind.compass')}
      </h3>

      <div className="flex flex-col items-center">
        {/* Compass */}
        <div className="relative w-48 h-48 mb-6">
          {/* Background circle */}
          <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700" />

          {/* Cardinal directions */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full">
              <div className="absolute top-2 left-1/2 -translate-x-1/2 text-sm font-bold text-gray-700 dark:text-gray-300">
                N
              </div>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-700 dark:text-gray-300">
                E
              </div>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-sm font-bold text-gray-700 dark:text-gray-300">
                S
              </div>
              <div className="absolute left-2 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-700 dark:text-gray-300">
                W
              </div>
            </div>
          </div>

          {/* Wind arrow */}
          <div
            className="absolute inset-0 flex items-center justify-center transition-transform duration-500"
            style={{ transform: `rotate(${directionDeg}deg)` }}
          >
            <div className="w-1 h-20 bg-primary-500 rounded-full relative">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-primary-500" />
            </div>
          </div>

          {/* Center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 bg-primary-500 rounded-full" />
          </div>
        </div>

        {/* Wind data */}
        <div className="w-full space-y-3">
          <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {t('wind.direction')}
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {getWindDirectionCardinal(directionDeg)} ({directionDeg}°)
            </span>
          </div>

          <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {getWindDirectionName(directionDeg)}
            </span>
          </div>

          <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {t('wind.average')}
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {formatWindSpeed(speedAvgKts, 'kts')}
            </span>
          </div>

          <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {t('wind.gust')}
            </span>
            <span className="font-semibold text-primary-600 dark:text-primary-400">
              {formatWindSpeed(gustKts, 'kts')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
