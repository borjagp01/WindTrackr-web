import { useTranslation } from 'react-i18next';

export function About() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
        {t('about.title')}
      </h1>

      <div className="prose dark:prose-invert max-w-none">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            ¿Qué es WindTrackr?
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {t('about.description')} WindTrackr proporciona datos en tiempo casi real de
            múltiples estaciones meteorológicas, con especial énfasis en velocidad del viento,
            ráfagas y dirección.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            Esta aplicación está diseñada para entusiastas del windsurf, kitesurf, vela y
            cualquier actividad relacionada con el viento en la zona del Estrecho de Gibraltar.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Características
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Visualización de datos de múltiples estaciones meteorológicas</li>
            <li>Gráficas de series temporales (24 horas y 7 días)</li>
            <li>Brújula de viento con dirección, velocidad media y rachas</li>
            <li>Pronóstico del tiempo para las próximas 48 horas</li>
            <li>Mapa interactivo con ubicación de todas las estaciones</li>
            <li>Modo oscuro para mejor visualización en condiciones de baja luz</li>
            <li>Diseño responsive adaptado a móviles y tablets</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Estado del Proyecto
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            <strong>Fase Actual:</strong> Versión Mock (Fase 0)
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Esta versión utiliza datos simulados (mock) para demostrar la funcionalidad de la
            aplicación. Los datos que ves son generados localmente y no reflejan condiciones
            meteorológicas reales.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <strong>Próximas fases:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 mt-2">
            <li>Integración con Firebase Realtime Database para datos reales</li>
            <li>Autenticación de usuarios con Firebase Auth</li>
            <li>Panel de administración para gestión de estaciones</li>
            <li>Notificaciones push para alertas de viento</li>
            <li>Soporte PWA para uso offline</li>
            <li>Internacionalización completa (ES/EN)</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Tecnologías
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-gray-700 dark:text-gray-300">
            <div>
              <strong>Frontend:</strong>
              <ul className="text-sm mt-1">
                <li>React 19</li>
                <li>TypeScript</li>
                <li>Vite</li>
              </ul>
            </div>
            <div>
              <strong>UI/UX:</strong>
              <ul className="text-sm mt-1">
                <li>Tailwind CSS</li>
                <li>Recharts</li>
                <li>React Leaflet</li>
              </ul>
            </div>
            <div>
              <strong>Estado:</strong>
              <ul className="text-sm mt-1">
                <li>Zustand</li>
                <li>React Router</li>
              </ul>
            </div>
            <div>
              <strong>i18n:</strong>
              <ul className="text-sm mt-1">
                <li>react-i18next</li>
              </ul>
            </div>
            <div>
              <strong>Testing:</strong>
              <ul className="text-sm mt-1">
                <li>Vitest</li>
                <li>Testing Library</li>
              </ul>
            </div>
            <div>
              <strong>Deploy:</strong>
              <ul className="text-sm mt-1">
                <li>Firebase Hosting</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
