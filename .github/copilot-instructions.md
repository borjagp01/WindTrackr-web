# 🌬️ GitHub Copilot Instructions - WindTrackr

> **Versión**: 0.3.0-realtime | **Estado**: Production Ready ✅

## 🎯 Proyecto

**WindTrackr** - SPA React para visualización de datos meteorológicos en tiempo real desde estaciones Arduino. Especializada en datos de viento para deportes náuticos (windsurf, kitesurf) en el Estrecho de Gibraltar.

## 📚 Stack Tecnológico

### Core Stack

- **Vite 7.x** - Build tool ultrarrápido (esbuild)
- **React 19.x** - UI library con hooks
- **TypeScript 5.9** - Strict mode habilitado
- **Tailwind CSS 4.x** - Utility-first styling + dark mode

### State Management & Routing

- **Zustand** - Global state (~1KB, con persist middleware)
- **React Router 7.x** - Client-side routing (no SSR)

### Backend & Real-time Data

- **Firebase Realtime Database** - Real-time data con WebSockets
- **Firebase Anonymous Auth** - Auto sign-in transparente
- **Firebase Hosting** - Static SPA hosting con CDN global

### UI & Visualization

- **Recharts 3.x** - SVG charts (React-native components)
- **React Leaflet** - Mapas interactivos (OpenStreetMap)
- **react-i18next** - i18n ready (actualmente solo español)

### Development & Testing

- **Vitest** - Unit testing (Vite-native, más rápido que Jest)
- **React Testing Library** - Component testing
- **ESLint 9.x** + **Prettier** - Linting y formatting

---

## 🏗️ Arquitectura & Patrones Clave

### 1. Repository Pattern (Data Layer Abstraction)

**Patrón implementado** para desacoplar UI de la fuente de datos:

```typescript
// Interface única (src/data/services/DataSource.ts)
interface DataSource {
  // One-time fetch (legacy)
  getStations(): Promise<Station[]>;
  getStation(id: string): Promise<Station>;
  getReadings(id: string, range: ReadingRange): Promise<Reading[]>;
  getForecast(id: string): Promise<Forecast>;

  // Real-time subscriptions (Fase 2.1) ✨
  subscribeToStations(
    onUpdate: (stations: Station[]) => void,
    onError?: (error: Error) => void
  ): () => void; // Retorna cleanup function

  subscribeToStation(id: string, onUpdate, onError?): () => void;
  subscribeToReadings(id: string, range, onUpdate, onError?): () => void;
}

// Factory pattern para seleccionar implementación
export function getDataSource(): DataSource {
  return import.meta.env.VITE_DATA_SOURCE === 'firebase'
    ? new FirebaseDataSource()
    : new MockDataSource();
}
```

**Implementaciones**:

- `FirebaseDataSource` - Producción con Firebase Realtime DB
- `MockDataSource` - Desarrollo con JSON estáticos en `/public/mock/`

**Beneficios**:

- ✅ Cambio transparente entre mock y Firebase (solo variable `.env`)
- ✅ UI completamente desacoplada de la fuente de datos
- ✅ Fácil testing (mockear interface)
- ✅ Preparado para añadir más sources (APIs externas, cache, etc.)

### 2. Real-time Subscriptions Pattern (Firebase `onValue`)

**CRÍTICO**: Para datos que cambian frecuentemente, SIEMPRE usar subscripciones real-time.

```typescript
// ❌ MAL - Fetch one-time (no se actualiza automáticamente)
const snapshot = await get(ref(db, 'weather_stations'));
setStations(snapshot.val());

// ✅ BIEN - Subscription real-time (se actualiza automáticamente)
const dbRef = ref(db, 'weather_stations');
const unsubscribe = onValue(dbRef, (snapshot) => {
  setStations(snapshot.val());
});

// ⚠️ CRÍTICO: Cleanup en useEffect
useEffect(() => {
  const dbRef = ref(db, 'weather_stations');
  const unsubscribe = onValue(dbRef, callback);

  return () => unsubscribe(); // SIEMPRE cleanup
}, [dependencies]);
```

**Patrón de Custom Hooks Real-time** (ver `src/features/stations/hooks.ts`):

