# 🌬️ WindTrackr

**WindTrackr** es un visor de estaciones meteorológicas en tiempo real especializado en datos de viento, diseñado para entusiastas del windsurf, kitesurf, vela y cualquier actividad relacionada con el viento.

![Version](https://img.shields.io/badge/version-0.3.0--realtime-blue)
![Phase](https://img.shields.io/badge/phase-2.1%20(Real--time)-green)
![Status](https://img.shields.io/badge/status-production%20ready-success)

---

## 📋 Tabla de Contenidos

- [Características](#-características-principales)
- [Stack Tecnológico](#-stack-tecnológico)
- [Inicio Rápido](#-inicio-rápido)
- [Scripts Disponibles](#-scripts-disponibles)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Firebase](#-firebase)
- [Roadmap](#️-roadmap)
- [Troubleshooting](#-troubleshooting)
- [Contribución](#-contribución)
- [Métricas del Proyecto](#-métricas-del-proyecto)
- [Documentación Adicional](#-documentación-adicional)
- [Changelog](#-changelog)
- [Soporte](#-soporte)

---

## ✨ Características Principales

### ⚡ Actualización en Tiempo Real (Fase 2.1) ✅

- **Sincronización automática**: Datos actualizados sin recargar la página
- **Latencia <1 segundo**: Cambios en Firebase reflejados instantáneamente
- **Suscripciones inteligentes**: Re-suscripción automática al cambiar filtros
- **Sin memory leaks**: Patrón useEffect con cleanup automático

### 🔥 Integración Firebase Completa

- **Firebase Realtime Database**: Conexión a datos reales desde Arduino con `onValue()`
- **Autenticación Anónima**: Login automático y transparente
- **Visualización multi-estación**: Soporte para múltiples estaciones meteorológicas
- **Estado inteligente**: Detección automática de estaciones offline (>5 min sin datos)

### 🎨 Interfaz Completa

- **Selector de estación**: Buscador con filtrado en tiempo real
- **Brújula de viento**: Dirección, velocidad media y rachas actualizadas
- **Gráficas interactivas**: Series temporales de 24h y 7 días con scroll completo
- **Pronóstico**: Previsión de viento y temperatura para 48 horas
- **Mapa interactivo**: Leaflet con OpenStreetMap mostrando todas las estaciones
- **Modo oscuro**: Toggle persistente con soporte de preferencias del sistema
- **Responsive design**: Optimizado para móvil, tablet y escritorio

### 🛠️ Features Técnicos

- **Filtrado inteligente**: Muestra datos de últimas 24h/7d con fallback a datos disponibles
- **Alertas de sensores**: Notificación cuando sensores reportan valores 0
- **Manejo de datos antiguos**: Muestra últimas lecturas disponibles si no hay datos recientes
- **DataSource abstraction**: Cambio transparente entre mock y Firebase
- **i18n preparado**: Infraestructura react-i18next (actualmente en español)

---

## 🚀 Stack Tecnológico

- **Frontend**: React 18 + TypeScript + Vite
- **Estilos**: Tailwind CSS
- **Estado**: Zustand
- **Gráficas**: Recharts
- **Mapas**: Leaflet + React-Leaflet
- **Backend**: Firebase Realtime Database
- **Auth**: Firebase Anonymous Auth
- **Deploy**: Firebase Hosting
- **Testing**: Vitest + React Testing Library
- **i18n**: react-i18next

---

## 📋 Inicio Rápido

### 1. Clonar e Instalar

```bash
git clone <repo-url>
cd WindTrackr-web
npm install
```

### 2. Configurar Firebase

#### A. Habilitar Autenticación Anónima (CRÍTICO ⚠️)

**La app NO funcionará sin este paso:**

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. **Authentication** > **Sign-in method**
4. **Habilita "Anonymous"** ✅

#### B. Configurar Variables de Entorno

Crea `.env` basándote en `.env.example`:

```properties
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
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id  # Opcional
```

### 3. Ejecutar en Desarrollo

```bash
npm run dev
```

La app estará en `http://localhost:5173`

**Verificación exitosa:**

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

### Firebase Functions

```bash
cd functions
npm install              # Instalar dependencias de functions
npm run deploy           # Desplegar functions a Firebase
npm run logs             # Ver logs de functions
```

Ver [functions/README.md](functions/README.md) para documentación completa de las Cloud Functions.

### Deploy

```bash
firebase deploy --only hosting              # Deploy a producción
firebase hosting:channel:deploy preview     # Deploy a canal preview
```

### Switching: Mock ↔ Firebase

Cambiar entre entornos modificando `.env`:

```properties
# Desarrollo con datos mock (sin Firebase)
VITE_DATA_SOURCE=mock

# Producción con datos reales
VITE_DATA_SOURCE=firebase
```

No requiere cambios en código - el `DataSource` abstraction lo maneja automáticamente.

---

## 📁 Estructura del Proyecto

```bash
src/
├── app/                     # App shell & configuración
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
│       ├── FirebaseDataSource.ts   # Implementación Firebase
│       └── index.ts                # Factory function
│
├── features/
│   └── stations/            # Domain logic de estaciones
│       ├── hooks/           # Custom hooks (real-time)
│       └── store/           # Zustand store
│
├── i18n/                    # Internacionalización
│   └── config.ts            # i18next config + traducciones
│
├── pages/                   # Páginas de la app
│   ├── Home.tsx             # Página principal
│   ├── Station.tsx          # Detalle de estación
│   └── NotFound.tsx         # 404
│
├── theme/                   # Sistema de temas
│   └── useTheme.ts          # Hook de dark mode
│
├── types/                   # TypeScript definitions
│   └── index.ts             # Tipos globales
│
└── utils/                   # Funciones utilidad
    └── index.ts             # Formatters, helpers, etc.

scripts/                     # Utilidades Node.js
├── inspectFirebase.ts       # Inspeccionar Firebase DB
└── seedFirebase.ts          # Poblar datos de prueba
```

---

## 🔥 Firebase

### Autenticación Automática

La app utiliza **Firebase Anonymous Authentication** de forma transparente:

```typescript
// src/app/useFirebaseAuth.ts
export function useFirebaseAuth() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // Auto sign-in si no hay usuario
        signInAnonymously(auth);
      }
    });
    return () => unsubscribe();
  }, []);
}
```

**Ventajas:**

- ✅ Sin formularios de login
- ✅ Sin gestión de contraseñas
- ✅ Cumple con Firebase Security Rules (`auth != null`)
- ✅ Preparado para migrar a Google/Email auth en el futuro

### Estructura de Datos Soportada

#### Formato V1 (Arduino)

```json
{
  "weather_stations": {
    "V1_STATION_TEST": {
      "info": {
        "name": "V1_STATION_TEST",
        "latitude": 37.3886,
        "longitude": -5.9823,
        "altitude": 50,
        "province": "Sevilla",
        "ine_code": 41091,
        "station_type": "Automatic",
        "version": "0.0.8.5"
      },
      "history": {
        "key1": {
          "datetime": "2025-11-15 11:52:23",
          "timestamp": 1763203490,
          "wind": {
            "speed_kmh": 15.2,
            "speed_knots": 8.2,
            "speed_ms": 4.2,
            "speed_read_ok": true,
            "direction": 180,
            "directionCardinal": "S",
            "direction_read_ok": true
          },
          "temperature": 22.5,
          "humidity": 65,
          "temp_hum_read_ok": true
        }
      }
    }
  }
}
```

**Notas:**

- Path principal: `/weather_stations/{id}/history`
- Timestamps: Soporta formato Arduino "YYYY-MM-DD HH:MM:SS"
- Fallback: Si no existe `history`, intenta `readings` (retrocompatibilidad)

### Manejo Inteligente de Datos

#### 1. Filtrado por Tiempo con Fallback

```typescript
// Si no hay datos en últimas 24h, muestra los más recientes
const cutoffTime = now - 24h;
let readings = allReadings.filter(r => r.timestamp >= cutoffTime);

if (readings.length === 0 && allReadings.length > 0) {
  // Fallback: muestra últimos datos disponibles
  readings = allReadings.slice(0, 500);
}
```

#### 2. Detección de Estado Offline

```typescript
// Si última lectura > 5 minutos, marca como offline
const isDataStale = (Date.now() - lastReading) > 5 * 60 * 1000;
const status = isDataStale ? 'offline' : 'online';
```

#### 3. Alertas de Sensores

- 🟡 **Amarillo**: Sensor reporta valor 0 (sensor offline/defectuoso)
- 🔵 **Azul**: Datos antiguos (estación no envía actualizaciones)

---

## 🗺️ Roadmap

### ✅ Fase 0: Foundation (COMPLETADO)

- [x] Proyecto base con Vite + React + TypeScript
- [x] UI completa con 9 componentes reutilizables
- [x] Mock data para desarrollo
- [x] Tests con Vitest + React Testing Library
- [x] Deploy a Firebase Hosting

### ✅ Fase 1: Firebase Integration (COMPLETADO)

- [x] Firebase Realtime Database conectado
- [x] FirebaseDataSource implementado
- [x] Firebase Anonymous Auth automático
- [x] Scripts de inspección y seed
- [x] Panel de debug para desarrollo
- [x] Manejo inteligente de datos antiguos
- [x] Alertas de sensores offline
- [x] Estado dinámico de estaciones
- [x] Filtrado por tiempo con fallback
- [x] Soporte completo para estructura Arduino V1

### ✅ Fase 2.1: Actualización en Tiempo Real (COMPLETADO)

- [x] Real-time subscriptions con `onValue()`
- [x] Hooks personalizados con cleanup automático
- [x] Migración de componentes a real-time
- [x] Re-suscripción automática al cambiar filtros
- [x] Sin memory leaks (patrón useEffect)
- [x] Latencia < 1 segundo verificada

### ⏳ Fase 2.2: Integración APIs Meteorológicas (EN PROGRESO)

- [x] **Firebase Functions para AEMET** ✅
  - Cloud Function scheduled (cada 6 horas)
  - Endpoint HTTP manual
  - Transformación de datos AEMET → app format
  - Soporte multi-estación con API keys independientes
  - Respeto límite 1 petición/minuto por key
- [ ] Cache inteligente de pronósticos
- [ ] Fallback entre APIs (redundancia)
- [ ] Comparativa: datos locales vs pronósticos
- [ ] Alertas meteorológicas automáticas
- [ ] Históricos de precisión de pronósticos

### 📋 Fase 3: Features Avanzadas

- [ ] PWA con offline support
- [ ] Notificaciones push para alertas de viento
- [ ] Comparativa entre estaciones
- [ ] Exportación de datos (CSV/JSON)
- [ ] Históricos más extensos (30 días, 1 año)
- [ ] Dashboard de administración
- [ ] Configuración de umbrales de alerta personalizados
- [ ] Widget embebible para otras webs

### 🚀 Fase 4: Optimización & Analytics

- [ ] Firebase Analytics integrado
- [ ] SEO optimizado
- [ ] Code splitting avanzado
- [ ] Performance monitoring
- [ ] Compression de imágenes
- [ ] Service Workers avanzados
- [ ] Métricas de uso y comportamiento

### 🔐 Fase 5: Auth Avanzado (Opcional)

- [ ] Google Sign-In
- [ ] Email/Password Auth
- [ ] Rutas protegidas (admin)
- [ ] Gestión de usuarios y permisos
- [ ] Favoritos y configuración personalizada

---

## 🆘 Troubleshooting

### "Permission denied" al cargar datos

**Causa:** Anonymous Auth no habilitado en Firebase Console

**Solución:**

1. Firebase Console > Authentication > Sign-in method
2. Habilita **Anonymous** ✅
3. Recarga la app

### "No stations found"

**Causa:** Estructura de datos incorrecta o vacía

**Solución:**

```bash
# Inspeccionar estructura
npm run inspect-firebase

# Si está vacía, poblar con datos de prueba
npm run seed-firebase
```

### App se queda en "Conectando..."

**Causa:** Credenciales Firebase incorrectas en `.env`

**Solución:**

1. Verifica variables `VITE_FIREBASE_*` en `.env`
2. Compara con Firebase Console > Project Settings
3. Recarga la app (Ctrl+R)

### FirebaseDebugPanel no aparece

**Causa:** Solo visible en modo desarrollo

**Solución:** Normal - ejecuta `npm run dev` (no `build` o `preview`)

### Gráfica muestra "Sensor sin lecturas válidas"

**Causa:** Todos los valores de viento = 0

**Solución:** Comportamiento esperado. Verifica:

- Arduino enviando datos correctos
- Firebase Console: `wind.speed_knots` no sea 0
- Si sensor defectuoso, es normal

### Estado "Offline" pero hay datos

**Causa:** Última lectura >5 minutos

**Solución:** Comportamiento esperado. Verifica Arduino enviando actualizaciones.

---

## 🤝 Contribución

Ver [CONTRIBUTING.md](CONTRIBUTING.md) para guía detallada.

### Quick Start

1. Fork del repositorio
2. Crea rama: `git checkout -b feature/nueva-feature`
3. Commit: `git commit -m 'feat: descripción'`
4. Push: `git push origin feature/nueva-feature`
5. Abre Pull Request

### Convenciones de Commits

- `feat:` Nueva característica
- `fix:` Corrección bug
- `docs:` Documentación
- `style:` Formato código
- `refactor:` Refactorización
- `test:` Tests
- `chore:` Tareas mantenimiento

---

## 📚 Documentación Adicional

- **[functions/README.md](functions/README.md)** - Firebase Cloud Functions (pronósticos AEMET)
- **[functions/QUICKSTART.md](functions/QUICKSTART.md)** - Guía rápida de despliegue de functions
- **[functions/STATION_CONFIG_EXAMPLE.md](functions/STATION_CONFIG_EXAMPLE.md)** - Ejemplo configuración estaciones
- **[DECISIONES_TECNICAS.md](DECISIONES_TECNICAS.md)** - Decisiones arquitectónicas del proyecto
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Guía completa de contribución

---

## 📊 Métricas del Proyecto

- **Líneas de código**: ~4,000
- **Componentes React**: 9
- **Páginas**: 3
- **Hooks personalizados**: 10+
- **Tests**: 15+
- **Build size**: ~1.3 MB JS (380 KB gzipped)
- **Lighthouse Score**: 95+ (Performance, A11y, Best Practices)

---

## 📝 Changelog

### v0.3.1-functions (Fase 2.2 - Nov 2025)

- ✅ **Firebase Cloud Functions**: Sistema automático de pronósticos AEMET
- ✅ **Scheduled Function**: Actualización cada 6 horas
- ✅ **HTTP Endpoint**: Actualización manual por estación o todas
- ✅ **Multi-API Key**: Soporte para API keys independientes por estación
- ✅ **Transformación de datos**: AEMET format → App format automático
- ✅ **Documentación completa**: README, QUICKSTART, y ejemplos
- 📊 **Métricas**: +800 LOC functions, 4 archivos doc

### v0.3.0-realtime (Fase 2.1 - Nov 2025)

- ✅ **Real-time subscriptions**: Migrado de `get()` a `onValue()`
- ✅ **Hooks real-time**: `useStationsRealtime`, `useStationRealtime`, `useReadingsRealtime`
- ✅ **Actualización automática**: Datos sincronizados sin recargar (<1s latencia)
- ✅ **Re-suscripción inteligente**: Al cambiar filtros se re-subscribe automáticamente
- ✅ **Cleanup automático**: Sin memory leaks
- 📊 **Métricas**: +488 LOC, 7 archivos modificados

### v0.2.1-firebase (Nov 2025)

- ✅ Filtrado inteligente por tiempo
- ✅ Estado dinámico estaciones (offline >5min)
- ✅ Alertas sensores con valor 0
- ✅ Fallback datos antiguos

### v0.2.0-firebase (Nov 2025)

- ✅ Firebase Realtime Database
- ✅ Anonymous Auth automático
- ✅ Scripts inspect/seed

### v0.1.0 (Fase 0)

- ✅ Proyecto base Vite + React + TS
- ✅ UI completa con mock data
- ✅ Deploy Firebase Hosting

### v0.0.1-migration (Fase Migración)

- ✅ Migración del Proyecto de Flutter

---

## 📞 Soporte

**Issues:** Reporta bugs o solicita features en GitHub Issues

**Documentación Técnica:** Ver documentación adicional arriba

---

**WindTrackr** - _Porque el viento no espera_ 🌬️

**Última actualización:** Noviembre 2025
**Versión:** 0.3.0-realtime
**Estado:** ✅ Production Ready
