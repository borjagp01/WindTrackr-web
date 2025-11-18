import { Compass } from '@/components/Compass';
import { SpeedGauge } from '@/components/SpeedGauge';
import { DataCard } from '@/components/DataCard';
import { getWindDirectionCardinal, getWindDirectionName } from '@/utils';

interface WeatherPanelProps {
  directionDeg: number;
  speedAvgKts: number;
  gustKts: number;
  temperatureC?: number;
  humidityPct?: number;
}

export function WeatherPanel({
  directionDeg,
  speedAvgKts,
  gustKts,
  temperatureC,
  humidityPct,
}: WeatherPanelProps) {
  const windIntensity =
    speedAvgKts > 20 ? 'strong' : speedAvgKts > 10 ? 'moderate' : 'light';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700 h-full flex flex-col">
      {/* Responsive layout: vertical en móvil portrait, horizontal en desktop */}
      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
        <div className="w-[230px] h-[170px] sm:w-[290px] sm:h-[230px] flex items-center mx-auto">
          <SpeedGauge speedAvgKts={speedAvgKts} gustKts={gustKts} />
        </div>
        <div className="w-[165px] h-[165px] mb-4 sm:w-[210px] sm:h-[210px] flex items-center mx-auto">
          <Compass directionDeg={directionDeg} windIntensity={windIntensity} />
        </div>
      </div>

      {/* Tarjetas: Dirección, Velocidad, Temperatura, Humedad */}
      <div className="grid grid-cols-2 gap-3 sm:gap-6 mt-3">
        <DataCard
          label="Dirección"
          value={directionDeg}
          unit={getWindDirectionCardinal(directionDeg)}
          subtitle={getWindDirectionName(directionDeg)}
          color="primary"
        />
        <DataCard label="Velocidad" value={gustKts} unit="kt" color="amber" />
        <DataCard
          label="Temperatura"
          value={temperatureC ?? 0}
          unit="°C"
          color="orange"
        />
        <DataCard
          label="Humedad"
          value={humidityPct ?? 0}
          unit="%"
          color="blue"
        />
      </div>
    </div>
  );
}