```typescript
export function useStationsRealtime() {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);

    const unsubscribe = dataSource.subscribeToStations(
      (updatedStations) => {
        setStations(updatedStations);
        setLoading(false);
      },
      (err) => setError(err)
    );

    // Cleanup automático al desmontar o cambiar deps
    return () => {
      console.log('🧹 Cleaning up subscription');
      unsubscribe();
    };
  }, []); // ⚠️ Deps correctas según el caso

  return { stations, loading, error };
}
```

**Reglas obligatorias**:

1. ✅ Usar `onValue()` para datos que cambian (stations, readings)
2. ✅ Usar `get()` solo para datos estáticos (forecast)
3. ✅ SIEMPRE retornar cleanup function desde DataSource
4. ✅ SIEMPRE usar cleanup en `useEffect`
5. ✅ Re-suscribirse cuando cambien parámetros (range, id, etc.)

### 3. Component Pattern (Functional + Named Exports)

**Convención estricta del proyecto**:

```typescript
// ✅ CORRECTO - Named export con function keyword
export function StationSelector({ stations, onSelect }: Props) {
  // Lógica del componente
  return <div>...</div>;
}

// ❌ INCORRECTO - Default export
export default function StationSelector() { }

// ❌ INCORRECTO - Arrow function const
export const StationSelector = () => { }
```

**Estructura de archivos de componentes**:

```
src/components/
  ComponentName/
    ComponentName.tsx    # Componente principal
    index.ts             # Re-export: export { ComponentName } from './ComponentName';
```

**Import desde otros archivos**:

```typescript
// ✅ Desde barrel export
import { StationSelector } from '@/components';

// ✅ Específico si es necesario
import { StationSelector } from '@/components/StationSelector';
```

### 4. TypeScript Strict Patterns

**tsconfig.json actual**:

```json
{
  "strict": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "noFallthroughCasesInSwitch": true
}
```

**Reglas de tipado**:

```typescript
// ❌ NUNCA usar 'any' (excepto casos muy justificados)
const data: any = fetchData();

// ✅ Usar tipos explícitos
const data: Station[] = fetchData();

// ✅ Usar tipos genéricos
function transform<T>(data: T): T {}

// ⚠️ 'as any' solo permitido en FirebaseDataSource
// para snapshot.val() (Firebase no tiene tipos)
const data = snapshot.val() as any; // SOLO en DataSource
const info = data.info || {}; // Luego validar
```

**Interfaces vs Types**:

```typescript
// ✅ Interfaces para tipos de dominio
export interface Station {
  id: string;
  name: string;
  location: Location;
}

// ✅ Types para unions y helpers
export type ReadingRange = '24h' | '7d';
export type Theme = 'light' | 'dark';
```

### 5. Tailwind CSS Patterns

**Modo oscuro con class strategy**:

```tsx
// ✅ CORRECTO - dark: prefix para modo oscuro
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">

// ❌ EVITAR - CSS custom (usar Tailwind utilities)
<div style={{ backgroundColor: isDark ? '#000' : '#fff' }}>
```

**Responsive design**:

```tsx
// Mobile-first approach
<div className="
  w-full
  sm:w-1/2
  lg:w-1/3
  xl:w-1/4
">
```

**Convenciones de spacing**:

- Padding/margin: Múltiplos de 4 (`p-4`, `m-6`, etc.)
- Gap en grids: `gap-4`, `gap-6`
- Rounded corners: `rounded-lg` (por defecto)

### 6. Zustand Store Pattern (con Persist)

