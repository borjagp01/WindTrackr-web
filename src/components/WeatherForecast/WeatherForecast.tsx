import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  WiStrongWind,
  WiWindDeg,
  WiThermometer,
  WiDaySunny,
  WiCloudy,
  WiRain,
  WiRaindrops,
  WiBarometer,
} from 'react-icons/wi';
import type { Forecast } from '@/types';
import {
  formatTime,
  formatWindSpeed,
  formatTemperature,
  getWindDirectionCardinal,
} from '@/utils';

interface WeatherForecastProps {
  forecast: Forecast;
}

type ViewMode = 'hourly' | 'daily';

// Mapeo de códigos de estado del cielo de AEMET
const getSkyIcon = (code: string | null) => {
  if (!code) return WiDaySunny;

  // Códigos AEMET: https://www.aemet.es/es/eltiempo/prediccion/municipios/ayuda
  if (['11', '11n'].includes(code)) return WiDaySunny; // Despejado
  if (['12', '12n', '13', '13n'].includes(code)) return WiCloudy; // Poco/Algo nuboso
  if (['43', '43n', '44', '44n', '45', '45n'].includes(code)) return WiRain; // Lluvia
  if (['51', '51n', '52', '52n', '53', '53n'].includes(code))
    return WiRaindrops; // Chubascos

  return WiCloudy; // Por defecto
};

