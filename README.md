# 🌬️ WindTrackr

**WindTrackr** es un visor de estaciones meteorológicas especializado en datos de viento, diseñado para entusiastas del windsurf, kitesurf, vela y cualquier actividad relacionada con el viento en la zona del Estrecho de Gibraltar.

![Version](https://img.shields.io/badge/version-0.3.0--realtime-blue)
![Phase](https://img.shields.io/badge/phase-2.1%20(Real--time)-green)
![Status](https://img.shields.io/badge/status-production%20ready-success)



---

## ✨ Características Actuales

### ⚡ Actualización en Tiempo Real (Fase 2.1) ✅

- ✅ **Actualizaciones automáticas**: Los datos se sincronizan sin recargar la página
- ✅ **Latencia <1 segundo**: Cambios en Firebase reflejados casi instantáneamente
- ✅ **Suscripciones inteligentes**: Se re-suscriben automáticamente al cambiar filtros
- ✅ **Cleanup automático**: Sin memory leaks gracias al patrón useEffect

### 🔥 Integración Firebase Completa

- ✅ **Firebase Realtime Database**: Conexión a datos reales desde Arduino con `onValue()`
- ✅ **Autenticación Anónima**: Login automático sin intervención del usuario
- ✅ **Visualización multi-estación**: Soporte para múltiples estaciones meteorológicas
- ✅ **Selector de estación**: Buscador con filtrado en tiempo real
- ✅ **Brújula de viento**: Dirección, velocidad media y rachas en tiempo real
- ✅ **Gráficas interactivas**: Series temporales de 24h y 7 días con scroll completo
- ✅ **Filtrado inteligente por tiempo**: Muestra datos de últimas 24h/7d, con fallback a datos disponibles
- ✅ **Pronóstico**: Previsión de viento y temperatura para las próximas 48 horas
- ✅ **Mapa interactivo**: Leaflet con OpenStreetMap mostrando todas las estaciones
- ✅ **Estado inteligente**: Detecta automáticamente estaciones offline (>5 min sin datos)
- ✅ **Manejo de datos antiguos**: Muestra últimas lecturas disponibles si no hay datos recientes
- ✅ **Alertas de sensores**: Notifica cuando sensores reportan valores 0
- ✅ **Modo oscuro**: Toggle persistente con soporte de preferencias del sistema
- ✅ **Responsive design**: Optimizado para móvil, tablet y escritorio
- ✅ **i18n preparado**: Infraestructura react-i18next (actualmente en español)
- ✅ **DataSource abstraction**: Cambio transparente entre mock y Firebase

---

## 📋 Tabla de Contenidos

- [Características](#-características-actuales)
- [Stack Tecnológico](#-stack-tecnológico)
- [Inicio Rápido](#-inicio-rápido)
- [Uso del Proyecto](#-uso-del-proyecto)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Firebase Integration](#-firebase-integration)
- [Troubleshooting](#-troubleshooting)
- [Roadmap](#-roadmap)
- [Contribución](#-contribución)

## 🚀 Inicio Rápido

### 1. Clonar e Instalar

```bash
git clone <repo-url>
cd estacion-meteorologica
npm install
```

### 2. Configurar Firebase

#### A. Habilitar Autenticación Anónima (CRÍTICO ⚠️)

**La app NO funcionará sin este paso:**

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. **Authentication** > **Sign-in method**
4. **Habilita "Anonymous"** ✅

La app se autentica automáticamente al cargar. Si no habilitas Anonymous Auth, verás el error "Permission denied".

#### B. Configurar Variables de Entorno

Crea `.env` basándote en `.env.example`:

```env
# Data source: 'mock' o 'firebase'
VITE_DATA_SOURCE=firebase

# Firebase Config (obtener de Firebase Console > Project Settings)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 3. Ejecutar en Desarrollo

```bash
npm run dev
```

La app estará en `http://localhost:5173`

**Verificación:**
- ✅ Consola: `🔐 Firebase: User authenticated`
- ✅ Panel debug (esquina inferior derecha): Estado verde
- ✅ UI: Estaciones visibles con actualizaciones en tiempo real

---

## 📜 Scripts Disponibles

### Desarrollo

```bash
npm run dev         # Servidor de desarrollo
npm run build       # Build para producción
npm run preview     # Preview del build local
```

### Testing & Quality

```bash
npm run test        # Ejecutar tests
npm run test:watch  # Tests en modo watch
npm run lint        # ESLint
npm run format      # Prettier
```

### Firebase Utilities

```bash
npm run inspect-firebase  # Inspeccionar estructura de Firebase DB
npm run seed-firebase     # Poblar Firebase con datos mock (testing)
```

### Deploy

```bash
firebase deploy --only hosting              # Deploy a producción
firebase hosting:channel:deploy preview     # Deploy a canal preview
```

### Switching: Mock ↔ Firebase

Cambiar entre entornos modificando `.env`:

```env
# Desarrollo con datos mock (sin Firebase)
VITE_DATA_SOURCE=mock

# Producción con datos reales
VITE_DATA_SOURCE=firebase
```

No requiere cambios en código - el `DataSource` abstraction lo maneja.

### Inspeccionar Firebase DB

Antes de ejecutar la app, verifica la estructura de datos:

```bash
npm run inspect-firebase
```

**Salida esperada:**

```
🔍 Inspecting Firebase Realtime Database...
📊 Root keys: [ 'weather_stations' ]
🏠 Stations found: V1_STATION_TEST, catarroja
📈 Sample reading structure: {...}
```

### Poblar con Datos de Prueba

Si tu Firebase está vacío o quieres testing:

```bash
npm run seed-firebase
```

Esto sube datos mock con 5 estaciones + readings + forecasts.

---

## 📁 Estructura del Proyecto

```
src/
├── app/                      # App shell & configuración
│   ├── firebase.ts          # Firebase SDK init
│   ├── useFirebaseAuth.ts   # Hook de autenticación automática
│   ├── AppLayout.tsx        # Layout principal
│   └── router.tsx           # React Router config
│
├── components/              # Componentes UI reutilizables
│   ├── BasicInfoTile/       # Info + estado de estación
│   ├── FirebaseDebugPanel/  # Panel de debug (solo dev)
│   ├── GraphViewer/         # Gráficas con Recharts
│   ├── NavBar/              # Barra de navegación
│   ├── StationMap/          # Mapa con Leaflet
│   ├── StationSelector/     # Selector con búsqueda
│   ├── ThemeToggle/         # Toggle modo oscuro
│   ├── WeatherForecast/     # Pronóstico 48h
│   └── WindCompass/         # Brújula de viento
│
├── data/
│   └── services/            # Data layer (Repository pattern)
│       ├── DataSource.ts           # Interface abstracta
│       ├── MockDataSource.ts       # Implementación mock
│       ├── FirebaseDataSource.ts   # Implementación Firebase (real-time)
│       └── index.ts                # Factory function
│
├── features/
│   └── stations/            # Domain logic de estaciones
│       ├── hooks/           # Custom hooks (useStationsRealtime, useReadingsRealtime, etc.)
│       └── store/           # Zustand store
│
├── i18n/                    # Internacionalización
│   └── config.ts            # i18next config + traducciones
│
├── pages/                   # Páginas de la app
│   ├── Home.tsx            # Página principal
│   ├── Station.tsx         # Detalle de estación
│   └── NotFound.tsx        # 404
│
├── theme/                   # Sistema de temas
│   └── useTheme.ts         # Hook de dark mode
│
├── types/                   # TypeScript definitions
│   └── index.ts            # Tipos globales
│
└── utils/                   # Funciones utilidad
    └── index.ts            # Formatters, helpers, etc.

scripts/                     # Utilidades Node.js
├── inspectFirebase.ts      # Inspeccionar Firebase DB
└── seedFirebase.ts         # Poblar datos de prueba
```



---scripts/                     # Utilidades Node.js

├── inspectFirebase.ts      # Inspeccionar Firebase DB

## 📁 Estructura del Proyecto└── seedFirebase.ts         # Poblar datos de prueba

```

```

src/## 🔥 Firebase Integration

├── app/                      # App shell & config

│   ├── firebase.ts          # Firebase SDK init### Autenticación Automática

│   ├── useFirebaseAuth.ts   # Hook auth automático

│   ├── AppLayout.tsx        # Layout principalLa app utiliza **Firebase Anonymous Authentication** de forma totalmente transparente:

│   └── router.tsx           # React Router

│```typescript

├── components/              # Componentes UI// src/app/useFirebaseAuth.ts

│   ├── BasicInfoTile/       # Info + estado estaciónexport function useFirebaseAuth() {

│   ├── FirebaseDebugPanel/  # Debug panel (solo dev)  useEffect(() => {

│   ├── GraphViewer/         # Gráficas Recharts    const unsubscribe = onAuthStateChanged(auth, (user) => {

│   ├── NavBar/              # Navegación      if (!user) {

│   ├── StationMap/          # Mapa Leaflet        // Auto sign-in si no hay usuario

│   ├── StationSelector/     # Selector con búsqueda        signInAnonymously(auth);

│   ├── ThemeToggle/         # Toggle dark mode      }

│   ├── WeatherForecast/     # Pronóstico 48h    });

│   └── WindCompass/         # Brújula viento    return () => unsubscribe();

│  }, []);

├── data/}

│   └── services/            # Data layer (Repository pattern)```

│       ├── DataSource.ts           # Interface abstracta

│       ├── MockDataSource.ts       # Mock implementation**Ventajas:**

│       ├── FirebaseDataSource.ts   # Firebase implementation- ✅ Sin formularios de login

│       └── index.ts                # Factory function- ✅ Sin gestión de contraseñas

│- ✅ Cumple con Firebase Security Rules (`auth != null`)

├── features/- ✅ Preparado para migrar a Google/Email auth en el futuro

│   └── stations/            # Domain logic estaciones

│       ├── hooks/           # useStations, useReadings, etc.### Estructura de Datos Soportada

│       └── store/           # Zustand store

│#### ✅ V1 (Actual - Arduino)

├── i18n/                    # Internacionalización

├── pages/                   # Páginas (Home, Station, NotFound)```json

├── theme/                   # Dark mode system{

├── types/                   # TypeScript types  "weather_stations": {

└── utils/                   # Formatters, helpers    "V1_STATION_TEST": {

      "info": {

scripts/                     # Node.js utilities        "name": "V1_STATION_TEST",

├── inspectFirebase.ts      # Inspeccionar Firebase        "latitude": 37.3886,

└── seedFirebase.ts         # Poblar datos prueba        "longitude": -5.9823,

```        "altitude": 50,

        "province": "Sevilla",

---        "station_type": "Automatic",

        "version": "0.0.8.5"

## 🔥 Firebase Integration      },

      "history": {

### Autenticación Automática        "key1": {

          "datetime": "2025-11-15 11:52:23",

La app usa **Firebase Anonymous Auth** de forma transparente:          "timestamp": 1763203490,

          "wind": {

```typescript            "speed_kmh": 0,

// src/app/useFirebaseAuth.ts            "speed_knots": 0,

export function useFirebaseAuth() {            "speed_ms": 0,

  useEffect(() => {            "speed_read_ok": false,

    const unsubscribe = onAuthStateChanged(auth, (user) => {            "direction": 0,

      if (!user) {            "directionCardinal": "N",

        signInAnonymously(auth); // Auto sign-in            "direction_read_ok": false

      }          },

    });          "temperature": 0,

    return () => unsubscribe();          "humidity": 0,

  }, []);          "temp_hum_read_ok": false

}        }

```      }

    }

**Ventajas:**  }

- Sin formularios de login}

- Cumple Firebase Security Rules (`auth != null`)```

- Preparado para migrar a Google/Email auth

**Notas:**

### Estructura de Datos Soportada- Path principal: `/weather_stations/{id}/history`

- Timestamps: Soporta formato Arduino "YYYY-MM-DD HH:MM:SS"

#### V1 (Actual - Arduino)- Fallback: Si no existe `history`, intenta `readings` (retrocompatibilidad)



```json### Manejo Inteligente de Datos

{

  "weather_stations": {#### 1. Filtrado por Tiempo con Fallback

    "V1_STATION_TEST": {

      "info": {```typescript

        "name": "V1_STATION_TEST",// Si no hay datos en últimas 24h, muestra los más recientes

        "latitude": 37.3886,const cutoffTime = now - 24h;

        "longitude": -5.9823,let readings = allReadings.filter(r => r.timestamp >= cutoffTime);

        "altitude": 50,

        "province": "Sevilla",if (readings.length === 0 && allReadings.length > 0) {

        "station_type": "Automatic",  // Fallback: muestra últimos datos disponibles

        "version": "0.0.8.5"  readings = allReadings.slice(0, 500);

      },}

      "history": {```

        "key1": {

          "datetime": "2025-11-15 11:52:23",#### 2. Detección de Estado Offline

          "timestamp": 1763203490,

          "wind": {```typescript

            "speed_kmh": 0,// Si última lectura > 5 minutos, marca como offline

            "speed_knots": 0,const isDataStale = (Date.now() - lastReading) > 5 * 60 * 1000;

            "speed_ms": 0,const status = isDataStale ? 'offline' : 'online';

            "speed_read_ok": false,```

            "direction": 0,

            "directionCardinal": "N"#### 3. Alertas de Sensores

          },

          "temperature": 0,- 🟡 **Amarillo**: Sensor reporta valor 0 (sensor offline/defectuoso)

          "humidity": 0,- 🔵 **Azul**: Datos antiguos (estación no envía actualizaciones)

          "temp_hum_read_ok": false

        }### Switching: Mock ↔ Firebase

      }

    }Cambiar entre entornos es tan simple como modificar una variable:

  }

}```env

```# Desarrollo con datos mock (sin Firebase)

VITE_DATA_SOURCE=mock

**Notas:**

- Path principal: `/weather_stations/{id}/history`# Producción con Firebase

- Timestamps: Soporta "YYYY-MM-DD HH:MM:SS" (Arduino)VITE_DATA_SOURCE=firebase

- Fallback: Si no existe `history`, intenta `readings````



### Manejo Inteligente de DatosNo se requiere ningún cambio en el código - el `DataSource` abstraction se encarga de todo.



#### 1. Filtrado por Tiempo con Fallback## 🧪 Testing



```typescript```bash

// Intenta filtrar por 24h/7dnpm run test        # Run all tests

const cutoffTime = now - 24h;npm run test:watch  # Watch mode

let readings = allReadings.filter(r => r.timestamp >= cutoffTime);```



// Si no hay datos recientes, muestra últimos disponibles**Tests incluidos:**

if (readings.length === 0 && allReadings.length > 0) {- ✅ Utilidades (formateo de unidades, fechas)

  readings = allReadings.slice(0, 500);- ✅ Componentes básicos

}- 🔜 Integración Firebase (con emulator)

```

## 🗺️ Roadmap

### ✅ Fase 0: Mock Data & UI (COMPLETADO)

- ✅ Proyecto base con Vite + React + TypeScript
- ✅ UI completa con 9 componentes reutilizables
- ✅ Mock data para desarrollo
- ✅ Tests con Vitest + React Testing Library
- ✅ Deploy a Firebase Hosting

### ✅ Fase 1: Firebase Integration (COMPLETADO)

- ✅ Firebase Realtime Database conectado
- ✅ FirebaseDataSource implementado
- ✅ Firebase Anonymous Auth automático
- ✅ Scripts de inspección y seed
- ✅ Panel de debug para desarrollo
- ✅ Manejo inteligente de datos antiguos
- ✅ Alertas de sensores offline
- ✅ Estado dinámico de estaciones
- ✅ Filtrado por tiempo con fallback
- ✅ Soporte completo para estructura Arduino V1

### ✅ Fase 2.1: Actualización en Tiempo Real (COMPLETADO)

- ✅ Real-time subscriptions con `onValue()`
- ✅ Hooks personalizados con cleanup automático
- ✅ Migración de componentes a real-time
- ✅ Re-suscripción automática al cambiar filtros
- ✅ Sin memory leaks (patrón useEffect)
- ✅ Latencia < 1 segundo verificada
- ✅ Documentación completa (ver `FASE2_COMPLETADA.md`)

### ⏳ Fase 2.2: Auth Avanzado (EN PLANIFICACIÓN)

- [ ] Google Sign-In (opcional)
- [ ] Email/Password Auth (opcional)
- [ ] Rutas protegidas (admin)
- [ ] Gestión de usuarios

### 📋 Fase 3: Features Avanzadas

- [ ] PWA con offline support
- [ ] Notificaciones push para alertas de viento
- [ ] Comparativa entre estaciones
- [ ] Exportación de datos (CSV/JSON)
- [ ] Históricos más extensos
- [ ] Dashboard de administración
- [ ] Configuración de umbrales de alerta

### 🚀 Fase 4: Optimización

- [ ] Analytics con Firebase Analytics
- [ ] SEO optimizado
- [ ] Code splitting avanzado
- [ ] Performance monitoring
- [ ] Compression de imágenes
- [ ] Service Workers avanzados

---

**Causa:** Solo visible en desarrollo

El archivo `firebase.json` ya está configurado para SPA routing y cache optimization:

**Solución:** Normal - ejecuta `npm run dev` (no `build` o `preview`)

```json

### Gráfica muestra "Sensor sin lecturas"{

  "hosting": {

**Causa:** Todos los valores viento = 0    "public": "dist",

    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],

**Solución:** Comportamiento esperado. Verifica:    "rewrites": [

- Arduino enviando datos correctos      {

- Firebase Console: `wind.speed_knots` no sea 0        "source": "**",

- Si sensor defectuoso, es normal        "destination": "/index.html"

      }

### Estado "Offline" pero hay datos    ],

    "headers": [

**Causa:** Última lectura >5 minutos      {

        "source": "**/*.@(js|css)",

**Solución:** Comportamiento esperado. Verifica Arduino enviando actualizaciones.        "headers": [

          {

---            "key": "Cache-Control",

            "value": "max-age=31536000"

## 🗺️ Roadmap          }

        ]

### ✅ Fase 0: Foundation (COMPLETADO)      }

- ✅ Vite + React + TypeScript setup    ]

- ✅ UI completa (9 componentes)  }

- ✅ Mock data para desarrollo}

- ✅ Tests con Vitest```

- ✅ Deploy Firebase Hosting

### Deploy

### ✅ Fase 1: Firebase Integration (COMPLETADO)

- ✅ Firebase Realtime Database```bash

- ✅ FirebaseDataSource implementation# 1. Build

- ✅ Anonymous Auth automáticonpm run build

- ✅ Scripts inspect/seed

- ✅ Panel debug desarrollo# 2. Deploy a producción

- ✅ Manejo datos antiguosfirebase deploy --only hosting

- ✅ Alertas sensores offline

- ✅ Estado dinámico estaciones# 3. O deploy a preview channel

- ✅ Filtrado tiempo con fallbackfirebase hosting:channel:deploy preview

- ✅ Soporte estructura Arduino V1```



### ⏳ Fase 2: Real-time & Advanced Auth (PRÓXIMO)## 🎨 Modo Oscuro



#### Real-time UpdatesImplementado con Tailwind CSS y persistencia en localStorage:

- [ ] Migrar `get()` → `onValue()`

- [ ] Subscriptions en tiempo real```typescript

- [ ] Cleanup listeners en useEffect// Hook useTheme

const { theme, toggleTheme } = useTheme();

#### Auth Avanzado (Opcional)

- [ ] Google Sign-In// Detecta preferencia del sistema

- [ ] Email/Password Auth// Persiste selección en localStorage

- [ ] AuthContext y hooks// Sincroniza con <html class="dark">

- [ ] Login/Logout UI```

- [ ] Rutas protegidas

- [ ] Firebase Rules con auth**Características:**

- Toggle en NavBar

### 📋 Fase 3: Features Avanzadas- Respeta `prefers-color-scheme`

- [ ] PWA con offline support- Transiciones suaves

- [ ] Notificaciones push alertas viento- Persiste entre sesiones

- [ ] Comparativa entre estaciones

- [ ] Exportación datos (CSV/JSON)## 🌍 Internacionalización

- [ ] Históricos extensos

- [ ] Dashboard administraciónPreparado con react-i18next. Actualmente solo español, pero fácil de extender:

- [ ] Configuración umbrales alerta

```typescript

### 🚀 Fase 4: Optimización// Uso en componentes

- [ ] Firebase Analyticsconst { t } = useTranslation();

- [ ] SEO optimizadot('nav.home'); // "Inicio"

- [ ] Code splitting avanzado

- [ ] Performance monitoring// Para añadir inglés:

- [ ] Service Workers// 1. Editar src/i18n/config.ts

- [ ] Compression assets// 2. Añadir traducciones en objeto 'en'

// 3. Añadir selector de idioma en NavBar

---```



## 🤝 Contribución## 🆘 Troubleshooting



Ver [CONTRIBUTING.md](CONTRIBUTING.md) para guía detallada.### "Permission denied" al cargar datos



### Quick Start**Causa:** Anonymous Auth no habilitado en Firebase Console



1. Fork del repositorio**Solución:**

2. Crea rama: `git checkout -b feature/nueva-feature`1. Firebase Console > Authentication > Sign-in method

3. Commit: `git commit -m 'feat: descripción'`2. Habilita **Anonymous** ✅

4. Push: `git push origin feature/nueva-feature`3. Recarga la app

5. Abre Pull Request

### "No stations found"

### Convenciones Commits

- `feat:` Nueva característica**Causa:** Estructura de datos incorrecta o vacía

- `fix:` Corrección bug

- `docs:` Documentación**Solución:**

- `style:` Formato código```bash

- `refactor:` Refactorización# Inspeccionar estructura

- `test:` Testsnpm run inspect-firebase

- `chore:` Tareas mantenimiento

# Si está vacía, poblar con datos de prueba

---npm run seed-firebase

```

## 📚 Documentación Adicional

### App se queda en "Conectando..."

- **[DECISIONES_TECNICAS.md](DECISIONES_TECNICAS.md)** - Decisiones arquitectónicas del proyecto

- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Guía completa de contribución**Causa:** Credenciales Firebase incorrectas en `.env`



---**Solución:**

1. Verifica variables `VITE_FIREBASE_*` en `.env`

## 📊 Métricas del Proyecto2. Compara con Firebase Console > Project Settings

3. Recarga la app (Ctrl+R)

- **Líneas de código**: ~3,500

- **Componentes React**: 9### FirebaseDebugPanel no aparece

- **Páginas**: 3

- **Hooks personalizados**: 8**Causa:** Solo visible en modo desarrollo

- **Tests**: 15+

- **Build size**: ~1.3 MB JS (380 KB gzipped)**Solución:** Normal - solo aparece con `npm run dev`, no en producción

- **Lighthouse Score**: 95+ (Performance, A11y, Best Practices)

### Gráfica muestra "Sensor sin lecturas válidas"

---

**Causa:** Todos los valores de viento son 0 en Firebase

## 📝 Changelog

### v0.3.0-realtime (Fase 2.1 - Dic 2024)

- ✅ **Real-time subscriptions**: Migrado de `get()` a `onValue()` en Firebase
- ✅ **Hooks real-time**: `useStationsRealtime`, `useStationRealtime`, `useReadingsRealtime`
- ✅ **Actualización automática**: Datos se sincronizan sin recargar (<1s latencia)
- ✅ **Re-suscripción inteligente**: Al cambiar filtros se re-subscribe automáticamente
- ✅ **Cleanup automático**: Patrón useEffect con cleanup para prevenir memory leaks
- ✅ **Eliminados hooks legacy**: `useStations`, `useStation`, `useReadings` (ya no necesarios)
- ✅ **Eliminado refetch manual**: Ya no se necesitan botones de recargar
- ✅ **Documentación completa**: Ver `FASE2_COMPLETADA.md` para detalles técnicos
- 📊 **Métricas**: +488 LOC, 7 archivos modificados, ~4 horas implementación

### v0.2.1-firebase (Nov 2024)

- ✅ Filtrado inteligente por tiempo
- ✅ Estado dinámico estaciones (offline >5min)
- ✅ Alertas sensores con valor 0
- ✅ Fallback datos antiguos
- ✅ Documentación consolidada

### v0.2.0-firebase (Nov 2024)

- ✅ Firebase Realtime Database
- ✅ Anonymous Auth automático
- ✅ FirebaseDataSource implementation
- ✅ Scripts inspect/seed
- ✅ Panel debug

### v0.1.0 (Fase 0)

- ✅ Proyecto base Vite + React + TS
- ✅ UI completa con mock data
- ✅ Deploy Firebase Hosting

---

VITE_FIREBASE_PROJECT_ID=proyecto-id

[Especificar licencia - MIT, Apache 2.0, etc.]VITE_FIREBASE_STORAGE_BUCKET=proyecto.appspot.com

VITE_FIREBASE_MESSAGING_SENDER_ID=123456789

---VITE_FIREBASE_APP_ID=1:123:web:abc

VITE_FIREBASE_MEASUREMENT_ID=G-ABC123        # Opcional (Analytics)

## 📞 Soporte```



**Issues:** Reporta bugs o solicita features en GitHub Issues## 🤝 Contribución



**Documentación Técnica:** Ver [DECISIONES_TECNICAS.md](DECISIONES_TECNICAS.md)1. Fork del repositorio

2. Crea rama feature: `git checkout -b feature/nueva-feature`

---3. Commit con mensaje descriptivo: `git commit -m 'feat: descripción'`

4. Push: `git push origin feature/nueva-feature`

**WindTrackr** - _Porque el viento no espera_ 🌬️5. Abre Pull Request



**Última actualización:** 16 de Noviembre, 2025  **Convenciones de commits:**

**Versión:** 0.2.1-firebase  - `feat:` Nueva característica

**Estado:** ✅ Production Ready- `fix:` Corrección de bug

- `docs:` Documentación
- `style:` Formato, espacios, etc.
- `refactor:` Refactorización sin cambio funcional
- `test:` Añadir/modificar tests
- `chore:` Tareas de mantenimiento

## 📊 Métricas del Proyecto

- **Líneas de código**: ~3,500
- **Componentes React**: 9
- **Páginas**: 3
- **Hooks personalizados**: 8
- **Tests**: 15+
- **Build size**: ~1.3 MB JS (380 KB gzipped)
- **Lighthouse Score**: 95+ (Performance, A11y, Best Practices)

## 📝 Notas de la Fase 1

### ✅ Implementado Completamente

1. **Firebase Realtime Database**
   - Conexión establecida y verificada
   - Soporte para estructura Arduino V1
   - Fallback a estructura deprecated

2. **Autenticación**
   - Anonymous Auth automático
   - Hook `useFirebaseAuth` transparente
   - Pantallas de carga/error

3. **Manejo Inteligente de Datos**
   - Filtrado por tiempo real (24h/7d)
   - Fallback a últimos datos si no hay recientes
   - Parsing de timestamps Arduino ("YYYY-MM-DD HH:MM:SS")
   - Detección de estado offline (>5 min)
   - Alertas de sensores con valor 0

4. **Developer Experience**
   - Scripts de inspección/seed
   - Panel de debug visual
   - Console logs informativos
   - Documentación exhaustiva

### 🎯 Logros Clave

- **Zero breaking changes**: UI original intacta
- **Production ready**: Funcional con datos reales
- **Arduino compatible**: Soporta formato nativo
- **Flexible**: Mock/Firebase intercambiable
- **Resiliente**: Maneja datos faltantes/antiguos

## � Documentación Adicional

- **[FIREBASE_GUIDE.md](FIREBASE_GUIDE.md)** - Guía técnica detallada de Firebase
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Solución de problemas comunes
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Guía de contribución
- **[DECISIONES_TECNICAS.md](DECISIONES_TECNICAS.md)** - Decisiones arquitectónicas
- **[QUICKSTART.md](QUICKSTART.md)** - Guía rápida de inicio
- **[NEXT_STEPS.md](NEXT_STEPS.md)** - Próximas fases y features

## �📞 Soporte

Para reportar bugs o solicitar features:
- Abre un **Issue** en GitHub
- Describe el problema/feature claramente
- Incluye pasos para reproducir (si es bug)
- Adjunta screenshots si aplica

## 📄 Licencia

[Especificar licencia - MIT, Apache 2.0, etc.]

---

**WindTrackr** - _Porque el viento no espera_ 🌬️

**Última actualización:** 16 de Noviembre, 2025
**Versión:** 0.2.1-firebase
**Estado:** ✅ Production Ready
