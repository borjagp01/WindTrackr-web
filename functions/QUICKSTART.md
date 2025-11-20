# 🚀 Guía Rápida de Despliegue

## Paso 1: Instalar Dependencias de Functions

```bash
cd functions
npm install
```

## Paso 2: Configurar Estaciones en Firebase

Cada estación debe tener un nodo `info` con:

```json
{
  "weather_stations": {
    "tu-estacion-id": {
      "info": {
        "ine_code": "11033",
        "aemet_api_key": "eyJhbGc..."
      }
    }
  }
}
```

**Opción A - Firebase Console:**
1. Abre Firebase Console → Realtime Database
2. Navega a tu estación
3. Añade el nodo `info` manualmente

**Opción B - Script (Recomendado):**
```bash
cd functions
node setup-stations.js
```

## Paso 3: Desplegar Functions

```bash
# Desde la raíz del proyecto
firebase deploy --only functions
```

## Paso 4: Verificar

```bash
# Ver logs
firebase functions:log --only updateForecasts

# Probar manualmente
curl -X POST https://REGION-PROJECT_ID.cloudfunctions.net/updateForecastManual \
  -H "Content-Type: application/json" \
  -d '{"stationId": "tu-estacion-id"}'
```

## Paso 5: ✅ Listo!

La función `updateForecasts` se ejecutará automáticamente cada 6 horas.

Los datos se guardarán en: `weather_stations/{stationId}/forecast`

---

## ⚙️ Configuración Avanzada

### Cambiar Frecuencia de Actualización

Edita `functions/index.js`:

```javascript
export const updateForecasts = onSchedule(
  {
    schedule: '0 */3 * * *',  // Cada 3 horas
    // schedule: '0 0 * * *',  // Cada día a medianoche
    // ...
  }
)
```

### Añadir Más Estaciones

1. Crea la estación en Firebase
2. Añade el nodo `info` con `ine_code` y `aemet_api_key`
3. Ejecuta manualmente para probar:

```bash
curl -X POST https://REGION-PROJECT.cloudfunctions.net/updateForecastManual \
  -H "Content-Type: application/json" \
  -d '{"stationId": "nueva-estacion"}'
```

### Monitoreo

```bash
# Logs en tiempo real
firebase functions:log

# Logs de los últimos 30 minutos
firebase functions:log --only updateForecasts --since 30m
```

---

## 🔍 Troubleshooting

### No se actualiza el forecast

1. Verifica que la función esté desplegada:
   ```bash
   firebase functions:list
   ```

2. Revisa los logs:
   ```bash
   firebase functions:log --only updateForecasts
   ```

3. Verifica la configuración de la estación en Firebase Console

### Error 429 (Too Many Requests)

- Tienes demasiadas estaciones para una sola API key
- Solución: Usa API keys diferentes por estación

### Error 401 (Unauthorized)

- API key inválida o expirada
- Solicita una nueva en https://opendata.aemet.es

---

## 📊 Estructura de Datos

Una vez configurado, cada estación tendrá:

```json
{
  "weather_stations": {
    "tu-estacion": {
      "name": "...",
      "location": {...},
      "info": {
        "ine_code": "11033",
        "aemet_api_key": "..."
      },
      "forecast": {
        "data": {
          "hourly": [...]
        },
        "lastUpdate": 1700485200000,
        "source": "AEMET"
      },
      "current": {...},
      "history": {...}
    }
  }
}
```

Tu aplicación puede leer directamente de `forecast.data.hourly` 🎉