export function WeatherForecast({ forecast }: WeatherForecastProps) {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<ViewMode>('hourly');

  // Validar que existan datos
  if (!forecast || !forecast.hourly || forecast.hourly.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('weather.forecast')}
        </h3>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No hay datos de pronóstico disponibles
        </div>
      </div>
    );
  }

  // Datos horarios: próximas 24 horas, cada 3 horas
  const next24Hours = forecast.hourly.slice(0, 24);
  const hourlyDisplay = next24Hours.filter((_, index) => index % 3 === 0);

  // Datos semanales
  const weeklyData = forecast.weekly || [];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {/* Header con selector de vista */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('weather.forecast')}
          </h3>

          {/* Toggle de vista */}
          {weeklyData.length > 0 && (
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('hourly')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'hourly'
                    ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                24h
              </button>
              <button
                onClick={() => setViewMode('daily')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'daily'
                    ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                7 días
              </button>
            </div>
          )}
        </div>

        {/* Crédito AEMET */}
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <WiBarometer size={16} />
          <span>Datos por cortesía de</span>
          <a
            href="https://www.aemet.es"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary-600 dark:text-primary-400 hover:underline"
          >
            AEMET
          </a>
          <span>© AEMET</span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4">
        <AnimatePresence mode="wait">
          {viewMode === 'hourly' ? (
            <HourlyView key="hourly" data={hourlyDisplay} />
          ) : (
            <DailyView key="daily" data={weeklyData} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Vista horaria (24h)
function HourlyView({ data }: { data: Forecast['hourly'] }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
    >
      <div className="overflow-x-auto -mx-4 px-4">
        <div className="flex gap-3 pb-2 min-w-max">
          {data.map((item, index) => (
            <motion.div
              key={`${item.timestamp}-${index}`}
              className="flex-shrink-0 w-24 p-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03, duration: 0.25 }}
              whileHover={{ scale: 1.03, y: -2 }}
            >
              {/* Hora */}
              <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 text-center">
                {formatTime(item.timestamp)}
              </div>

              {/* Icono de viento con dirección */}
              <div className="flex justify-center mb-2 relative">
                <motion.div
                  animate={{ rotate: item.directionDeg }}
                  transition={{ type: 'spring', stiffness: 120, damping: 15 }}
                >
                  <WiWindDeg
                    className="text-primary-500 dark:text-primary-400"
                    size={40}
                  />
                </motion.div>
              </div>

              {/* Dirección cardinal */}
              <div className="text-xs font-bold text-primary-600 dark:text-primary-400 mb-2 text-center">
                {getWindDirectionCardinal(item.directionDeg)}
              </div>

              {/* Velocidad del viento */}
              <div className="flex items-center justify-center gap-1 mb-1">
                <WiStrongWind
                  className="text-blue-500 dark:text-blue-400 flex-shrink-0"
                  size={18}
                />
                <span className="font-bold text-sm text-gray-900 dark:text-white">
                  {formatWindSpeed(item.windKts, 'kts')}
                </span>
              </div>

              {/* Rachas */}
              <div className="text-xs text-orange-600 dark:text-orange-400 text-center mb-2 font-semibold">
                ↑ {formatWindSpeed(item.gustKts, 'kts')}
              </div>

              {/* Temperatura */}
              {item.tempC !== undefined && item.tempC !== null && (
                <div className="flex items-center justify-center gap-1 pt-2 border-t border-gray-300 dark:border-gray-600">
                  <WiThermometer
                    className="text-red-500 dark:text-red-400 flex-shrink-0"
                    size={18}
                  />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {formatTemperature(item.tempC)}
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Vista diaria (7 días)
function DailyView({ data }: { data: Forecast['weekly'] }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No hay datos semanales disponibles
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="space-y-3"
    >
      {data.map((day, index) => {
        const date = new Date(day.date);
        const dayName = date.toLocaleDateString('es-ES', { weekday: 'short' });
        const dayNum = date.getDate();
        const month = date.toLocaleDateString('es-ES', { month: 'short' });
        const SkyIcon = getSkyIcon(day.skyState?.code || null);

        return (
          <motion.div
            key={day.date}
            className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700/30 dark:to-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.25 }}
            whileHover={{ x: 4 }}
          >
            {/* Fecha */}
            <div className="flex-shrink-0 w-16 text-center">
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                {dayName}
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {dayNum}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {month}
              </div>
            </div>

            {/* Estado del cielo */}
            <div className="flex-shrink-0 w-20 text-center">
              <SkyIcon
                className="mx-auto text-yellow-500 dark:text-yellow-400"
                size={48}
              />
              {day.skyState?.description && (
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-tight">
                  {day.skyState.description}
                </div>
              )}
            </div>

            {/* Temperatura */}
            <div className="flex-shrink-0 w-24">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <WiThermometer
                    className="text-red-500 dark:text-red-400"
                    size={20}
                  />
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {day.tempMax !== null
                      ? formatTemperature(day.tempMax)
                      : '--'}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <WiThermometer
                    className="text-blue-500 dark:text-blue-400"
                    size={20}
                  />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {day.tempMin !== null
                      ? formatTemperature(day.tempMin)
                      : '--'}
                  </span>
                </div>
              </div>
            </div>

            {/* Viento */}
            <div className="flex-1 flex items-center gap-4">
              {/* Dirección */}
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: day.directionDeg }}
                  transition={{ type: 'spring', stiffness: 120, damping: 15 }}
                >
                  <WiWindDeg
                    className="text-primary-500 dark:text-primary-400"
                    size={32}
                  />
                </motion.div>
                <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">
                  {getWindDirectionCardinal(day.directionDeg)}
                </span>
              </div>

              {/* Velocidad */}
              <div className="flex items-center gap-1">
                <WiStrongWind
                  className="text-blue-500 dark:text-blue-400"
                  size={24}
                />
                <div className="text-sm">
                  <span className="font-bold text-gray-900 dark:text-white">
                    {formatWindSpeed(day.windKts, 'kts')}
                  </span>
                  {day.gustKts > 0 && (
                    <span className="text-xs text-orange-600 dark:text-orange-400 ml-1">
                      (↑{formatWindSpeed(day.gustKts, 'kts')})
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Precipitación */}
            {day.precipProb > 0 && (
              <div className="flex-shrink-0 flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <WiRaindrops
                  className="text-blue-600 dark:text-blue-400"
                  size={20}
                />
                <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                  {day.precipProb}%
                </span>
              </div>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
