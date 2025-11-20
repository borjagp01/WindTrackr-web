# Firebase Functions - WindTrackr

Este directorio contiene las Cloud Functions de Firebase para el proyecto WindTrackr.

## 📋 Funciones Disponibles

### 1. `updateForecasts` (Scheduled)

Función programada que se ejecuta automáticamente cada 6 horas para actualizar los pronósticos meteorológicos de todas las estaciones.

**Cron Schedule:** `0 */6 * * *` (00:00, 06:00, 12:00, 18:00 hora de Madrid)

**Funcionamiento:**
- Lee todas las estaciones de la base de datos
- Para cada estación que tenga `ine_code` y `aemet_api_key`:
  - Hace petición a la API de AEMET
  - Transforma los datos al formato de la aplicación
  - Guarda el pronóstico en `weather_stations/{stationId}/forecast`
- Respeta el límite de 1 petición/minuto de AEMET (espera 61 segundos entre peticiones)

**Estructura de datos guardada:**
```json
{
  "weather_stations": {
    "station-id": {
      "forecast": {
        "data": {
          "hourly": [
            {
              "timestamp": "2025-11-20T12:00:00",
              "windKts": 15,
              "gustKts": 22,
              "directionDeg": 270,
              "tempC": 18
            }
          ]
        },
        "lastUpdate": 1700485200000,
        "source": "AEMET"
      }
    }
  }
}
```

### 2. `updateForecastManual` (HTTP)

Endpoint HTTP para actualizar manualmente los pronósticos.

**URL:** `https://REGION-PROJECT_ID.cloudfunctions.net/updateForecastManual`

**Método:** POST

**Body (opcional):**
```json
{
  "stationId": "tarifa-los-lances"
}
```

Si se envía `stationId`, actualiza solo esa estación. Si no, actualiza todas.

**Respuesta exitosa:**
```json
{
  "status": "success",
  "stationId": "tarifa-los-lances",
  "timestamp": 1700485200000
}
```

## 🔧 Configuración de Estaciones

Para que una estación reciba pronósticos de AEMET, debe tener en su nodo `info`:

```json
{
  "weather_stations": {
    "station-id": {
      "info": {
        "ine_code": "11033",
        "aemet_api_key": "tu-api-key-de-aemet"
      }
    }
  }
}
```

### Obtener el código INE

El código INE es el identificador del municipio según el Instituto Nacional de Estadística:
- **Tarifa:** 11033
- **Algeciras:** 11004
- **Barbate:** 11007

Puedes buscar códigos INE en: https://www.ine.es/daco/daco42/codmun/codmunmapa.htm

### Obtener API Key de AEMET

1. Regístrate en: https://opendata.aemet.es/centrodedescargas/inicio
2. Solicita una API Key desde tu perfil
3. **Importante:** Cada API Key tiene límite de 1 petición/minuto

## 📦 Instalación

```bash
cd functions
npm install
```

## 🚀 Despliegue

```bash
# Desplegar todas las functions
firebase deploy --only functions

# Desplegar solo una función específica
firebase deploy --only functions:updateForecasts
firebase deploy --only functions:updateForecastManual
```

## 🧪 Testing Local

```bash
# Iniciar emuladores
firebase emulators:start

# La función HTTP estará disponible en:
# http://localhost:5001/PROJECT_ID/REGION/updateForecastManual
```

## 📊 Monitoreo

```bash
# Ver logs en tiempo real
firebase functions:log

# Ver logs de una función específica
firebase functions:log --only updateForecasts
```

## ⚙️ Variables de Entorno

Las API keys de AEMET deben almacenarse en la base de datos, NO como variables de entorno, ya que cada estación puede tener su propia key.

## 🔄 Flujo de Actualización

1. **Scheduler** dispara `updateForecasts` cada 6 horas
2. La función lee todas las estaciones de la BD
3. Para cada estación con configuración válida:
   - Hace petición a AEMET (paso 1: obtener URL de datos)
   - Descarga datos desde la URL (paso 2)
   - Transforma datos al formato de la app
   - Guarda en `forecast` con timestamp
4. Los clientes leen el pronóstico actualizado desde Realtime Database

## 📝 Notas Importantes

- **Límite de AEMET:** 1 petición/minuto por API key
  - La función espera 61 segundos entre estaciones
  - Con 5 estaciones = ~5 minutos de ejecución

- **Timeout:** Configurado a 540 segundos (9 minutos)
  - Suficiente para ~8 estaciones

- **Memoria:** 256MiB asignados

- **Datos históricos:** AEMET proporciona pronóstico para ~72 horas

- **Caché:** Los datos se guardan en la BD, los clientes no hacen peticiones directas a AEMET

## 🐛 Solución de Problemas

### Error: "Missing ine_code or aemet_api_key"

La estación no está configurada correctamente. Añade en la BD:
```json
{
  "weather_stations": {
    "station-id": {
      "info": {
        "ine_code": "11033",
        "aemet_api_key": "eyJhbGciOiJS..."
      }
    }
  }
}
```

### Error: "AEMET request failed: 429"

Has excedido el límite de peticiones. Espera al menos 1 minuto antes de reintentar.

### Error: "No forecast data returned"

- Verifica que el código INE sea correcto
- Verifica que la API key sea válida
- Revisa los logs de AEMET para más detalles

## 📚 Referencias

- [Documentación API AEMET](https://opendata.aemet.es/dist/index.html)
- [Firebase Functions v2](https://firebase.google.com/docs/functions)
- [Firebase Scheduled Functions](https://firebase.google.com/docs/functions/schedule-functions)
