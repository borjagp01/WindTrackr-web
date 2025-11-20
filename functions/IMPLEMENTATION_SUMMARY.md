# 📋 Resumen de Implementación - Firebase Functions AEMET

## ✅ Lo que se ha creado

### 1. Cloud Functions (2 funciones)

#### `updateForecasts` - Scheduled Function
- **Trigger:** Cron schedule cada 6 horas (00:00, 06:00, 12:00, 18:00)
- **Propósito:** Actualizar automáticamente pronósticos de todas las estaciones
- **Configuración:**
  - Memoria: 256MiB
  - Timeout: 540s (9 minutos)
  - Timezone: Europe/Madrid

#### `updateForecastManual` - HTTP Function
- **Trigger:** HTTP POST request
- **Propósito:** Actualización manual on-demand
- **Endpoints:**
  - Actualizar todas: `POST /updateForecastManual` (body vacío)
  - Actualizar una: `POST /updateForecastManual` con `{"stationId": "id"}`

### 2. Arquitectura de Datos

#### Entrada (Configuración de Estación)
```json
{
  "weather_stations": {
    "station-id": {
      "info": {
        "ine_code": "11033",           // Código INE del municipio
        "aemet_api_key": "eyJhbGc..."  // API Key de AEMET
      }
    }
  }
}
```

#### Salida (Pronóstico Generado)
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

### 3. Lógica de Transformación

**API AEMET → Formato App:**

1. **Petición en 2 pasos:**
   - Paso 1: GET metadata URL con API key
   - Paso 2: GET datos reales desde URL retornada

2. **Transformaciones aplicadas:**
   - Velocidad viento: km/h → nudos (knots)
   - Dirección: texto ("N", "NE", etc.) → grados (0-360)
   - Rachas: km/h → nudos
   - Temperatura: °C (sin conversión)
   - Timestamps: "YYYY-MM-DD HH" → ISO 8601

3. **Filtrado:**
   - Solo datos futuros (timestamp >= now)
   - Máximo 72 horas de pronóstico
   - Ordenados cronológicamente

### 4. Manejo de Límites AEMET

**Restricción:** 1 petición/minuto por API key

**Solución implementada:**
- Espera 61 segundos entre peticiones a la misma API key
- Procesa estaciones secuencialmente
- Logging detallado de cada petición
- Manejo de errores sin detener el proceso completo

**Ejemplo con 5 estaciones:**
- Tiempo total: ~5 minutos
- 1 petición cada 61 segundos
- Timeout function: 9 minutos (margen de seguridad)

### 5. Archivos Creados

```
functions/
├── package.json                    # Dependencias Node.js
├── .gitignore                      # Ignorar node_modules
├── index.js                        # Código principal (2 functions)
├── README.md                       # Documentación completa
├── QUICKSTART.md                   # Guía rápida despliegue
├── STATION_CONFIG_EXAMPLE.md       # Ejemplos configuración
├── IMPLEMENTATION_SUMMARY.md       # Este archivo
├── add-aemet-config.js            # Script helper (doc)
└── setup-stations.js               # Script setup interactivo
```

### 6. Documentación

- **README.md:** Documentación técnica completa con:
  - Descripción de functions
  - Configuración de estaciones
  - Obtención códigos INE y API keys
  - Instalación, despliegue, testing
  - Troubleshooting
  - Referencias

- **QUICKSTART.md:** Guía paso a paso para:
  - Deploy en 5 pasos
  - Configuración avanzada
  - Monitoreo y troubleshooting

- **STATION_CONFIG_EXAMPLE.md:** Ejemplos prácticos de:
  - Estructura completa de estación
  - Tabla códigos INE
  - Proceso obtención API keys
  - Configuración manual y automática

## 🔧 Configuración Requerida

### Por Estación

Cada estación que quiera recibir pronósticos debe tener:

1. **Código INE** - Identificador del municipio español
   - Ejemplo: Tarifa = 11033
   - Buscar en: https://www.ine.es

2. **API Key AEMET** - Credential de acceso API
   - Obtener en: https://opendata.aemet.es
   - Límite: 1 petición/minuto
   - Recomendado: API key diferente por estación

### En Firebase

```json
{
  "weather_stations": {
    "mi-estacion": {
      "info": {
        "ine_code": "11033",
        "aemet_api_key": "tu-key-aqui"
      }
    }
  }
}
```

## 🚀 Flujo de Ejecución

### Automático (cada 6 horas)

```
1. Scheduler Firebase → updateForecasts()
2. Leer todas las estaciones de Firebase
3. Para cada estación con ine_code + aemet_api_key:
   a. Esperar 61s (si no es la primera)
   b. Petición AEMET (2 pasos)
   c. Transformar datos
   d. Guardar en forecast/
4. Logging de resultados (success/failed/skipped)
```

### Manual (on-demand)

```
1. HTTP POST → updateForecastManual
2. Body opcional: {"stationId": "id"}
3. Proceso igual que automático
4. Respuesta JSON con resultados
```

## 📊 Resultados Esperados

### Estación Exitosa

```json
{
  "status": "success",
  "stationId": "tarifa-los-lances",
  "timestamp": 1700485200000
}
```

### Logs

```
✅ Found 5 stations to process
✅ Successfully updated forecast for station tarifa-los-lances
⏳ Waiting 61 seconds before next AEMET request...
✅ Successfully updated forecast for station guadalmesi
...
✅ Forecast update job completed
   Success: 5
   Failed: 0
   Skipped: 0
```

### Firebase Database

```
weather_stations/
  tarifa-los-lances/
    info/
      ine_code: "11033"
      aemet_api_key: "..."
    forecast/        ← CREADO AUTOMÁTICAMENTE
      data/
        hourly/
          [0]
            timestamp: "2025-11-20T12:00:00"
            windKts: 15
            ...
      lastUpdate: 1700485200000
      source: "AEMET"
```

## 🎯 Ventajas de la Implementación

1. **Automatización completa**
   - Cron schedule cada 6 horas
   - Sin intervención manual necesaria

2. **Escalable**
   - Soporta N estaciones
   - API keys independientes por estación
   - Procesamiento secuencial para respetar límites

3. **Resiliente**
   - Continúa si una estación falla
   - Logging detallado de errores
   - Skips automáticos si falta configuración

4. **Mantenible**
   - Código modular y documentado
   - Separación de concerns (fetch / transform / save)
   - Tests fáciles de implementar

5. **Monitoreado**
   - Firebase Functions logs integrados
   - Métricas de ejecución
   - Alertas configurables

## 🔜 Próximos Pasos

### Para Usar

1. ✅ Instalar dependencias: `cd functions && npm install`
2. ✅ Configurar estaciones con ine_code + aemet_api_key
3. ✅ Deploy: `firebase deploy --only functions`
4. ✅ Verificar primera ejecución en logs

### Mejoras Futuras (Opcional)

- [ ] Retry automático en caso de error temporal
- [ ] Cache Redis para evitar peticiones duplicadas
- [ ] Webhooks para notificar cambios significativos
- [ ] Dashboard analytics de pronósticos vs realidad
- [ ] Predicción ML basada en históricos
- [ ] Integración con más fuentes (OpenWeatherMap, etc.)

## 📚 Referencias

- **API AEMET:** https://opendata.aemet.es/dist/index.html
- **Firebase Functions v2:** https://firebase.google.com/docs/functions
- **Códigos INE:** https://www.ine.es/daco/daco42/codmun/codmunmapa.htm

---

**Implementado:** Noviembre 2025
**Estado:** ✅ Production Ready
**Versión:** 0.3.1-functions
