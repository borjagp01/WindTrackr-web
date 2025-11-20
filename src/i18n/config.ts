import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  es: {
    translation: {
      // Navigation
      'nav.home': 'Inicio',
      'nav.map': 'Mapa',
      'nav.about': 'Acerca de',
      'nav.settings': 'Ajustes',
      'nav.theme': 'Tema',

      // Station Selector
      'station.select': 'Seleccionar estación',
      'station.search': 'Buscar estación...',

      // Station Info
      'station.status.online': 'En línea',
      'station.status.offline': 'Fuera de línea',
      'station.status.warning': 'Datos antiguos',
      'station.status.maintenance': 'Mantenimiento',
      'station.lastUpdate': 'Última actualización',
      'station.location': 'Ubicación',
      'station.elevation': 'Elevación',

      // Wind
      'wind.speed': 'Velocidad',
      'wind.gust': 'Racha',
      'wind.direction': 'Dirección',
      'wind.average': 'Media',
      'wind.compass': 'Brújula de Viento',

      // Weather
      'weather.temperature': 'Temperatura',
      'weather.humidity': 'Humedad',
      'weather.pressure': 'Presión',
      'weather.forecast': 'Pronóstico',

      // Time ranges
      'range.24h': 'Últimas 24h',
      'range.7d': 'Últimos 7d',

      // Graph
      'graph.title': 'Datos Históricos',
      'graph.windSpeed': 'Velocidad del viento',
      'graph.windGust': 'Rachas',
      'graph.temperature': 'Temperatura',

      // Map
      'map.title': 'Mapa de Estaciones',
      'map.viewStation': 'Ver estación',
      'map.centerOnLocation': 'Centrar en mi ubicación',

      // About
      'about.title': 'Acerca de WindTrackr',
      'about.description':
        'WindTrackr es un visor de estaciones meteorológicas especializado en datos de viento.',

      // Common
      'common.loading': 'Cargando...',
      'common.error': 'Error',
      'common.noData': 'No hay datos disponibles',
      'common.close': 'Cerrar',

      // Theme
      'theme.toggle': 'Cambiar tema',
      'theme.light': 'Modo claro',
      'theme.dark': 'Modo oscuro',
    },
  },
  // Future: English translations
  // en: {
  //   translation: { ... }
  // }
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'es',
  fallbackLng: 'es',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
