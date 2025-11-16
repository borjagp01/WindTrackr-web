import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useTranslation } from 'react-i18next';
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

  // Calculate center based on selected station or all stations
  const center: [number, number] = selectedStation
    ? [selectedStation.location.lat, selectedStation.location.lon]
    : stations.length > 0
    ? [
        stations.reduce((sum, s) => sum + s.location.lat, 0) / stations.length,
        stations.reduce((sum, s) => sum + s.location.lon, 0) / stations.length,
      ]
    : [36.0153, -5.6108]; // Default to Tarifa

  const zoom = selectedStation ? 12 : 10;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height, width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {stations.map((station) => (
          <Marker
            key={station.id}
            position={[station.location.lat, station.location.lon]}
            eventHandlers={{
              click: () => onStationSelect?.(station.id),
            }}
          >
            <Popup>
              <div className="min-w-[200px]">
                <h3 className="font-semibold text-gray-900 mb-1">{station.name}</h3>
                {station.description && (
                  <p className="text-sm text-gray-600 mb-2">{station.description}</p>
                )}
                <div className="text-xs text-gray-500">
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
