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

// Handler to fit bounds to active stations when the map is used as an overview
function FitBoundsHandler({
  stations,
  selectedStation,
}: {
  stations: Station[];
  selectedStation?: Station | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // If a specific station is selected, center on it and keep the previous behavior
    if (selectedStation) {
      map.setView(
        [selectedStation.location.lat, selectedStation.location.lon],
        12
      );
      return;
    }

    // Fit to ALL provided stations (used on the /map overview)
    const validStations = stations.filter(
      (s) =>
        s.location &&
        typeof s.location.lat === 'number' &&
        typeof s.location.lon === 'number'
    );

    if (validStations.length === 0) {
      return;
    }

    if (validStations.length === 1) {
      const s = validStations[0];
      map.setView([s.location.lat, s.location.lon], 12);
      return;
    }

    const latlngs = validStations.map(
      (s) => [s.location.lat, s.location.lon] as [number, number]
    );
    const bounds = L.latLngBounds(latlngs);
    // Fit bounds with a bit of padding
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [map, stations, selectedStation]);

  return null;
}

interface StationMapProps {
  stations: Station[];
  selectedStation?: Station | null;
  onStationSelect?: (stationId: string) => void;
  height?: string;
  fitToActive?: boolean;
}

export function StationMap({
  stations,
  selectedStation,
  onStationSelect,
  height = '400px',
  fitToActive = false,
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
        {/* Adjust map bounds to active stations when requested */}
        {fitToActive && (
          <FitBoundsHandler
            stations={stations}
            selectedStation={selectedStation}
          />
        )}
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
              <div className="group relative text-left p-4 overflow-hidden min-w-[250px]">
                {/* Content */}
                <div className="relative">
                  {/* Header with status badge */}
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {station.name}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        station.status === 'online'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : station.status === 'offline'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}
                    >
                      {t(`station.status.${station.status}`)}
                    </span>
                  </div>

                  {/* Description */}
                  {station.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {station.description}
                    </p>
                  )}

                  {/* Location info */}
                  <div className="space-y-2">
                    <div className="flex items-center text-xs text-gray-400 dark:text-gray-500">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                        />
                      </svg>
                      <span>
                        {station.location.lat.toFixed(4)},{' '}
                        {station.location.lon.toFixed(4)}
                      </span>
                    </div>
                    {station.location.elevationM && (
                      <div className="text-xs text-gray-400 dark:text-gray-500">
                        Alt: {station.location.elevationM}m
                      </div>
                    )}
                  </div>

                  {/* Button */}
                  {onStationSelect && (
                    <button
                      onClick={() => onStationSelect(station.id)}
                      className="mt-4 w-full px-3 py-2 bg-primary-500 text-white text-sm rounded hover:bg-primary-600 transition-colors"
                    >
                      {t('map.viewStation')}
                    </button>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
