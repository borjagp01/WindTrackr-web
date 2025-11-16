# 🔥 Guía de Firebase Integration - WindTrackr

## 📋 Resumen

Esta guía explica cómo funciona la integración con Firebase Realtime Database en WindTrackr, cómo inspeccionar los datos del Arduino y cómo solucionar problemas comunes.

## 🎯 Arquitectura

### DataSource Abstraction Pattern

WindTrackr usa el patrón Repository/DataSource para desacoplar la UI de la fuente de datos:

```
┌─────────────┐
│     UI      │ (React Components)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Hooks     │ (useStations, useReadings, etc.)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ DataSource  │ (Interface)
└──────┬──────┘
       │
       ├─────────────┐
       ▼             ▼
┌──────────┐   ┌──────────────┐
│   Mock   │   │   Firebase   │
│ DataSrc  │   │  DataSource  │
└──────────┘   └──────────────┘
```

### Cambio Transparente

El cambio entre mock y Firebase es **completamente transparente** para la UI:

- **No se modifica ningún componente**
- **No se cambia ningún hook**
- **Solo se cambia una variable de entorno**: `VITE_DATA_SOURCE`

## 🔧 Configuración

### 1. Variables de Entorno

Copia `.env.example` a `.env` y configura:

```env
# Data source selector
VITE_DATA_SOURCE=firebase

# Firebase credentials (replace with your own)
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.region.firebasedatabase.app
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 2. Estructura de Firebase

La implementación espera esta estructura en `/weather_stations` (V1 - Actual):

```json
{
  "weather_stations": {
    "V1_STATION_TEST": {
      "info": {
        "name": "V1_STATION_TEST",
        "latitude": 37.3886,
        "longitude": -5.9823,
        "altitude": 50,
        "country": "España",
        "province": "Sevilla",
        "station_type": "Automatic",
        "operation_mode": "auto",
        "version": "0.0.8.5"
      },
      "current": {
        "datetime": "2025-11-15 11:52:22",
        "timestamp": 1763203942,
        "temperature": 18.5,
        "humidity": 65,
        "temp_hum_read_ok": true,
        "wind": {
          "speed_ms": 5.2,
          "speed_kmh": 18.72,
          "speed_knots": 10.1,
          "direction": 225,
          "directionCardinal": "SW",
          "speed_read_ok": true,
          "direction_read_ok": true
        }
      },
      "history": {
        "1763198746": {
          "datetime": "2025-11-15 10:25:46",
          "timestamp": 1763198746,
          "temperature": 18.5,
          "humidity": 65,
          "temp_hum_read_ok": true,
          "wind": {
            "speed_ms": 5.2,
            "speed_kmh": 18.72,
            "speed_knots": 10.1,
            "direction": 225,
            "directionCardinal": "SW",
            "speed_read_ok": true,
            "direction_read_ok": true
          }
        }
      },
      "OTA": {
        "enabled": false,
        "status": {
          "message": "Firmware actualizado correctamente",
          "status": "success",
          "timestamp": 1762794785,
          "version_current": "0.0.8.0"
        }
      }
    }
  }
}
```

**Campos principales:**
- `info/`: Metadata de la estación (ubicación, tipo, versión)
- `current/`: Lectura actual (snapshot del último dato)
- `history/`: Histórico de lecturas indexadas por timestamp Unix (segundos)
- `OTA/`: Estado de actualizaciones Over-The-Air (opcional)

**Notas importantes:**
- Los timestamps están en **segundos Unix** (no milisegundos)
- La clave `history` reemplaza a `readings` en versiones anteriores
- Los campos `temp_hum_read_ok`, `speed_read_ok` y `direction_read_ok` indican si el sensor funcionó correctamente

**Reglas de Seguridad:**

```json
{
  "rules": {
    "weather_stations": {
      ".read": "auth != null",
      "$stationId": {
        ".read": "auth != null",
        ".write": "auth != null"
      }
    }
  }
}
```

Estas reglas requieren autenticación (cualquier usuario autenticado). La autenticación anónima está habilitada para permitir acceso público mientras se mantiene control básico.
```

## 🛠️ Scripts de Utilidad

### Inspeccionar Estructura (inspect-firebase)

```bash
npm run inspect-firebase
```

Este script:
- Se conecta a Firebase
- Muestra las claves del nivel raíz
- Lista todas las estaciones encontradas
- Muestra una lectura de ejemplo
- Muestra un pronóstico de ejemplo

**Útil para**:
- Verificar que el Arduino está subiendo datos
- Ver la estructura real de los datos
- Diagnosticar problemas de formato

### Poblar con Datos Mock (seed-firebase)

```bash
npm run seed-firebase
```

Este script:
- Lee los archivos JSON de `/public/mock/`
- Sube las 5 estaciones mock
- Sube lecturas de 24h para cada estación
- Sube pronósticos para cada estación

**Útil para**:
- Testing inicial sin Arduino
- Desarrollo sin datos reales
- Demo de la aplicación

⚠️ **ADVERTENCIA**: Esto **sobrescribirá** los datos existentes en Firebase.

## 🔍 Panel de Debug

En modo desarrollo (`npm run dev`), verás un panel en la esquina inferior derecha:

```
🔧 Firebase Debug Panel
─────────────────────
Data Source: firebase
Status: ● Connected
Stations: 5

Refresh page to update status
```

Este panel muestra:
- Fuente de datos actual (mock/firebase)
- Estado de conexión
- Número de estaciones encontradas
- Errores de conexión si los hay