**Patrón implementado** (ver `src/theme/theme.ts`):

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        set({ theme: newTheme });
        applyTheme(newTheme); // Side effect
      },
    }),
    {
      name: 'windtrackr-theme', // localStorage key
      onRehydrateStorage: () => (state) => {
        if (state) applyTheme(state.theme);
      },
    }
  )
);
```

**Uso en componentes**:

```typescript
const { theme, toggleTheme } = useThemeStore();
```

---

## 🔥 Firebase: Estructura de Datos & Reglas

### Formato Arduino V1 (Estructura Actual)

**Path principal**: `/weather_stations/{station_id}/`

```json
{
  "weather_stations": {
    "V1_STATION_TEST": {
      "info": {
        "name": "Estación Test",
        "latitude": 36.0151,
        "longitude": -5.6036,
        "altitude": 10,
        "country": "España",
        "province": "Cádiz",
        "station_type": "Automatic",
        "operation_mode": "auto",
        "version": "0.0.8.5"
      },
      "current": {
        // Última lectura (snapshot rápido)
      },
      "history": {  // ⚠️ Path PRINCIPAL (no 'readings')
        "1731670346": {
          "datetime": "2025-11-15 10:25:46",  // Formato Arduino
          "timestamp": 1731670346,             // Unix timestamp (segundos)
          "temperature": 18.5,
          "humidity": 65,
          "temp_hum_read_ok": true,
          "wind": {
            "speed_ms": 5.2,
            "speed_kmh": 18.72,
            "speed_knots": 10.1,
            "speed_read_ok": true,
            "direction": 270,
            "directionCardinal": "W",
            "direction_read_ok": true
          }
        }
      },
      "forecast": {
        "stationId": "V1_STATION_TEST",
        "hourly": [...]
      }
    }
  }
}
```

### Manejo Inteligente de Datos (Implementado)

**1. Fallback de Paths** (retrocompatibilidad):

```typescript
// Intenta 'history' primero (V1), luego 'readings' (deprecated)
let dbRef = ref(db, `weather_stations/${id}/history`);
let snapshot = await get(dbRef);

if (!snapshot.exists()) {
  dbRef = ref(db, `weather_stations/${id}/readings`); // Fallback
  snapshot = await get(dbRef);
}
```

**2. Parsing de Timestamps** (múltiples formatos):

```typescript
// Soporta:
// - Unix timestamp (number): 1731670346
// - String Arduino: "2025-11-15 10:25:46"
// - ISO String: "2025-11-15T10:25:46Z"

private parseTimestamp(timestamp: any): number {
  if (typeof timestamp === 'number') return timestamp;
  if (typeof timestamp === 'string') {
    const isoString = timestamp.includes('T')
      ? timestamp
      : timestamp.replace(' ', 'T'); // Arduino fix
    return Math.floor(Date.parse(isoString) / 1000);
  }
  return Math.floor(Date.now() / 1000);
}
```

**3. Filtrado por Tiempo con Fallback**:

```typescript
// Intenta filtrar por rango (24h/7d)
const cutoffTime = now - timeRangeMs;
let filteredReadings = allReadings.filter((r) => r.timestamp >= cutoffTime);

// Si NO hay datos en el rango (estación offline), mostrar últimos disponibles
if (filteredReadings.length === 0 && allReadings.length > 0) {
  console.log('⚠️ No readings in range, showing most recent');
  const limit = range === '24h' ? 500 : 1000;
  filteredReadings = allReadings.slice(0, limit);
}
```

**4. Detección de Estado de Estación**:

```typescript
// Si última lectura > 5 minutos → offline
const lastReadingTime = readings[readings.length - 1]?.timestamp;
const isDataStale =
  Date.now() - new Date(lastReadingTime).getTime() > 5 * 60 * 1000;
