import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { Reading, ReadingRange } from '@/types';
import { formatTime, formatWindSpeed, formatTemperature } from '@/utils';

interface GraphViewerProps {
  readings: Reading[];
  range: ReadingRange;
  onRangeChange: (range: ReadingRange) => void;
}

export function GraphViewer({ readings, range, onRangeChange }: GraphViewerProps) {
  const { t } = useTranslation();
  const [visibleLines, setVisibleLines] = useState({
    windSpeed: true,
    windGust: true,
    temperature: false,
  });

  const chartData = readings.map((r) => ({
    timestamp: r.timestamp,
    time: formatTime(r.timestamp),
    windSpeed: r.windSpeedKts,
    windGust: r.windGustKts,
    temperature: r.temperatureC || 0,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            {formatTime(payload[0].payload.timestamp)}
          </p>
          {payload.map((entry: any) => (
            <p key={entry.dataKey} className="text-sm" style={{ color: entry.color }}>
              {entry.name}:{' '}
              {entry.dataKey === 'temperature'
                ? formatTemperature(entry.value)
                : formatWindSpeed(entry.value, 'kts')}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('graph.title')}
        </h3>

        <div className="flex gap-2">
          <button
            onClick={() => onRangeChange('24h')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              range === '24h'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {t('range.24h')}
          </button>
          <button
            onClick={() => onRangeChange('7d')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              range === '7d'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {t('range.7d')}
          </button>
        </div>
      </div>

      {/* Legend toggles */}
      <div className="flex flex-wrap gap-4 mb-4">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={visibleLines.windSpeed}
            onChange={(e) =>
              setVisibleLines({ ...visibleLines, windSpeed: e.target.checked })
            }
            className="mr-2"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {t('graph.windSpeed')}
          </span>
        </label>
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={visibleLines.windGust}
            onChange={(e) =>
              setVisibleLines({ ...visibleLines, windGust: e.target.checked })
            }
            className="mr-2"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {t('graph.windGust')}
          </span>
        </label>
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={visibleLines.temperature}
            onChange={(e) =>
              setVisibleLines({ ...visibleLines, temperature: e.target.checked })
            }
            className="mr-2"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {t('graph.temperature')}
          </span>
        </label>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 12 }}
            className="fill-gray-600 dark:fill-gray-400"
            interval="preserveStartEnd"
          />
          <YAxis tick={{ fontSize: 12 }} className="fill-gray-600 dark:fill-gray-400" />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {visibleLines.windSpeed && (
            <Line
              type="monotone"
              dataKey="windSpeed"
              stroke="#3b82f6"
              name={t('graph.windSpeed')}
              dot={false}
              strokeWidth={2}
            />
          )}
          {visibleLines.windGust && (
            <Line
              type="monotone"
              dataKey="windGust"
              stroke="#ef4444"
              name={t('graph.windGust')}
              dot={false}
              strokeWidth={2}
            />
          )}
          {visibleLines.temperature && (
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="#10b981"
              name={t('graph.temperature')}
              dot={false}
              strokeWidth={2}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