El panel **solo aparece en desarrollo**, no en producción.

## 📊 FirebaseDataSource Implementation

### Métodos Implementados

#### `getStations(): Promise<Station[]>`

- **Path**: `/stations`
- **Retorno**: Array de estaciones
- Convierte objeto a array si es necesario
- Retorna array vacío si no hay datos

#### `getStation(id: string): Promise<Station>`

- **Path**: `/stations/{id}`
- **Retorno**: Estación específica
- Lanza error si no existe

#### `getReadings(id: string, range: '24h'|'7d'): Promise<Reading[]>`

- **Path**: `/readings/{id}`
- **Query**: Filtra por timestamp usando `orderByChild()`, `startAt()`, `endAt()`
- **Range 24h**: Últimas 24 horas
- **Range 7d**: Últimos 7 días
- Retorna array ordenado cronológicamente
- Soporta timestamps en milisegundos o ISO string

#### `getForecast(id: string): Promise<Forecast>`

- **Path**: `/forecasts/{id}`
- **Retorno**: Pronóstico de 48 horas
- Retorna pronóstico vacío si no hay datos (no lanza error)

### Características

- ✅ **Error handling robusto**: Logs detallados en consola
- ✅ **Flexibilidad de formato**: Soporta arrays u objetos
- ✅ **Timestamps flexibles**: Milisegundos o ISO strings
- ✅ **Graceful degradation**: Retorna arrays vacíos en vez de fallar

## 🔄 Adaptación a Arduino

Si tu Arduino usa una estructura diferente, puedes adaptar `FirebaseDataSource.ts`:

### Ejemplo: Estructura Flat

Si el Arduino guarda lecturas en una estructura plana:

```json
{
  "readings": [
    { "stationId": "x", "timestamp": 123, "windKts": 18 },
    { "stationId": "x", "timestamp": 124, "windKts": 20 }
  ]
}
```

Adapta `getReadings()`:

```typescript
async getReadings(id: string, range: ReadingRange): Promise<Reading[]> {
  const dbRef = ref(db, 'readings');
  const snapshot = await get(dbRef);

  if (!snapshot.exists()) return [];

  const allReadings = Object.values(snapshot.val());

  // Filter by station and time range
  const startTime = range === '24h' ? Date.now() - 86400000 : Date.now() - 604800000;

  return allReadings
    .filter(r => r.stationId === id && r.timestamp >= startTime)
    .sort((a, b) => a.timestamp - b.timestamp);
}
```

## 🧪 Testing

### Test con Mock Data

```bash
# 1. Cambiar a mock
VITE_DATA_SOURCE=mock

# 2. Ejecutar
npm run dev
```

### Test con Firebase

```bash
# 1. Asegurar que Firebase tiene datos
npm run seed-firebase

# 2. Cambiar a firebase
VITE_DATA_SOURCE=firebase

# 3. Ejecutar
npm run dev
```

### Test con Arduino Real

```bash
# 1. Verificar que Arduino está subiendo datos
npm run inspect-firebase

# 2. Ejecutar app
npm run dev

# 3. Abrir DevTools y revisar:
# - Console logs: "Using Firebase data source"
# - Network tab: Llamadas a Firebase
# - Panel de debug: Status y número de estaciones
```

## 🐛 Troubleshooting

### Error: "No stations found in Firebase"

**Causa**: Base de datos vacía o ruta incorrecta.

**Solución**:
1. Ejecuta `npm run inspect-firebase` para ver la estructura
2. Si está vacía, ejecuta `npm run seed-firebase`
3. Si tiene datos pero en otra ruta, adapta `FirebaseDataSource.ts`

### Error: "Failed to fetch stations: Permission denied"

**Causa**: Reglas de Firebase no permiten lectura.

**Solución**:
1. Abre Firebase Console
2. Ve a Realtime Database > Rules
3. Configura reglas de lectura:

```json
{
  "rules": {
    "stations": { ".read": true },
    "readings": { ".read": true },
    "forecasts": { ".read": true }
  }
}
```

⚠️ Para producción, usa reglas más restrictivas con autenticación.

### Panel de debug muestra "Disconnected"

**Causa**: Credenciales incorrectas o red.

**Solución**:
1. Verifica las variables en `.env`
2. Revisa console de DevTools para errores
3. Verifica que Firebase project existe
4. Revisa reglas de CORS en Firebase Console

### Lecturas no se filtran correctamente por tiempo

**Causa**: Formato de timestamp incompatible.

**Solución**:
1. Ejecuta `npm run inspect-firebase`
2. Verifica formato de timestamp en la muestra
3. Adapta el código en `getReadings()` según formato:

```typescript
// Para timestamps en segundos (Unix time)
const timestamp = reading.timestamp * 1000;

// Para timestamps como string ISO
const timestamp = new Date(reading.timestamp).getTime();
```

## 🚀 Próximos Pasos (Fase 1 continuación)

- [ ] **Firebase Auth**: Login con Google y Email/Password
- [ ] **Real-time subscriptions**: Usar `onValue()` para actualizaciones live
- [ ] **Protected routes**: Rutas que requieren autenticación
- [ ] **User profiles**: Guardar estaciones favoritas por usuario

## 📚 Recursos

- [Firebase Realtime Database Docs](https://firebase.google.com/docs/database)
- [Firebase Web SDK](https://firebase.google.com/docs/web/setup)
- [Firebase Security Rules](https://firebase.google.com/docs/database/security)

---

**Documentación actualizada**: Enero 2024 - Fase 1 en progreso