const status = isDataStale ? 'offline' : 'online';
```

**5. Validación de Sensores**:

```typescript
// Alertar si sensores reportan valor 0 (defectuoso/offline)
const hasNonZeroWind = readings.some((r) => r.windSpeedKts > 0);
if (!hasNonZeroWind) {
  console.warn('⚠️ Sensor de viento sin lecturas válidas');
}
```

### Firebase Security Rules (Configuradas)

```json
{
  "rules": {
    "weather_stations": {
      ".read": "auth != null", // ⚠️ Requiere Anonymous Auth
      "$stationId": {
        ".read": "auth != null",
        ".write": "auth != null"
      }
    }
  }
}
```

**CRÍTICO**: Anonymous Auth debe estar habilitado en Firebase Console.

### Firebase Anonymous Auth (Automático)

**Implementación** (ver `src/app/useFirebaseAuth.ts`):

```typescript
export function useFirebaseAuth() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // Auto sign-in si no hay usuario
        signInAnonymously(auth)
          .then(() => console.log('🔐 Firebase: User authenticated'))
          .catch((err) => console.error('Auth error:', err));
      }
    });

    return () => unsubscribe();
  }, []);
}
```

**Características**:

- ✅ Sign-in automático al cargar la app
- ✅ Sin formularios de login
- ✅ Cumple Firebase Security Rules
- ✅ Preparado para migrar a Google/Email auth (Fase 2.2)

---

## 📝 Convenciones de Código (OBLIGATORIAS)

### TypeScript Strict

**Configuración activa**:

```json
{
  "strict": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "noFallthroughCasesInSwitch": true,
  "verbatimModuleSyntax": true
}
```

**Reglas**:

1. ❌ **PROHIBIDO** usar `any` (excepto `FirebaseDataSource` con `snapshot.val()`)
2. ✅ **OBLIGATORIO** tipos explícitos en parámetros y returns
3. ✅ **OBLIGATORIO** usar interfaces para tipos de dominio
4. ✅ **OBLIGATORIO** usar types para unions/helpers

```typescript
// ❌ MAL
function fetchData(): any { ... }
const data = response as any;

// ✅ BIEN
function fetchData(): Station[] { ... }
const data = snapshot.val() as StationData; // Solo en DataSource

// ✅ Interfaces para dominio
export interface Station {
  id: string;
  name: string;
  location: Location;
}

// ✅ Types para unions
export type ReadingRange = '24h' | '7d';
export type StationStatus = 'online' | 'offline';
```

### React Components

**OBLIGATORIO - Named exports con function keyword**:

```typescript
// ✅ CORRECTO
export function StationSelector({ stations, onSelect }: Props) {
  return <div>...</div>;
}

// ❌ PROHIBIDO - Default export
export default function StationSelector() { }

// ❌ PROHIBIDO - Arrow function
export const StationSelector = ({ stations }: Props) => { }
```

**Estructura de archivos**:

```
src/components/
  StationSelector/
    StationSelector.tsx    // export function StationSelector
    index.ts               // export { StationSelector } from './StationSelector';
```

**Imports**:

```typescript
// ✅ PREFERIDO - Desde barrel export
import { StationSelector, WindCompass } from '@/components';

// ✅ ALTERNATIVO - Específico
import { StationSelector } from '@/components/StationSelector';

// ❌ PROHIBIDO - Default import
import StationSelector from '@/components/StationSelector';
```

### Custom Hooks

**Naming**:

- ✅ Prefijo `use` + nombre descriptivo
- ✅ camelCase
- ✅ Ubicación: `src/features/{domain}/hooks.ts`

**Pattern**:

```typescript
export function useStationsRealtime() {
  const [data, setData] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Lógica de subscription
    const unsubscribe = dataSource.subscribeToStations(
      (stations) => {
        setData(stations);
        setLoading(false);
      },
      (err) => setError(err)
    );

    // ⚠️ CRÍTICO: Cleanup obligatorio
    return () => {
      console.log('🧹 Cleaning up');
      unsubscribe();
    };
  }, []); // Dependencies apropiadas

  return { data, loading, error }; // ✅ Destructuring-friendly
}
```

### Tailwind CSS

**OBLIGATORIO - Utility classes, NO CSS custom**:

```tsx
// ✅ CORRECTO
<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Title</h2>
</div>

// ❌ PROHIBIDO - Inline styles
<div style={{ backgroundColor: '#fff', padding: '24px' }}>

// ❌ PROHIBIDO - CSS custom classes
<div className="custom-card">
```

**Dark mode**:

- ✅ Prefijo `dark:` para todos los colores
- ✅ Testar ambos modos siempre
- ✅ Usar `useThemeStore()` si necesitas acceso al tema

**Responsive**:

```tsx
// ✅ Mobile-first
<div className="
  grid
  grid-cols-1          /* Mobile */
  sm:grid-cols-2       /* Tablet */
  lg:grid-cols-3       /* Desktop */
  gap-4
