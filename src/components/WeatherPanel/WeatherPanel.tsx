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
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 h-full flex flex-col">
      {/* Badge de intensidad */}
      {/* <div className="flex justify-center mb-4">
        <div
          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide ${
            windIntensity === 'strong'
              ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
              : windIntensity === 'moderate'
                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                : 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300'
          }`}
        >
          {windIntensity === 'strong'
            ? 'Fuerte'
            : windIntensity === 'moderate'
              ? 'Moderado'
              : 'Suave'}
        </div>
      </div> */}

      {/* Layout paralelo: Brújula + Gauge */}
      <div className="grid grid-cols-2 gap-8 items-center">
        {/* Brújula */}
        <div className="flex justify-center items-center">
          <Compass directionDeg={directionDeg} windIntensity={windIntensity} />
        </div>

        {/* Speed gauge más grande */}
        <div className="flex justify-center items-center">
          <div className="w-full h-full flex items-center justify-center">
            <SpeedGauge speedAvgKts={speedAvgKts} gustKts={gustKts} />
          </div>
        </div>
      </div>

      {/* Tarjetas: Dirección y Velocidad */}
      <div className="grid grid-cols-2 gap-8 mt-3">
        {/* Dirección */}
        <DataCard
          label="Dirección"
          value={directionDeg}
          unit={getWindDirectionCardinal(directionDeg)}
          subtitle={getWindDirectionName(directionDeg)}
          color="primary"
        />

        {/* Velocidad */}
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
