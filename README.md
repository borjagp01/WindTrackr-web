# 🌬️ WindTrackr

**WindTrackr** es un visor de estaciones meteorológicas especializado en datos de viento, diseñado para entusiastas del windsurf, kitesurf, vela y cualquier actividad relacionada con el viento en la zona del Estrecho de Gibraltar.

![Version](https://img.shields.io/badge/version-0.2.0--firebase-blue)
![Phase](https://img.shields.io/badge/phase-1%20(Firebase%20DB)-green)

## ✨ Características

### Versión Actual (Fase 1 - Firebase Integration)

- ✅ **Visualización multi-estación**: Datos de 5 estaciones meteorológicas en la zona de Tarifa
- ✅ **Selector de estación**: Buscador con filtrado en tiempo real
- ✅ **Brújula de viento**: Dirección, velocidad media y rachas en tiempo real
- ✅ **Gráficas interactivas**: Series temporales de 24h y 7 días con Recharts
- ✅ **Pronóstico**: Previsión de viento y temperatura para las próximas 48 horas
- ✅ **Mapa interactivo**: Leaflet con OpenStreetMap mostrando todas las estaciones
- ✅ **Modo oscuro**: Toggle persistente con soporte de preferencias del sistema
- ✅ **Responsive design**: Optimizado para móvil, tablet y escritorio
- ✅ **i18n preparado**: Infraestructura react-i18next (actualmente en español)
- ✅ **Firebase Realtime Database**: Conexión a datos reales desde Arduino
- ✅ **DataSource abstraction**: Cambio transparente entre mock y Firebase

### Fase 0 (Completado)
- ✅ Proyecto base con Vite + React + TypeScript
- ✅ UI completa con 8 componentes
- ✅ Mock data para desarrollo
- ✅ Tests con Vitest
- ✅ Deploy a Firebase Hosting

## 🛠️ Stack Tecnológico

- **Vite** 5.x + **React** 19.x + **TypeScript** 5.x
- **Tailwind CSS** 4.x para estilos
- **Recharts** 3.x para gráficas
- **React Leaflet** 5.x para mapas
- **Zustand** 5.x para estado global
- **React Router** 7.x para navegación
- **Vitest** + **React Testing Library** para tests
- **Firebase Hosting** para deploy

## 🚀 Inicio Rápido

### 1. Instalación

```bash
npm install
```

### 2. Ejecutar en desarrollo

```bash
npm run dev
```

La app estará en `http://localhost:5173`

### 3. Build para producción

```bash
npm run build
```

### 4. Deploy a Firebase Hosting

```bash
# Primero, configura tu proyecto en .firebaserc
firebase deploy --only hosting
```

## 📜 Scripts Disponibles

```bash
npm run dev         # Desarrollo
npm run build       # Build producción
npm run preview     # Preview del build
npm run test        # Tests
npm run lint        # Linting
npm run format      # Formateo con Prettier
npm run inspect-firebase  # Inspeccionar estructura de Firebase DB
npm run seed-firebase     # Poblar Firebase con datos mock
```

## 📁 Estructura del Proyecto

```
src/
├── app/                 # App shell y router
├── components/          # Componentes UI
│   ├── BasicInfoTile/
│   ├── GraphViewer/
│   ├── NavBar/
│   ├── StationMap/
│   ├── StationSelector/
│   ├── ThemeToggle/
│   ├── WeatherForecast/
│   └── WindCompass/
├── data/
│   └── services/        # DataSource abstraction
│       ├── DataSource.ts
│       ├── MockDataSource.ts
│       └── FirebaseDataSource.stub.ts
├── features/
│   └── stations/        # Domain logic
├── i18n/                # Internacionalización
├── pages/               # Páginas de la app
├── theme/               # Sistema de temas
├── types/               # TypeScript types
└── utils/               # Utilidades
```

## 🔥 Firebase Integration (Fase 1)

### ⚡ Importante: Autenticación Anónima

**La app requiere autenticación para acceder a Firebase Realtime Database.**

La aplicación se autentica **automáticamente** usando Firebase Anonymous Auth cuando se carga. Para que esto funcione:

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **Authentication** > **Sign-in method**
4. **Habilita "Anonymous"** ✅

Si no está habilitado, verás el error "Permission denied" al intentar cargar datos.

**Cómo funciona:**
- Al abrir la app, se ejecuta automáticamente `signInAnonymously()`
- Firebase crea un usuario anónimo temporal
- Las peticiones a la base de datos ahora cumplen con `auth != null`
- Verás el estado de autenticación en el FirebaseDebugPanel (esquina inferior derecha en desarrollo)

📖 **Más detalles:** Ver `AUTENTICACION_RESUMEN.md`

### Configuración

1. **Variables de entorno**: Copia `.env.example` a `.env` y configura tus credenciales de Firebase:

```env
VITE_DATA_SOURCE=firebase

VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

2. **Inspeccionar la base de datos** (ver estructura de datos del Arduino):

```bash
npm run inspect-firebase
```

3. **Poblar con datos de prueba** (opcional, si la DB está vacía):

```bash
npm run seed-firebase
```

4. **Ejecutar la app**:

```bash
npm run dev
```

La app ahora lee datos desde Firebase Realtime Database. En modo desarrollo verás un panel de debug en la esquina inferior derecha mostrando el estado de la conexión.

### Switching entre Mock y Firebase

Para cambiar entre mock y Firebase, simplemente modifica `VITE_DATA_SOURCE` en `.env`:

```env
# Usar datos mock (sin conexión a Firebase)
VITE_DATA_SOURCE=mock

# Usar datos reales de Firebase
VITE_DATA_SOURCE=firebase
```

No necesitas cambiar ningún código - la abstracción `DataSource` se encarga de todo.

## 🔄 Migración desde Fase 0 (Mock) - COMPLETADO ✅

El proyecto usa una **abstracción de datos** que permite cambiar de mock a Firebase sin tocar la UI:

### Paso 1: Instalar Firebase

```bash
npm install firebase
```

### Paso 2: Implementar FirebaseDataSource

Completa `src/data/services/FirebaseDataSource.stub.ts`:

```typescript
import { ref, get } from 'firebase/database';
import { db } from '@/app/firebase';

export class FirebaseDataSource implements DataSource {
  async getStations() {
    const snapshot = await get(ref(db, 'stations'));
    return Object.values(snapshot.val() || {});
  }
  // ... implementar otros métodos
}
```

### Paso 3: Cambiar variable de entorno

En `.env`:

```env
VITE_DATA_SOURCE=firebase  # Cambiar de 'mock' a 'firebase'
```

**¡Listo!** La UI funciona igual pero con datos reales.

### Estructura de Datos Esperada en Firebase

```json
{
  "stations": {
    "station-id": {
      "id": "station-id",
      "name": "Nombre",
      "location": { "lat": 36.0, "lon": -5.6, "elevationM": 10 },
      "status": "online"
    }
  },
  "readings": {
    "station-id": {
      "timestamp-iso": {
        "timestamp": "2024-01-15T10:00:00Z",
        "windSpeedKts": 18.5,
        "windGustKts": 25.2,
        "windDirectionDeg": 90,
        "temperatureC": 19.5,
        "humidityPct": 70,
        "pressureHPa": 1013
      }
    }
  },
  "forecasts": {
    "station-id": {
      "hourly": [
        {
          "timestamp": "2024-01-15T11:00:00Z",
          "windKts": 20,
          "gustKts": 28,
          "directionDeg": 90,
          "tempC": 20
        }
      ]
    }
  }
}
```

## 🏗️ Arquitectura de Datos

### Patrón Repository

```typescript
// Interface abstracta
interface DataSource {
  getStations(): Promise<Station[]>;
  getStation(id: string): Promise<Station>;
  getReadings(id: string, range: '24h'|'7d'): Promise<Reading[]>;
  getForecast(id: string): Promise<Forecast>;
}

// Factory pattern
function getDataSource() {
  const source = import.meta.env.VITE_DATA_SOURCE;
  return source === 'firebase'
    ? new FirebaseDataSource()
    : new MockDataSource();
}
```

### Uso en Componentes

```typescript
const dataSource = getDataSource();

export function useStations() {
  useEffect(() => {
    dataSource.getStations().then(setStations);
  }, []);
}
```

## 🧪 Testing

```bash
npm run test        # Ejecutar tests
npm run test:watch  # Watch mode
```

Tests incluidos:
- ✅ Utilidades de formateo de unidades y fechas
- ✅ Componentes básicos
- 🔜 Integración de componentes (próximamente)

## 🗺️ Roadmap

### Fase 0: Mock Data & UI (✅ COMPLETADO)

- ✅ Proyecto base con Vite + React + TypeScript
- ✅ UI completa con 8 componentes reutilizables
- ✅ Mock data para desarrollo
- ✅ Tests con Vitest + React Testing Library
- ✅ Deploy a Firebase Hosting

### Fase 1: Firebase Integration (🔄 EN PROGRESO)

- ✅ Firebase Realtime Database conectado
- ✅ FirebaseDataSource implementado
- ✅ Scripts de inspección y seed
- ✅ Panel de debug para desarrollo
- ⏳ Firebase Auth (Google + Email/Password)
- ⏳ Real-time subscriptions con onValue()
- ⏳ Rutas protegidas
- ⏳ Testing con datos reales del Arduino

### Fase 2: Features Avanzadas

- [ ] PWA con offline support
- [ ] Notificaciones push para alertas de viento
- [ ] Comparativa entre estaciones
- [ ] Exportación de datos (CSV/JSON)
- [ ] Históricos más extensos

### Fase 3: Optimización

- [ ] Analytics con Firebase Analytics
- [ ] SEO optimizado
- [ ] Code splitting avanzado
- [ ] Performance monitoring

## 📄 Configuración de Firebase Hosting

El archivo `firebase.json` ya está configurado:

```json
{
  "hosting": {
    "public": "dist",
    "rewrites": [{ "source": "**", "destination": "/index.html" }],
    "headers": [ /* Cache optimization */ ]
  }
}
```

Para deploy:

```bash
# 1. Build
npm run build

# 2. Deploy
firebase deploy --only hosting

# O deploy a canal de preview
firebase hosting:channel:deploy preview
```

## 🎨 Modo Oscuro

Implementado con Tailwind CSS y persistencia en localStorage:

- Toggle en la barra de navegación
- Respeta `prefers-color-scheme`
- Persiste la preferencia del usuario

## 🌍 Internacionalización

Preparado con react-i18next:

```typescript
// Actualmente solo español
const { t } = useTranslation();
t('nav.home'); // "Inicio"

// Para añadir inglés, editar src/i18n/config.ts
```

## 🔐 Variables de Entorno

Crear `.env` basándote en `.env.example`:

```env
VITE_DATA_SOURCE=mock

# Futuro: Firebase config
# VITE_FIREBASE_API_KEY=...
# VITE_FIREBASE_PROJECT_ID=...
```

## 🤝 Contribución

1. Fork del repo
2. Crea rama: `git checkout -b feature/nueva-feature`
3. Commit: `git commit -m 'feat: descripción'`
4. Push: `git push origin feature/nueva-feature`
5. Abre Pull Request

## 📝 Notas Importantes

### Estado Actual (Fase 0)

- ⚠️ **Datos Mock**: Los datos son simulados y no reflejan condiciones reales
- ⚠️ **Sin Backend**: Todo corre en el cliente
- ⚠️ **No hay autenticación**: Acceso público total

### Preparado para Futuro

- ✅ Abstracción de datos lista para Firebase
- ✅ Arquitectura escalable
- ✅ TypeScript estricto
- ✅ Testing infrastructure
- ✅ i18n preparado

## 📧 Contacto

Para preguntas o sugerencias, abre un issue en GitHub.

---

**WindTrackr** - _Porque el viento no espera_ 🌬️