">
```

### Naming Conventions

| Tipo                 | Convención        | Ejemplos                                  |
| -------------------- | ----------------- | ----------------------------------------- |
| **Componentes**      | PascalCase        | `StationSelector.tsx`, `WindCompass.tsx`  |
| **Hooks**            | camelCase + `use` | `useStationsRealtime.ts`                  |
| **Utils**            | camelCase         | `formatWindSpeed.ts`, `parseTimestamp.ts` |
| **Types/Interfaces** | PascalCase        | `Station`, `Reading`, `ReadingRange`      |
| **Constants**        | UPPER_SNAKE_CASE  | `MAX_READINGS`, `DEFAULT_RANGE`           |
| **Variables**        | camelCase         | `stationId`, `lastReading`                |

### Path Aliases

**OBLIGATORIO - Usar `@/` para imports internos**:

```typescript
// ✅ CORRECTO
import { Station } from '@/types';
import { useStationsRealtime } from '@/features/stations/hooks';
import { formatWindSpeed } from '@/utils';
import { WindCompass } from '@/components';

// ❌ PROHIBIDO - Relative paths
import { Station } from '../../../types';
import { useStationsRealtime } from '../../features/stations/hooks';
```

**Configuración** (ya hecho en `tsconfig.app.json`):

```json
{
  "baseUrl": ".",
  "paths": {
    "@/*": ["./src/*"]
  }
}
```

---

## 🚨 Reglas Específicas del Proyecto (CRÍTICAS)

### 🔥 Firebase Real-time

**OBLIGATORIO**:

1. ✅ Usar `onValue()` para datos que cambian (stations, readings)
2. ✅ Usar `get()` SOLO para datos estáticos (forecast)
3. ✅ SIEMPRE retornar cleanup function desde DataSource methods
4. ✅ SIEMPRE cleanup en `useEffect` return
5. ✅ Re-suscribirse cuando cambien parámetros (id, range, etc.)

```typescript
// ❌ MAL - Fetch manual sin auto-update
useEffect(() => {
  const fetchData = async () => {
    const data = await dataSource.getStations();
    setStations(data);
  };
  fetchData();
}, []);

// ✅ BIEN - Real-time subscription
useEffect(() => {
  const unsubscribe = dataSource.subscribeToStations(
    (stations) => setStations(stations),
    (error) => setError(error)
  );

  return () => unsubscribe(); // CRÍTICO
}, []);
```

**Variables de entorno**:

- ✅ TODAS las variables Firebase con prefijo `VITE_FIREBASE_*`
- ✅ `VITE_DATA_SOURCE`: `'firebase'` o `'mock'`
- ❌ NUNCA commitear `.env` (usar `.env.example`)

### ⚡ Performance

**Límites de datos**:

```typescript
// ✅ Limitar readings para Recharts
const limit = range === '24h' ? 500 : 1000;
const limitedReadings = readings.slice(0, limit);
```

**Lazy loading**:

```typescript
// ✅ Páginas con React.lazy
const Home = lazy(() => import('@/pages/Home'));
const Station = lazy(() => import('@/pages/Station'));
```

**Memoización**:

- ⚠️ Usar `useMemo`/`useCallback` SOLO si hay problema real
- ⚠️ NO optimizar prematuramente
- ✅ Medir primero con React DevTools Profiler

### 🧪 Testing

**Obligatorio para**:

- ✅ Funciones de utilidad (`src/utils/`)
- ✅ Lógica de negocio compleja
- ✅ Hooks personalizados (si tienen lógica)

**NO obligatorio para**:

- ⚠️ Componentes de UI simples (presentational)
- ⚠️ Páginas (a menos que tengan lógica compleja)

```typescript
// Ejemplo: src/utils/__tests__/formatWindSpeed.test.ts
import { describe, it, expect } from 'vitest';
import { formatWindSpeed } from '../units';

describe('formatWindSpeed', () => {
  it('should format knots correctly', () => {
    expect(formatWindSpeed(10, 'kts')).toBe('10 kt');
  });
});
```

### 📝 Commits

**OBLIGATORIO - Conventional Commits**:

```bash
# Nuevas características
git commit -m "feat: add real-time wind compass"
git commit -m "feat(stations): add offline detection"

# Correcciones
git commit -m "fix: prevent memory leak in useReadingsRealtime"
git commit -m "fix(firebase): handle missing history path"

