import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import type { Station } from '@/types';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in React Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Componente para manejar el scroll condicional
function MapScrollHandler({ onShowHint }: { onShowHint: () => void }) {
  const map = useMap();

  useEffect(() => {
    // Deshabilitar scroll wheel zoom por defecto
    map.scrollWheelZoom.disable();

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        // Permitir zoom con Ctrl/Cmd
        e.preventDefault();
        const delta = e.deltaY > 0 ? -1 : 1;
        map.setZoom(map.getZoom() + delta);
      } else {
        // Mostrar hint
        onShowHint();
      }
    };

    const container = map.getContainer();
    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [map, onShowHint]);

  return null;
}

interface StationMapProps {
  stations: Station[];
  selectedStation?: Station | null;
  onStationSelect?: (stationId: string) => void;
  height?: string;
}

export function StationMap({
  stations,
  selectedStation,
  onStationSelect,
  height = '400px',
}: StationMapProps) {
  const { t } = useTranslation();
  const [showScrollHint, setShowScrollHint] = useState(false);

  // Detectar el OS para mostrar el mensaje correcto
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const scrollHintText = isMac
    ? 'Usa ⌘ + scroll para hacer zoom'
    : 'Usa Ctrl + scroll para hacer zoom';

  const handleShowHint = () => {
    setShowScrollHint(true);
    setTimeout(() => setShowScrollHint(false), 2000);
  };

  // Calculate center based on selected station or all stations
  const center: [number, number] = selectedStation
    ? [selectedStation.location.lat, selectedStation.location.lon]
    : stations.length > 0
      ? [
          stations.reduce((sum, s) => sum + s.location.lat, 0) /
            stations.length,
          stations.reduce((sum, s) => sum + s.location.lon, 0) /
            stations.length,
        ]
      : [36.0153, -5.6108]; // Default to Tarifa

  const zoom = selectedStation ? 12 : 10;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden relative">
      {/* Hint overlay */}
      {showScrollHint && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] pointer-events-none">
          <div className="bg-gray-900/90 dark:bg-gray-800/90 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium backdrop-blur-sm">
            {scrollHintText}
          </div>
        </div>
      )}

      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height, width: '100%' }}
        className="z-0"
        scrollWheelZoom={false}
        doubleClickZoom={true}
      >
        <MapScrollHandler onShowHint={handleShowHint} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {stations.map((station) => (
          <Marker
            key={station.id}
            position={[station.location.lat, station.location.lon]}
          >
            <Popup>
              <div className="min-w-[200px] p-2">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  {station.name}
                </h3>
                {station.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {station.description}
                  </p>
                )}
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  <div>Lat: {station.location.lat.toFixed(4)}</div>
                  <div>Lon: {station.location.lon.toFixed(4)}</div>
                  {station.location.elevationM && (
                    <div>Alt: {station.location.elevationM}m</div>
                  )}
                </div>
                {onStationSelect && (
                  <button
                    onClick={() => onStationSelect(station.id)}
                    className="mt-2 w-full px-3 py-1 bg-primary-500 text-white text-sm rounded hover:bg-primary-600 transition-colors"
                  >
                    {t('map.viewStation')}
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
