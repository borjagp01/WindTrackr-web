# Ejemplo de estructura de estación con configuración de AEMET

Esta es la estructura completa que debe tener una estación en Firebase Realtime Database para recibir pronósticos de AEMET.

## Estructura Completa

```json
{
  "weather_stations": {
    "tarifa-los-lances": {
      "name": "V1_STATION_TEST",
      "location": {
        "lat": 36.0153,
        "lon": -5.6108,
        "elevationM": 8
      },
      "description": "Estación en la playa de Los Lances",
      "provider": "internal",
      "status": "online",

      // ⚠️ AÑADIR ESTE NODO PARA AEMET
      "info": {
        "ine_code": "11033",
        "aemet_api_key": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0dUBlbWFpbC5jb20iLCJqdGkiOiI..."
      },

      // Este nodo se creará automáticamente por las Functions
      "forecast": {
        "data": {
          "hourly": [
            {
              "timestamp": "2025-11-20T12:00:00",
              "windKts": 15,
              "gustKts": 22,
              "directionDeg": 270,
              "tempC": 18
            },
            {
              "timestamp": "2025-11-20T13:00:00",
              "windKts": 18,
              "gustKts": 25,
              "directionDeg": 280,
              "tempC": 19
            }
          ]
        },
        "lastUpdate": 1700485200000,
        "source": "AEMET"
      },

      // Datos actuales (de tus sensores físicos)
      "current": {
        "datetime": "2025-11-20 12:00:00",
        "timestamp": 1700485200,
        "temperature": 18.5,
        "humidity": 65,
        "wind": {
          "speed_knots": 14,
          "direction": 270,
          "directionCardinal": "W"
        }
      },

      // Histórico de lecturas
      "history": {
        "1700481600": {
          "datetime": "2025-11-20 11:00:00",
          "timestamp": 1700481600,
          "temperature": 17.8,
          "humidity": 68,
          "wind": {
            "speed_knots": 12,
            "direction": 265,
            "directionCardinal": "W"
          }
        }
      }
    }
  }
}
```

## Códigos INE por Municipio (Cádiz)

Estos son los códigos que necesitas para el campo `ine_code`:

| Municipio | Código INE |
|-----------|------------|
| Tarifa | 11033 |
| Algeciras | 11004 |
| Barbate | 11007 |
| Los Barrios | 11012 |
| San Roque | 11031 |
| Vejer de la Frontera | 11038 |
| Cádiz | 11012 |

**Buscar más códigos:** https://www.ine.es/daco/daco42/codmun/codmunmapa.htm

## Cómo Obtener API Keys de AEMET

### Paso 1: Registro
1. Ve a https://opendata.aemet.es/centrodedescargas/inicio
2. Haz clic en "Regístrate"
3. Completa el formulario con tu email

### Paso 2: Solicitar API Key
1. Inicia sesión en tu cuenta
2. Ve a "Perfil" → "Solicitar API Key"
3. Recibirás la key por email (puede tardar unos minutos)

### Paso 3: Múltiples Keys (Recomendado)
Si tienes varias estaciones:
- Solicita una API Key diferente para cada estación
- AEMET limita a 1 petición/minuto por key
- Con keys separadas puedes actualizar más estaciones en paralelo

**Ejemplo de múltiples keys:**
```json
{
  "tarifa-los-lances": {
    "info": {
      "aemet_api_key": "eyJhbGc...key1..."
    }
  },
  "guadalmesi": {
    "info": {
      "aemet_api_key": "eyJhbGc...key2..."
    }
  },
  "valdevaqueros": {
    "info": {
      "aemet_api_key": "eyJhbGc...key3..."
    }
  }
}
```

## Añadir Configuración Manualmente

### Opción 1: Firebase Console
1. Abre Firebase Console
2. Ve a Realtime Database
3. Navega a `weather_stations/{tu-estacion-id}`
4. Añade un nuevo nodo hijo llamado `info`
5. Dentro de `info`, añade:
   - `ine_code` (string): "11033"
   - `aemet_api_key` (string): "tu-key-aqui"

### Opción 2: Script Automático
```bash
cd functions
node setup-stations.js
```

Este script te guiará para configurar todas tus estaciones.

## Verificar la Configuración

Después de añadir la configuración, puedes probar manualmente:

```bash
# Actualizar una estación específica
curl -X POST https://REGION-PROJECT_ID.cloudfunctions.net/updateForecastManual \
  -H "Content-Type: application/json" \
  -d '{"stationId": "tarifa-los-lances"}'

# O actualizar todas
curl -X POST https://REGION-PROJECT_ID.cloudfunctions.net/updateForecastManual \
  -H "Content-Type: application/json"
```

Luego revisa en Firebase Console que aparezca el nodo `forecast` bajo tu estación.

## Troubleshooting

### ❌ "Station missing ine_code or aemet_api_key"
- Verifica que hayas añadido el nodo `info` con ambos campos
- Asegúrate de que sean strings, no números

### ❌ "AEMET request failed: 401"
- Tu API key no es válida o ha expirado
- Solicita una nueva en la web de AEMET

### ❌ "AEMET request failed: 429"
- Has excedido el límite de peticiones (1/minuto)
- Espera al menos 60 segundos antes de reintentar
- Considera usar API keys diferentes por estación

### ❌ "No forecast data returned"
- El código INE puede ser incorrecto
- Verifica en la documentación de AEMET que el código existe
- Algunos municipios pequeños pueden no tener datos

## Estructura del Forecast Guardado

El pronóstico se guarda con esta estructura:

```typescript
interface ForecastData {
  data: {
    hourly: Array<{
      timestamp: string;      // ISO 8601: "2025-11-20T12:00:00"
      windKts: number;        // Velocidad del viento en nudos
      gustKts: number;        // Rachas en nudos
      directionDeg: number;   // Dirección 0-360 grados
      tempC: number | null;   // Temperatura en Celsius
    }>;
  };
  lastUpdate: number;  // Timestamp Unix (milisegundos)
  source: string;      // "AEMET"
}
```

Esta estructura es compatible con el tipo `Forecast` de tu aplicación.