# Documentación
git commit -m "docs: update Firebase setup guide"

# Refactorización
git commit -m "refactor: extract timestamp parsing to utility"

# Tests
git commit -m "test: add unit tests for date utils"

# Tareas de mantenimiento
git commit -m "chore: update dependencies"
git commit -m "chore: configure ESLint rules"
```

**Prefijos válidos**: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `style`, `perf`

---

## ✨ Features Clave Implementadas

### Real-time Updates (Fase 2.1) ✅

- Subscripciones con `onValue()` en todos los hooks
- Re-suscripción automática al cambiar filtros
- Cleanup automático para prevenir memory leaks
- Latencia < 1 segundo verificada

### UI Components ✅

- `BasicInfoTile` - Info + estado estación (online/offline)
- `WindCompass` - Brújula SVG con dirección, velocidad y rachas
- `GraphViewer` - Gráficas Recharts 24h/7d con scroll
- `StationSelector` - Selector con búsqueda en tiempo real
- `WeatherForecast` - Pronóstico 48h con temperatura y viento
- `StationMap` - Leaflet con markers y popup
- `ThemeToggle` - Dark mode con persistencia localStorage
- `FirebaseDebugPanel` - Panel de debug (solo desarrollo)

### Manejo Inteligente ✅

- Filtrado por tiempo con fallback a datos disponibles
- Detección de estado offline (>5 min)
- Alertas de sensores con valor 0
- Parsing timestamps Arduino
- Conversion entre unidades (km/h ↔ knots ↔ m/s)

---

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Vite dev server (http://localhost:5173)
npm run build            # Build producción
npm run preview          # Preview build local

# Testing & Quality
npm run test             # Tests (Vitest)
npm run test:watch       # Tests en watch mode
npm run lint             # ESLint
npm run format           # Prettier

# Firebase Utils
npm run inspect-firebase # Inspeccionar estructura Firebase DB
npm run seed-firebase    # Poblar Firebase con datos mock

# Deploy
npm run deploy           # Build + deploy a Firebase Hosting
npm run deploy:preview   # Deploy a canal preview
```

---

## 🐛 Debugging & Troubleshooting

### Panel de Debug (Solo Desarrollo)

- Ubicación: Esquina inferior derecha
- Muestra: Auth status, Data source, Stations count, Last update
- **NO aparece** en producción (`build` o `preview`)

### Console Logs Importantes

```
🔐 Firebase: User authenticated  ← Auth OK
📊 Stations loaded: 5            ← Data cargada
🔄 Real-time update: station X   ← Actualización real-time
🧹 Cleaning up subscription      ← Cleanup correcto
```

### Problemas Comunes

**"Permission denied" al cargar datos**

- ✅ Solución: Habilitar Anonymous Auth en Firebase Console
- Path: Authentication > Sign-in method > Anonymous

**"No stations found"**

- ✅ Solución: Inspeccionar Firebase con `npm run inspect-firebase`
- Si vacío: Poblar con `npm run seed-firebase`

**Gráfica muestra "Sensor sin lecturas válidas"**

- ✅ Normal si `wind.speed_knots === 0` en todos los readings
- Verificar Arduino enviando datos correctos

**Estado "offline" aunque hay datos**

- ✅ Normal si última lectura > 5 minutos
- Verificar Arduino enviando actualizaciones periódicas

**FirebaseDebugPanel no aparece**

- ✅ Normal - solo visible en `npm run dev`
- No aparece en `build` o `preview`

---

## 🎯 Roadmap & Próximas Fases

### ✅ Fase 0: Mock Data & UI (COMPLETADO)

- ✅ Proyecto base Vite + React + TypeScript
- ✅ UI completa (9 componentes reutilizables)
- ✅ Mock data para desarrollo
- ✅ Tests con Vitest
- ✅ Deploy Firebase Hosting

### ✅ Fase 1: Firebase Integration (COMPLETADO)

- ✅ Firebase Realtime Database conectado
- ✅ FirebaseDataSource implementado
- ✅ Firebase Anonymous Auth automático
- ✅ Scripts inspect/seed
- ✅ Panel debug desarrollo
- ✅ Manejo inteligente datos antiguos
- ✅ Alertas sensores offline
- ✅ Estado dinámico estaciones
- ✅ Filtrado tiempo con fallback
- ✅ Soporte estructura Arduino V1

