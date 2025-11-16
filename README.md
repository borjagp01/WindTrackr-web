# 🌬️ WindTrackr# 🌬️ WindTrackr



**WindTrackr** es un visor de estaciones meteorológicas especializado en datos de viento, diseñado para entusiastas del windsurf, kitesurf, vela y cualquier actividad relacionada con el viento en la zona del Estrecho de Gibraltar.**WindTrackr** es un visor de estaciones meteorológicas especializado en datos de viento, diseñado para entusiastas del windsurf, kitesurf, vela y cualquier actividad relacionada con el viento en la zona del Estrecho de Gibraltar.



![Version](https://img.shields.io/badge/version-0.2.1--firebase-blue)![Version](https://img.shields.io/badge/version-0.2.1--firebase-blue)

![Phase](https://img.shields.io/badge/phase-1%20Complete-green)![Phase](https://img.shields.io/badge/phase-1%20(Firebase%20Complete)-green)

![Status](https://img.shields.io/badge/status-production%20ready-success)![Status](https://img.shields.io/badge/status-production%20ready-success)



---## ✨ Características Actuales



## 📋 Tabla de Contenidos### Integración Firebase Completa ✅



- [Características](#-características-actuales)- ✅ **Firebase Realtime Database**: Conexión a datos reales desde Arduino

- [Stack Tecnológico](#️-stack-tecnológico)- ✅ **Autenticación Anónima**: Login automático sin intervención del usuario

- [Inicio Rápido](#-inicio-rápido)- ✅ **Visualización multi-estación**: Soporte para múltiples estaciones meteorológicas

- [Uso del Proyecto](#-uso-del-proyecto)- ✅ **Selector de estación**: Buscador con filtrado en tiempo real

- [Estructura del Proyecto](#-estructura-del-proyecto)- ✅ **Brújula de viento**: Dirección, velocidad media y rachas en tiempo real

- [Firebase Integration](#-firebase-integration)- ✅ **Gráficas interactivas**: Series temporales de 24h y 7 días con scroll completo

- [Troubleshooting](#-troubleshooting)- ✅ **Filtrado inteligente por tiempo**: Muestra datos de últimas 24h/7d, con fallback a datos disponibles

- [Roadmap](#️-roadmap)- ✅ **Pronóstico**: Previsión de viento y temperatura para las próximas 48 horas

- [Contribución](#-contribución)- ✅ **Mapa interactivo**: Leaflet con OpenStreetMap mostrando todas las estaciones

- ✅ **Estado inteligente**: Detecta automáticamente estaciones offline (>5 min sin datos)

---- ✅ **Manejo de datos antiguos**: Muestra últimas lecturas disponibles si no hay datos recientes

- ✅ **Alertas de sensores**: Notifica cuando sensores reportan valores 0

## ✨ Características Actuales- ✅ **Modo oscuro**: Toggle persistente con soporte de preferencias del sistema

- ✅ **Responsive design**: Optimizado para móvil, tablet y escritorio

### Fase 1 Completada ✅- ✅ **i18n preparado**: Infraestructura react-i18next (actualmente en español)

- ✅ **DataSource abstraction**: Cambio transparente entre mock y Firebase

- ✅ **Firebase Realtime Database**: Conexión a datos reales desde Arduino

- ✅ **Autenticación Anónima Automática**: Sin formularios, transparente al usuario## 🛠️ Stack Tecnológico

- ✅ **Visualización Multi-Estación**: Soporte para múltiples estaciones meteorológicas

- ✅ **Selector de Estación**: Buscador con filtrado en tiempo real### Core

- ✅ **Brújula de Viento**: Dirección, velocidad media y rachas actualizadas- **Vite** 5.x - Build tool ultrarrápido

- ✅ **Gráficas Interactivas**: Series temporales 24h/7d con Recharts- **React** 19.x - Framework UI

- ✅ **Filtrado Inteligente**: Por tiempo real con fallback a datos disponibles- **TypeScript** 5.x - Type safety

- ✅ **Estado Dinámico**: Detecta estaciones offline (>5 min sin datos)

- ✅ **Alertas de Sensores**: Notifica sensores con valor 0### UI & Styling

- ✅ **Pronóstico**: Previsión de viento y temperatura 48h- **Tailwind CSS** 4.x - Utility-first CSS

- ✅ **Mapa Interactivo**: Leaflet con OpenStreetMap- **Recharts** 3.x - Gráficas interactivas

- ✅ **Modo Oscuro**: Toggle persistente con soporte system preference- **React Leaflet** 5.x - Mapas con OpenStreetMap

- ✅ **Responsive Design**: Optimizado móvil, tablet y escritorio

- ✅ **i18n Ready**: Infraestructura react-i18next (español)### Estado & Navegación

- **Zustand** 5.x - Estado global ligero

---- **React Router** 7.x - Routing SPA



## 🛠️ Stack Tecnológico### Backend & Auth

- **Firebase** 12.x - Realtime Database + Authentication

### Core- **Firebase Hosting** - Deploy y CDN

- **Vite** 5.x - Build tool

- **React** 19.x - UI Framework### Testing & Quality

- **TypeScript** 5.x - Type safety- **Vitest** + **React Testing Library** - Unit & integration tests

- **ESLint** + **Prettier** - Code quality

### UI & Styling

- **Tailwind CSS** 4.x - Utility-first CSS## 🚀 Inicio Rápido

- **Recharts** 3.x - Gráficas interactivas

- **React Leaflet** 5.x - Mapas### 1. Requisitos Previos



### Estado & Navegación- Node.js 18+ y npm

- **Zustand** 5.x - Estado global- Cuenta de Firebase (gratis)

- **React Router** 7.x - Routing SPA- Git



### Backend & Auth### 2. Instalación

- **Firebase** 12.x - Realtime Database + Auth

- **Firebase Hosting** - Deploy```bash

# Clonar repositorio

### Testing & Qualitygit clone <repo-url>

- **Vitest** + **React Testing Library**cd estacion-meteorologica

- **ESLint** + **Prettier**

# Instalar dependencias

---npm install

```

## 🚀 Inicio Rápido

### 3. Configuración de Firebase

### 1. Clonar e Instalar

#### A. Habilitar Autenticación Anónima (CRÍTICO ⚠️)

```bash

git clone <repo-url>**La app NO funcionará sin este paso:**

cd estacion-meteorologica

npm install1. Ve a [Firebase Console](https://console.firebase.google.com/)

```2. Selecciona tu proyecto

3. **Authentication** > **Sign-in method**

### 2. Configurar Firebase4. **Habilita "Anonymous"** ✅



#### A. Habilitar Anonymous Auth (CRÍTICO ⚠️)La app se autentica automáticamente al cargar. Si no habilitas Anonymous Auth, verás el error "Permission denied".



1. Ve a [Firebase Console](https://console.firebase.google.com/)#### B. Configurar Variables de Entorno

2. Selecciona tu proyecto

3. **Authentication** > **Sign-in method**Crea `.env` basándote en `.env.example`:

4. **Habilita "Anonymous"** ✅

```env

**Sin este paso la app no funcionará** (error "Permission denied")# Data source: 'mock' o 'firebase'

VITE_DATA_SOURCE=firebase

#### B. Crear archivo `.env`

# Firebase Config (obtener de Firebase Console > Project Settings)

Copia `.env.example` a `.env` y configura:VITE_FIREBASE_API_KEY=your_api_key

VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com

```envVITE_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com

VITE_DATA_SOURCE=firebaseVITE_FIREBASE_PROJECT_ID=your_project_id

VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com

# Obtener de Firebase Console > Project Settings > Your appsVITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id

VITE_FIREBASE_API_KEY=your_api_keyVITE_FIREBASE_APP_ID=your_app_id

VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.comVITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

VITE_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com```

VITE_FIREBASE_PROJECT_ID=your_project_id

VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com### 4. Ejecutar en Desarrollo

VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id

VITE_FIREBASE_APP_ID=your_app_id```bash

VITE_FIREBASE_MEASUREMENT_ID=your_measurement_idnpm run dev

``````



### 3. EjecutarLa app estará en `http://localhost:5173`



```bash**Verificación:**

npm run dev- ✅ Consola: `🔐 Firebase: User authenticated`

```- ✅ Panel debug (esquina inferior derecha): Estado verde

- ✅ UI: Estaciones visibles

Abre `http://localhost:5173`

## 📜 Scripts Disponibles

**Verificación:**

- ✅ Consola: `🔐 Firebase: User authenticated`### Desarrollo

- ✅ Panel debug (esquina derecha): Estado verde```bash

- ✅ UI: Estaciones visiblesnpm run dev         # Servidor de desarrollo

npm run build       # Build para producción

---npm run preview     # Preview del build local

```

## 🎮 Uso del Proyecto

### Testing & Quality

### Scripts Disponibles```bash

npm run test        # Ejecutar tests

#### Desarrollonpm run test:watch  # Tests en modo watch

```bashnpm run lint        # ESLint

npm run dev         # Servidor desarrollo (localhost:5173)npm run format      # Prettier

npm run build       # Build producción```

npm run preview     # Preview del build

```### Firebase Utilities

```bash

#### Testing & Qualitynpm run inspect-firebase  # Inspeccionar estructura de Firebase DB

```bashnpm run seed-firebase     # Poblar Firebase con datos mock (testing)

npm run test        # Ejecutar tests```

npm run test:watch  # Tests en watch mode

npm run lint        # ESLint### Deploy

npm run format      # Prettier```bash

```firebase deploy --only hosting              # Deploy a producción

firebase hosting:channel:deploy preview     # Deploy a canal preview

#### Firebase Utilities```

```bash

npm run inspect-firebase  # Inspeccionar estructura Firebase DB## 📁 Estructura del Proyecto

npm run seed-firebase     # Poblar con datos mock (testing)

``````

src/

#### Deploy├── app/                      # App shell & configuración

```bash│   ├── firebase.ts          # Firebase SDK init

firebase deploy --only hosting              # Deploy producción│   ├── useFirebaseAuth.ts   # Hook de autenticación automática

firebase hosting:channel:deploy preview     # Deploy preview│   ├── AppLayout.tsx        # Layout principal

```│   └── router.tsx           # React Router config

│

### Switching: Mock ↔ Firebase├── components/              # Componentes UI reutilizables

│   ├── BasicInfoTile/       # Info + estado de estación

Cambiar entre entornos modificando `.env`:│   ├── FirebaseDebugPanel/  # Panel de debug (solo dev)

│   ├── GraphViewer/         # Gráficas con Recharts

```env│   ├── NavBar/              # Barra de navegación

# Desarrollo con datos mock (sin Firebase)│   ├── StationMap/          # Mapa con Leaflet

VITE_DATA_SOURCE=mock│   ├── StationSelector/     # Selector con búsqueda

│   ├── ThemeToggle/         # Toggle modo oscuro

# Producción con datos reales│   ├── WeatherForecast/     # Pronóstico 48h

VITE_DATA_SOURCE=firebase│   └── WindCompass/         # Brújula de viento

```│

├── data/

No requiere cambios en código - el `DataSource` abstraction lo maneja.│   └── services/            # Data layer (Repository pattern)

│       ├── DataSource.ts           # Interface abstracta

### Inspeccionar Firebase DB│       ├── MockDataSource.ts       # Implementación mock

│       ├── FirebaseDataSource.ts   # Implementación Firebase

Antes de ejecutar la app, verifica la estructura de datos:│       └── index.ts                # Factory function

│

```bash├── features/

npm run inspect-firebase│   └── stations/            # Domain logic de estaciones

```│       ├── hooks/           # Custom hooks (useStations, useReadings, etc.)

│       └── store/           # Zustand store

**Salida esperada:**│

```├── i18n/                    # Internacionalización

🔍 Inspecting Firebase Realtime Database...│   └── config.ts            # i18next config + traducciones

📊 Root keys: [ 'weather_stations' ]│

🏠 Stations found: V1_STATION_TEST, catarroja├── pages/                   # Páginas de la app

📈 Sample reading structure: {...}│   ├── Home.tsx            # Página principal

```│   ├── Station.tsx         # Detalle de estación

│   └── NotFound.tsx        # 404

### Poblar con Datos de Prueba│

├── theme/                   # Sistema de temas

Si tu Firebase está vacío o quieres testing:│   └── useTheme.ts         # Hook de dark mode

│

```bash├── types/                   # TypeScript definitions

npm run seed-firebase│   └── index.ts            # Tipos globales

```│

└── utils/                   # Funciones utilidad

Esto sube datos mock con 5 estaciones + readings + forecasts.    └── index.ts            # Formatters, helpers, etc.



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

#### 2. Detección Estado Offline

### ✅ Fase 0: Mock Data & UI (COMPLETADO)

```typescript

// Si última lectura > 5 minutos, marca offline- ✅ Proyecto base con Vite + React + TypeScript

const isDataStale = (Date.now() - lastReading) > 5 * 60 * 1000;- ✅ UI completa con 9 componentes reutilizables

const status = isDataStale ? 'offline' : 'online';- ✅ Mock data para desarrollo

```- ✅ Tests con Vitest + React Testing Library

- ✅ Deploy a Firebase Hosting

#### 3. Alertas Visuales

### ✅ Fase 1: Firebase Integration (COMPLETADO)

- 🟡 **Amarillo**: Sensor reporta 0 (defectuoso/offline)

- 🔵 **Azul**: Datos antiguos (estación no envía actualizaciones)- ✅ Firebase Realtime Database conectado

- ✅ FirebaseDataSource implementado

---- ✅ Firebase Anonymous Auth automático

- ✅ Scripts de inspección y seed

## 🆘 Troubleshooting- ✅ Panel de debug para desarrollo

- ✅ Manejo inteligente de datos antiguos

### "Permission denied"- ✅ Alertas de sensores offline

- ✅ Estado dinámico de estaciones

**Causa:** Anonymous Auth no habilitado- ✅ Filtrado por tiempo con fallback

- ✅ Soporte completo para estructura Arduino V1

**Solución:**

1. Firebase Console > Authentication > Sign-in method### ⏳ Fase 2: Real-time & Auth (EN PLANIFICACIÓN)

2. Habilita **Anonymous** ✅

3. Recarga app- [ ] Real-time subscriptions con `onValue()`

- [ ] Google Sign-In (opcional)

### "No stations found"- [ ] Email/Password Auth (opcional)

- [ ] Rutas protegidas (admin)

**Causa:** Base de datos vacía o estructura incorrecta- [ ] Gestión de usuarios



**Solución:**### 📋 Fase 3: Features Avanzadas

```bash

# Inspeccionar estructura- [ ] PWA con offline support

npm run inspect-firebase- [ ] Notificaciones push para alertas de viento

- [ ] Comparativa entre estaciones

# Si está vacía, poblar con datos prueba- [ ] Exportación de datos (CSV/JSON)

npm run seed-firebase- [ ] Históricos más extensos

```- [ ] Dashboard de administración

- [ ] Configuración de umbrales de alerta

### App en "Conectando..."

### 🚀 Fase 4: Optimización

**Causa:** Credenciales Firebase incorrectas

- [ ] Analytics con Firebase Analytics

**Solución:**- [ ] SEO optimizado

1. Verifica variables `VITE_FIREBASE_*` en `.env`- [ ] Code splitting avanzado

2. Compara con Firebase Console > Project Settings- [ ] Performance monitoring

3. Reinicia servidor: `Ctrl+C` → `npm run dev`- [ ] Compression de imágenes

- [ ] Service Workers avanzados

### FirebaseDebugPanel no aparece

## 📄 Configuración de Firebase Hosting

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

**Solución:**

### v0.2.1-firebase (16 Nov 2025)- Verifica que tu Arduino esté enviando datos correctos

- ✅ Filtrado inteligente por tiempo- Revisa en Firebase Console que `wind.speed_knots` no sea 0

- ✅ Estado dinámico estaciones (offline >5min)- Si el sensor está defectuoso, es comportamiento esperado

- ✅ Alertas sensores con valor 0

- ✅ Fallback datos antiguos### Estado "Fuera de línea" pero hay datos

- ✅ Documentación consolidada

**Causa:** Última lectura tiene más de 5 minutos

### v0.2.0-firebase (Nov 2025)

- ✅ Firebase Realtime Database**Solución:**

- ✅ Anonymous Auth automático- Verifica que Arduino esté enviando datos actualizados

- ✅ FirebaseDataSource implementation- Es comportamiento normal si no hay nuevos datos en 5+ min

- ✅ Scripts inspect/seed

- ✅ Panel debug## 🔐 Variables de Entorno



### v0.1.0 (Fase 0)```env

- ✅ Proyecto base Vite + React + TS# REQUERIDAS

- ✅ UI completa con mock dataVITE_DATA_SOURCE=firebase                    # 'mock' o 'firebase'

- ✅ Deploy Firebase Hosting

# FIREBASE CONFIG (obtener de Project Settings)

---VITE_FIREBASE_API_KEY=AIzaSy...              # API Key

VITE_FIREBASE_AUTH_DOMAIN=proyecto.firebaseapp.com

## 📄 LicenciaVITE_FIREBASE_DATABASE_URL=https://proyecto.firebaseio.com

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
