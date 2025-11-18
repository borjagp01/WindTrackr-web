import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import type { Reading } from '@/types';
import { formatTime, formatWindSpeed, formatTemperature } from '@/utils';
import { useThemeStore } from '@/theme/theme';

interface GraphViewerProps {
  readings: Reading[];
}

export function GraphViewer({ readings }: GraphViewerProps) {
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const windChartRef = useRef<ReactECharts>(null);
  const tempChartRef = useRef<ReactECharts>(null);

  const [visibleLines, setVisibleLines] = useState({
    windSpeed: true,
    windGust: true,
  });

  const chartData = readings.map((r) => ({
    timestamp: r.timestamp,
    time: formatTime(r.timestamp),
    windSpeed: r.windSpeedKts,
    windGust: r.windGustKts,
    temperature: r.temperatureC || 0,
  }));

  // Check if all wind values are zero (sensor might be offline)
  const hasNonZeroWind = chartData.some(d => d.windSpeed > 0 || d.windGust > 0);

  // Check if data is old (last reading more than 2 hours ago)
  const lastReadingTime = chartData.length > 0
    ? new Date(chartData[chartData.length - 1].timestamp).getTime()
    : 0;
  const isDataOld = lastReadingTime > 0 && (Date.now() - lastReadingTime) > 2 * 60 * 60 * 1000;

  // Dark mode colors
  const isDark = theme === 'dark';
  const textColor = isDark ? '#e5e7eb' : '#374151';
  const gridColor = isDark ? '#374151' : '#e5e7eb';

  // Calcular zoom inicial para mostrar últimas 12h
  const calculateInitialZoom = () => {
    if (chartData.length === 0) return { start: 0, end: 100 };

    // 12 horas en milisegundos
    const twelveHours = 12 * 60 * 60 * 1000;
    const now = new Date(chartData[chartData.length - 1].timestamp).getTime();
    const cutoffTime = now - twelveHours;

    // Encontrar el índice del primer dato que está dentro de las últimas 12h
    let startIndex = 0;
    for (let i = chartData.length - 1; i >= 0; i--) {
      const dataTime = new Date(chartData[i].timestamp).getTime();
      if (dataTime < cutoffTime) {
        startIndex = i + 1; // El siguiente dato ya está dentro de las 12h
        break;
      }
    }

    // Convertir índice a porcentaje
    const startPercentage = (startIndex / chartData.length) * 100;

    return {
      start: Math.max(0, startPercentage),
      end: 100,
    };
  };

  const initialZoom = calculateInitialZoom();

  // Determinar qué gráficas mostrar
  const showWindChart = visibleLines.windSpeed || visibleLines.windGust;
  const showTempChart = true; // Siempre visible

  // Configuración común
  const commonConfig = {
    backgroundColor: 'transparent',
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category' as const,
      data: chartData.map(d => d.time),
      axisLine: {
        lineStyle: {
          color: gridColor,
        },
      },
      axisLabel: {
        color: textColor,
        fontSize: 11,
        rotate: 45,
        interval: function(index: number) {
          // Mostrar etiqueta cada ~30 minutos (asumiendo 1 lectura/minuto)
          // Ajustar según la cantidad de datos visibles
          return index % 15 === 0;
        },
        showMinLabel: true,
        showMaxLabel: true,
        hideOverlap: true, // Ocultar etiquetas que se solapen
        margin: 12, // Aumentar margen para mejor espaciado
      },
    },
    dataZoom: [
      {
        type: 'inside' as const,
        start: initialZoom.start,
        end: initialZoom.end,
        zoomOnMouseWheel: true,
        moveOnMouseMove: true,
      },
      {
        type: 'slider' as const,
        start: initialZoom.start,
        end: initialZoom.end,
        height: 24,
        bottom: 10,
        textStyle: {
          color: textColor,
          fontSize: 10,
        },
        borderColor: gridColor,
        fillerColor: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)',
        handleStyle: {
          color: '#3b82f6',
          borderWidth: 1,
        },
        dataBackground: {
          lineStyle: {
            color: gridColor,
          },
          areaStyle: {
            color: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
          },
        },
      },
    ],
  };

  // Gráfica de Viento
  const windOption: EChartsOption = {
    ...commonConfig,
    tooltip: {
      trigger: 'axis' as const,
      backgroundColor: isDark ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      borderColor: isDark ? '#4b5563' : '#e5e7eb',
      textStyle: {
        color: textColor,
      },
      formatter: (params: any) => {
        if (!params || params.length === 0) return '';
        const dataIndex = params[0].dataIndex;
        const data = chartData[dataIndex];

        let html = `<div style="padding: 4px;">`;
        html += `<div style="font-weight: 600; margin-bottom: 8px;">${data.time}</div>`;

        params.forEach((param: any) => {
          if (param.seriesName === t('graph.windSpeed')) {
            html += `<div style="color: #3b82f6;">● ${param.seriesName}: ${formatWindSpeed(param.value, 'kts')}</div>`;
          }
          if (param.seriesName === t('graph.windGust')) {
            html += `<div style="color: #ef4444;">● ${param.seriesName}: ${formatWindSpeed(param.value, 'kts')}</div>`;
          }
        });

        html += `</div>`;
        return html;
      },
    },
    yAxis: {
      type: 'value',
      name: 'Viento (kt)',
      nameTextStyle: {
        color: textColor,
        fontSize: 12,
      },
      axisLine: {
        lineStyle: {
          color: gridColor,
        },
      },
      axisLabel: {
        color: textColor,
        fontSize: 11,
        formatter: (value: number) => `${value} kt`,
      },
      splitLine: {
        lineStyle: {
          color: gridColor,
          opacity: 0.3,
        },
      },
    },
    series: [
      visibleLines.windSpeed && {
        name: t('graph.windSpeed'),
        type: 'line',
        data: chartData.map(d => d.windSpeed),
        smooth: true,
        symbol: 'circle',
        symbolSize: 4,
        lineStyle: {
          color: '#3b82f6',
          width: 2,
        },
        itemStyle: {
          color: '#3b82f6',
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
              { offset: 1, color: 'rgba(59, 130, 246, 0.05)' },
            ],
          },
        },
      },
      visibleLines.windGust && {
        name: t('graph.windGust'),
        type: 'line',
        data: chartData.map(d => d.windGust),
        smooth: true,
        symbol: 'circle',
        symbolSize: 4,
        lineStyle: {
          color: '#ef4444',
          width: 2,
        },
        itemStyle: {
          color: '#ef4444',
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(239, 68, 68, 0.3)' },
              { offset: 1, color: 'rgba(239, 68, 68, 0.05)' },
            ],
          },
        },
      },
    ].filter(Boolean) as any[],
  };

  // Gráfica de Temperatura
  const tempOption: EChartsOption = {
    ...commonConfig,
    tooltip: {
      trigger: 'axis' as const,
      backgroundColor: isDark ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      borderColor: isDark ? '#4b5563' : '#e5e7eb',
      textStyle: {
        color: textColor,
      },
      formatter: (params: any) => {
        if (!params || params.length === 0) return '';
        const dataIndex = params[0].dataIndex;
        const data = chartData[dataIndex];

        let html = `<div style="padding: 4px;">`;
        html += `<div style="font-weight: 600; margin-bottom: 8px;">${data.time}</div>`;
        html += `<div style="color: #10b981;">● ${t('graph.temperature')}: ${formatTemperature(data.temperature)}</div>`;
        html += `</div>`;
        return html;
      },
    },
    yAxis: {
      type: 'value',
      name: 'Temperatura (°C)',
      nameTextStyle: {
        color: textColor,
        fontSize: 12,
      },
      axisLine: {
        lineStyle: {
          color: gridColor,
        },
      },
      axisLabel: {
        color: textColor,
        fontSize: 11,
        formatter: (value: number) => `${value}°C`,
      },
      splitLine: {
        lineStyle: {
          color: gridColor,
          opacity: 0.3,
        },
      },
    },
    series: [
      {
        name: t('graph.temperature'),
        type: 'line',
        data: chartData.map(d => d.temperature),
        smooth: true,
        symbol: 'circle',
        symbolSize: 4,
        lineStyle: {
          color: '#10b981',
          width: 2,
        },
        itemStyle: {
          color: '#10b981',
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(16, 185, 129, 0.3)' },
              { offset: 1, color: 'rgba(16, 185, 129, 0.05)' },
            ],
          },
        },
      },
    ],
  };

  // Resize charts on theme change
  useEffect(() => {
    if (windChartRef.current) {
      windChartRef.current.getEchartsInstance().resize();
    }
    if (tempChartRef.current) {
      tempChartRef.current.getEchartsInstance().resize();
    }
  }, [theme]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('graph.title')}
          </h3>
          {chartData.length > 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {chartData.length} {t('graph.readings', 'lecturas')} disponibles • Usa el zoom para navegar
            </p>
          )}
        </div>

        {/* Legend toggles */}
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={visibleLines.windSpeed}
              onChange={(e) =>
                setVisibleLines({ ...visibleLines, windSpeed: e.target.checked })
              }
              className="mr-2 w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
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
              className="mr-2 w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {t('graph.windGust')}
            </span>
          </label>
        </div>

        {/* Warning if all values are zero */}
        {!hasNonZeroWind && (
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              ⚠️ Sensor de viento sin lecturas válidas. Todas las mediciones muestran 0 kt.
            </p>
          </div>
        )}

        {/* Warning if data is old */}
        {isDataOld && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              ℹ️ Mostrando últimos datos disponibles. La estación no ha enviado datos recientes.
            </p>
          </div>
        )}
      </div>

      {/* Wind Chart */}
      {showWindChart && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
            Datos de Viento
          </h4>
          <ReactECharts
            ref={windChartRef}
            option={windOption}
            style={{ height: '350px', width: '100%' }}
            opts={{ renderer: 'svg' }}
            notMerge={true}
            lazyUpdate={true}
          />
        </div>
      )}

      {/* Temperature Chart */}
      {showTempChart && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
            Datos de Temperatura
          </h4>
          <ReactECharts
            ref={tempChartRef}
            option={tempOption}
            style={{ height: '300px', width: '100%' }}
            opts={{ renderer: 'svg' }}
            notMerge={true}
            lazyUpdate={true}
          />
        </div>
      )}
    </div>
  );
}