### ✅ Fase 2.1: Real-time Updates (COMPLETADO)

- ✅ Real-time subscriptions con `onValue()`
- ✅ Hooks personalizados con cleanup automático
- ✅ Migración componentes a real-time
- ✅ Re-suscripción automática al cambiar filtros
- ✅ Sin memory leaks (patrón useEffect)
- ✅ Latencia < 1 segundo verificada

### ⏳ Fase 2.2: Auth Avanzado (PLANIFICADO)

- [ ] Google Sign-In (opcional)
- [ ] Email/Password Auth (opcional)
- [ ] Rutas protegidas (admin)
- [ ] Gestión de usuarios

### 📋 Fase 3: Features Avanzadas

- [ ] PWA con offline support
- [ ] Notificaciones push alertas viento
- [ ] Comparativa entre estaciones
- [ ] Exportación datos (CSV/JSON)
- [ ] Históricos más extensos
- [ ] Dashboard administración
- [ ] Configuración umbrales alerta

### 🚀 Fase 4: Optimización

- [ ] Analytics con Firebase Analytics
- [ ] SEO optimizado
- [ ] Code splitting avanzado
- [ ] Performance monitoring
- [ ] Compression de imágenes
- [ ] Service Workers avanzados

---

## 💡 Reglas de Respuesta de Copilot

Cuando me pidas ayuda, seguiré estas reglas:

### 1. Contexto Primero

- ✅ Siempre considerar Repository Pattern
- ✅ Verificar estructura actual antes de sugerir cambios
- ✅ Leer código existente para mantener consistencia

### 2. Real-time por Defecto

- ✅ Usar `onValue()` para datos Firebase que cambian
- ✅ Solo usar `get()` para datos estáticos (forecast)
- ✅ SIEMPRE incluir cleanup en subscripciones

### 3. TypeScript Estricto

- ❌ NO sugerir `any` (excepto FirebaseDataSource con `snapshot.val()`)
- ✅ Usar tipos explícitos siempre
- ✅ Interfaces para dominio, types para unions

### 4. Tailwind Utilities

- ❌ NO crear CSS custom o inline styles
- ✅ Usar utility classes de Tailwind
- ✅ Incluir `dark:` variant para modo oscuro

### 5. Cleanup Obligatorio

- ✅ SIEMPRE retornar cleanup en `useEffect` con listeners
- ✅ Verificar memory leaks potenciales
- ✅ Console logs para debugging (`🧹 Cleaning up...`)

### 6. Testing & Docs

- ✅ Sugerir tests para nueva lógica compleja
- ✅ Actualizar documentación si añado features importantes
- ✅ Seguir convenciones de commits (Conventional Commits)

### 7. Convenciones

- ✅ Named exports (NO default)
- ✅ Function keyword para componentes (NO arrow functions)
- ✅ Path aliases `@/` (NO relative paths)
- ✅ camelCase para variables, PascalCase para tipos

### 8. Performance

- ⚠️ NO optimizar prematuramente
- ✅ Lazy loading para páginas
- ✅ Limitar datos Recharts (500-1000 puntos)
- ✅ Medir antes de optimizar

---

## 📦 Variables de Entorno

```env
# Data source
VITE_DATA_SOURCE=firebase  # 'mock' o 'firebase'

# Firebase (obtener de Firebase Console > Project Settings)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_DATABASE_URL=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=  # Opcional
```

⚠️ **IMPORTANTE**: NUNCA commitear `.env` - usar `.env.example` como template

---

## 📚 Documentación Adicional

- **README.md** - Guía completa del proyecto
- **DECISIONES_TECNICAS.md** - Justificación decisiones arquitectónicas
- **CONTRIBUTING.md** - Guía de contribución
- **GITHUB_ACTIONS_CHECKLIST.md** - CI/CD con GitHub Actions

---

**Última actualización**: Noviembre 2025
**Versión**: 0.3.0-realtime
**Estado**: Production Ready ✅
