import { onSchedule } from 'firebase-functions/v2/scheduler';
import { onRequest } from 'firebase-functions/v2/https';
import { initializeApp } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';
import { logger } from 'firebase-functions';
import fetch from 'node-fetch';

initializeApp();

/**
 * Cloud Function que se ejecuta cada 6 horas para actualizar los pronósticos
 * de todas las estaciones meteorológicas desde AEMET.
 *
 * Cron: "0 *\/6 * * *" = cada 6 horas (00:00, 06:00, 12:00, 18:00)
 */
export const updateForecasts = onSchedule(
  {
    schedule: '0 */6 * * *',
    timeZone: 'Europe/Madrid',
    memory: '256MiB',
    timeoutSeconds: 540, // 9 minutos (máx para no exceder límites)
  },
  async (event) => {
    logger.info('Starting forecast update job');

    try {
      const db = getDatabase();
      const stationsRef = db.ref('weather_stations');

      // Leer todas las estaciones
      const stationsSnapshot = await stationsRef.once('value');
      const stations = stationsSnapshot.val();

      if (!stations) {
        logger.warn('No stations found in database');
        return;
      }

      const stationIds = Object.keys(stations);
      logger.info(`Found ${stationIds.length} stations to process`);

      // Procesar estaciones secuencialmente (limitación de 1 petición/minuto por API key)
      const results = {
        success: [],
        failed: [],
        skipped: [],
      };

      for (const stationId of stationIds) {
        const station = stations[stationId];

        // Verificar que la estación tenga la info necesaria
        if (!station.info?.ine_code || !station.info?.aemet_api_key) {
          logger.warn(`Station ${stationId} missing ine_code or aemet_api_key`, {
            hasIneCode: !!station.info?.ine_code,
            hasApiKey: !!station.info?.aemet_api_key,
          });
          results.skipped.push({
            stationId,
            reason: 'Missing configuration',
          });
          continue;
        }

        try {
          // Esperar 61 segundos entre peticiones para respetar límite de AEMET
          if (results.success.length > 0 || results.failed.length > 0) {
            logger.info(`Waiting 61 seconds before next AEMET request...`);
            await new Promise((resolve) => setTimeout(resolve, 61000));
          }

          // Obtener predicción horaria (próximas 72 horas)
          const hourlyForecast = await fetchAEMETHourlyForecast(
            station.info.ine_code,
            station.info.aemet_api_key
          );

          // Obtener predicción diaria (próximos 7 días)
          const weeklyForecast = await fetchAEMETDailyForecast(
            station.info.ine_code,
            station.info.aemet_api_key
          );

          if (hourlyForecast || weeklyForecast) {
            // Guardar ambos pronósticos en la base de datos
            const forecastData = {
              lastUpdate: Date.now(),
              source: 'AEMET',
            };

            if (hourlyForecast) {
              forecastData.data = {
                hourly: hourlyForecast.hourly,
              };
            }

            if (weeklyForecast) {
              if (!forecastData.data) forecastData.data = {};
              forecastData.data.weekly = weeklyForecast.daily;
            }

            await stationsRef.child(`${stationId}/forecast`).set(forecastData);

            results.success.push(stationId);
            logger.info(`Successfully updated forecast for station ${stationId}`);
          } else {
            results.failed.push({
              stationId,
              reason: 'No forecast data returned',
            });
          }
        } catch (error) {
          logger.error(`Error processing station ${stationId}:`, error);
          results.failed.push({
            stationId,
            reason: error.message,
          });
        }
      }

      logger.info('Forecast update job completed', results);

      return {
        status: 'completed',
        timestamp: Date.now(),
        ...results,
      };
    } catch (error) {
      logger.error('Fatal error in updateForecasts:', error);
      throw error;
    }
  }
);

/**
 * Función HTTP para actualizar manualmente el pronóstico de una estación específica
 * o todas las estaciones.
 *
 * Usage:
 * - POST /updateForecastManual
 * - Body: { "stationId": "optional-station-id" }
 */
export const updateForecastManual = onRequest(
  {
    memory: '256MiB',
    timeoutSeconds: 300,
  },
  async (req, res) => {
    // Solo aceptar POST
    if (req.method !== 'POST') {
      res.status(405).send('Method Not Allowed');
      return;
    }

    const { stationId } = req.body || {};

    try {
      const db = getDatabase();
      const stationsRef = db.ref('weather_stations');

      if (stationId) {
        // Actualizar solo una estación
        logger.info(`Manual update requested for station: ${stationId}`);

        const stationSnapshot = await stationsRef.child(stationId).once('value');
        const station = stationSnapshot.val();

        if (!station) {
          res.status(404).json({ error: 'Station not found' });
          return;
        }

        if (!station.info?.ine_code || !station.info?.aemet_api_key) {
          res.status(400).json({
            error: 'Station missing ine_code or aemet_api_key',
          });
          return;
        }

        const forecast = await fetchAEMETHourlyForecast(
          station.info.ine_code,
          station.info.aemet_api_key
        );

        const weeklyForecast = await fetchAEMETDailyForecast(
          station.info.ine_code,
          station.info.aemet_api_key
        );

        if (forecast || weeklyForecast) {
          const forecastData = {
            lastUpdate: Date.now(),
            source: 'AEMET',
          };

          if (forecast) {
            forecastData.data = {
              hourly: forecast.hourly,
            };
          }

          if (weeklyForecast) {
            if (!forecastData.data) forecastData.data = {};
            forecastData.data.weekly = weeklyForecast.daily;
          }

          await stationsRef.child(`${stationId}/forecast`).set(forecastData);

          logger.info(`Successfully updated forecast for station ${stationId}`);
          res.status(200).json({
            status: 'success',
            stationId,
            timestamp: Date.now(),
          });
        } else {
          res.status(500).json({ error: 'Failed to fetch forecast' });
        }
      } else {
        // Actualizar todas las estaciones
        logger.info('Manual update requested for all stations');

        const stationsSnapshot = await stationsRef.once('value');
        const stations = stationsSnapshot.val();

        if (!stations) {
          res.status(404).json({ error: 'No stations found' });
          return;
        }

        const stationIds = Object.keys(stations);
        const results = {
          success: [],
          failed: [],
          skipped: [],
        };

        for (const id of stationIds) {
          const station = stations[id];

          if (!station.info?.ine_code || !station.info?.aemet_api_key) {
            results.skipped.push({
              stationId: id,
              reason: 'Missing configuration',
            });
            continue;
          }

          try {
            // Esperar entre peticiones
            if (results.success.length > 0 || results.failed.length > 0) {
              await new Promise((resolve) => setTimeout(resolve, 61000));
            }

            const forecast = await fetchAEMETHourlyForecast(
              station.info.ine_code,
              station.info.aemet_api_key
            );

            const weeklyForecast = await fetchAEMETDailyForecast(
              station.info.ine_code,
              station.info.aemet_api_key
            );

            if (forecast || weeklyForecast) {
              const forecastData = {
                lastUpdate: Date.now(),
                source: 'AEMET',
              };

              if (forecast) {
                forecastData.data = {
                  hourly: forecast.hourly,
                };
              }

              if (weeklyForecast) {
                if (!forecastData.data) forecastData.data = {};
                forecastData.data.weekly = weeklyForecast.daily;
              }

              await stationsRef.child(`${id}/forecast`).set(forecastData);

              results.success.push(id);
            } else {
              results.failed.push({ stationId: id, reason: 'No data' });
            }
          } catch (error) {
            results.failed.push({ stationId: id, reason: error.message });
          }
        }

        logger.info('Manual update completed', results);
        res.status(200).json({
          status: 'completed',
          timestamp: Date.now(),
          ...results,
        });
      }
    } catch (error) {
      logger.error('Error in updateForecastManual:', error);
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * Realiza una petición a la API de AEMET con manejo de rate limiting (429).
 *
 * @param {string} url - URL de la API
 * @param {Object} options - Opciones de fetch
 * @param {number} retries - Número de reintentos restantes
 * @returns {Promise<Response>}
 */
async function fetchWithRetry(url, options = {}, retries = 2) {
  try {
    const response = await fetch(url, options);

    // Si es 429 (Too Many Requests), esperar y reintentar
    if (response.status === 429 && retries > 0) {
      const waitTime = 5 * 60 * 1000; // 5 minutos
      logger.warn(`Rate limit hit (429). Waiting ${waitTime / 1000} seconds before retry. Retries left: ${retries}`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      return fetchWithRetry(url, options, retries - 1);
    }

    return response;
  } catch (error) {
    if (retries > 0) {
      logger.warn(`Fetch error, retrying... Retries left: ${retries}`, error);
      await new Promise((resolve) => setTimeout(resolve, 5000)); // 5 segundos
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
}

/**
 * Obtiene el pronóstico meteorológico HORARIO de AEMET para un municipio específico.
 *
 * La API de AEMET funciona en dos pasos:
 * 1. Primera petición: devuelve una URL con los datos
 * 2. Segunda petición: obtener los datos de esa URL
 *
 * @param {string} ineCode - Código INE del municipio
 * @param {string} apiKey - API Key de AEMET para esta estación
 * @returns {Promise<Object|null>} - Datos del pronóstico horario o null si hay error
 */
async function fetchAEMETHourlyForecast(ineCode, apiKey) {
  try {
    logger.info(`Fetching AEMET HOURLY forecast for INE code: ${ineCode}`);

    // Paso 1: Obtener la URL de datos
    const metadataUrl = `https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/horaria/${ineCode}`;

    const metadataResponse = await fetchWithRetry(metadataUrl, {
      headers: {
        'api_key': apiKey,
      },
    });

    if (!metadataResponse.ok) {
      logger.error(`AEMET hourly metadata request failed: ${metadataResponse.status}`);
      return null;
    }

    const metadata = await metadataResponse.json();

    if (metadata.estado !== 200 || !metadata.datos) {
      logger.error('AEMET hourly metadata response invalid', metadata);
      return null;
    }

    // Paso 2: Obtener los datos del pronóstico
    const dataResponse = await fetchWithRetry(metadata.datos);

    if (!dataResponse.ok) {
      logger.error(`AEMET hourly data request failed: ${dataResponse.status}`);
      return null;
    }

    const forecastData = await dataResponse.json();

    // Transformar los datos de AEMET a nuestro formato
    const transformedForecast = transformAEMETHourlyData(forecastData);

    return transformedForecast;
  } catch (error) {
    logger.error('Error fetching AEMET hourly forecast:', error);
    return null;
  }
}

/**
 * Obtiene el pronóstico meteorológico DIARIO (semanal) de AEMET para un municipio específico.
 *
 * @param {string} ineCode - Código INE del municipio
 * @param {string} apiKey - API Key de AEMET para esta estación
 * @returns {Promise<Object|null>} - Datos del pronóstico diario o null si hay error
 */
async function fetchAEMETDailyForecast(ineCode, apiKey) {
  try {
    logger.info(`Fetching AEMET DAILY forecast for INE code: ${ineCode}`);

    // Paso 1: Obtener la URL de datos
    const metadataUrl = `https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/diaria/${ineCode}`;

    const metadataResponse = await fetchWithRetry(metadataUrl, {
      headers: {
        'api_key': apiKey,
      },
    });

    if (!metadataResponse.ok) {
      logger.error(`AEMET daily metadata request failed: ${metadataResponse.status}`);
      return null;
    }

    const metadata = await metadataResponse.json();

    if (metadata.estado !== 200 || !metadata.datos) {
      logger.error('AEMET daily metadata response invalid', metadata);
      return null;
    }

    // Paso 2: Obtener los datos del pronóstico
    const dataResponse = await fetchWithRetry(metadata.datos);

    if (!dataResponse.ok) {
      logger.error(`AEMET daily data request failed: ${dataResponse.status}`);
      return null;
    }

    const forecastData = await dataResponse.json();

    // Transformar los datos de AEMET a nuestro formato
    const transformedForecast = transformAEMETDailyData(forecastData);

    return transformedForecast;
  } catch (error) {
    logger.error('Error fetching AEMET daily forecast:', error);
    return null;
  }
}

/**
 * Transforma los datos HORARIOS de AEMET al formato esperado por la aplicación.
 *
 * Estructura de AEMET (predicción horaria):
 * - Array de periodos (días)
 * - Cada día contiene arrays horarios con:
 *   - velocidad del viento (km/h)
 *   - dirección del viento
 *   - temperatura (°C)
 *   - rachas de viento
 *
 * @param {Array} aemetData - Datos raw de AEMET
 * @returns {Object} - Datos transformados
 */
function transformAEMETHourlyData(aemetData) {
  if (!aemetData || !Array.isArray(aemetData) || aemetData.length === 0) {
    logger.warn('Invalid AEMET data structure');
    return { hourly: [] };
  }

  const hourly = [];

  // AEMET devuelve un array con info del municipio
  const municipioData = aemetData[0];

  if (!municipioData.prediccion?.dia) {
    logger.warn('No prediction days found in AEMET data');
    return { hourly: [] };
  }

  // Procesar cada día de predicción
  for (const dia of municipioData.prediccion.dia) {
    // La fecha viene en formato ISO completo: "2025-11-20T00:00:00"
    // Extraer solo la parte de fecha: "YYYY-MM-DD"
    const fechaCompleta = dia.fecha;
    const fecha = fechaCompleta.split('T')[0];

    // Arrays horarios (cada elemento tiene periodo y valor)
    const vientoArray = dia.vientoAndRachaMax || dia.viento || [];
    const temperaturaArray = dia.temperatura || [];

    // AEMET puede dar datos cada hora, cada 3 horas, etc.
    // Crear un mapa por periodo (hora) para combinar los datos
    const horasMap = new Map();

    // Procesar viento
    for (const viento of vientoArray) {
      if (!viento.periodo) continue;

      const hora = viento.periodo; // formato: "HH" (ej: "00", "01", "12")
      const timestamp = `${fecha}T${hora}:00:00`;

      if (!horasMap.has(hora)) {
        horasMap.set(hora, {
          timestamp,
          windKts: 0,
          gustKts: 0,
          directionDeg: 0,
          tempC: null,
        });
      }

      const entry = horasMap.get(hora);

      // Velocidad del viento (convertir de km/h a nudos)
      // AEMET devuelve arrays de strings: ["6"] o valores directos
      if (viento.velocidad !== undefined) {
        let velocidadKmh = Array.isArray(viento.velocidad)
          ? viento.velocidad[0]
          : viento.velocidad;
        velocidadKmh = parseFloat(velocidadKmh);
        if (!isNaN(velocidadKmh)) {
          entry.windKts = Math.round(velocidadKmh * 0.539957); // km/h a nudos
        }
      }

      // Rachas (convertir de km/h a nudos)
      // El campo puede llamarse 'racha' o no existir
      if (viento.racha !== undefined) {
        let rachaKmh = Array.isArray(viento.racha)
          ? viento.racha[0]
          : viento.racha;
        rachaKmh = parseFloat(rachaKmh);
        if (!isNaN(rachaKmh)) {
          entry.gustKts = Math.round(rachaKmh * 0.539957);
        }
      }

      // Dirección del viento (convertir de texto a grados)
      if (viento.direccion !== undefined) {
        const direccion = Array.isArray(viento.direccion)
          ? viento.direccion[0]
          : viento.direccion;
        entry.directionDeg = convertWindDirection(direccion);
      }
    }

    // Procesar temperatura
    for (const temp of temperaturaArray) {
      if (!temp.periodo) continue;

      const hora = temp.periodo;

      if (horasMap.has(hora)) {
        const entry = horasMap.get(hora);
        let tempValue = Array.isArray(temp.value) ? temp.value[0] : temp.value;
        tempValue = parseFloat(tempValue);
        if (!isNaN(tempValue)) {
          entry.tempC = tempValue;
        }
      }
    }

    // Agregar todas las horas al array final
    for (const entry of horasMap.values()) {
      hourly.push(entry);
    }
  }

  // Ordenar por timestamp y limitar a las próximas 72 horas
  hourly.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  const now = new Date();
  const filtered = hourly.filter((item) => new Date(item.timestamp) >= now);
  const limited = filtered.slice(0, 72);

  logger.info(`Transformed AEMET data: ${limited.length} hourly entries`);

  return { hourly: limited };
}

/**
 * Convierte la dirección del viento de AEMET (texto) a grados.
 *
 * Direcciones AEMET: N, NE, E, SE, S, SO, O, NO, C (calma)
 *
 * @param {string} direccion - Dirección textual
 * @returns {number} - Grados (0-360)
 */
function convertWindDirection(direccion) {
  const direcciones = {
    'N': 0,
    'NNE': 22.5,
    'NE': 45,
    'ENE': 67.5,
    'E': 90,
    'ESE': 112.5,
    'SE': 135,
    'SSE': 157.5,
    'S': 180,
    'SSO': 202.5,
    'SSW': 202.5,
    'SO': 225,
    'SW': 225,
    'OSO': 247.5,
    'WSW': 247.5,
    'O': 270,
    'W': 270,
    'ONO': 292.5,
    'WNW': 292.5,
    'NO': 315,
    'NW': 315,
    'NNO': 337.5,
    'NNW': 337.5,
    'C': 0, // Calma
  };

  const dir = direccion?.toUpperCase().trim();
  return direcciones[dir] ?? 0;
}

/**
 * Transforma los datos DIARIOS de AEMET al formato esperado por la aplicación.
 *
 * Estructura de AEMET (predicción diaria):
 * - Array de días (hasta 7 días)
 * - Cada día contiene:
 *   - temperatura (máxima, mínima)
 *   - viento (dirección, velocidad por periodos)
 *   - rachas máximas
 *   - estado del cielo
 *   - probabilidad de precipitación
 *
 * @param {Array} aemetData - Datos raw de AEMET
 * @returns {Object} - Datos transformados
 */
function transformAEMETDailyData(aemetData) {
  if (!aemetData || !Array.isArray(aemetData) || aemetData.length === 0) {
    logger.warn('Invalid AEMET daily data structure');
    return { daily: [] };
  }

  const daily = [];

  const municipioData = aemetData[0];

  if (!municipioData.prediccion?.dia) {
    logger.warn('No prediction days found in AEMET daily data');
    return { daily: [] };
  }

  // Procesar cada día de predicción
  for (const dia of municipioData.prediccion.dia) {
    const fechaCompleta = dia.fecha;
    const fecha = fechaCompleta.split('T')[0];

    // Extraer datos del día
    const dayData = {
      date: fecha,
      tempMax: dia.temperatura?.maxima || null,
      tempMin: dia.temperatura?.minima || null,
      windKts: 0,
      gustKts: 0,
      directionDeg: 0,
      skyState: null,
      precipProb: 0,
    };

    // Parsear temperatura
    if (dayData.tempMax !== null) {
      dayData.tempMax = parseFloat(dayData.tempMax);
    }
    if (dayData.tempMin !== null) {
      dayData.tempMin = parseFloat(dayData.tempMin);
    }

    // Obtener viento del periodo más representativo (12-24 o 00-24)
    const vientoArray = dia.viento || [];
    let vientoRepresentativo = vientoArray.find((v) => v.periodo === '00-24') ||
      vientoArray.find((v) => v.periodo === '12-24') ||
      vientoArray[0];

    if (vientoRepresentativo) {
      // Velocidad en km/h -> nudos
      let velocidad = vientoRepresentativo.velocidad;
      if (typeof velocidad === 'string') velocidad = parseFloat(velocidad);
      if (!isNaN(velocidad)) {
        dayData.windKts = Math.round(velocidad * 0.539957);
      }

      // Dirección
      if (vientoRepresentativo.direccion) {
        dayData.directionDeg = convertWindDirection(vientoRepresentativo.direccion);
      }
    }

    // Obtener racha máxima
    const rachaArray = dia.rachaMax || [];
    let rachaRepresentativa = rachaArray.find((r) => r.value && r.value !== '') ||
      rachaArray[0];

    if (rachaRepresentativa?.value && rachaRepresentativa.value !== '') {
      let racha = rachaRepresentativa.value;
      if (typeof racha === 'string') racha = parseFloat(racha);
      if (!isNaN(racha)) {
        dayData.gustKts = Math.round(racha * 0.539957);
      }
    }

    // Estado del cielo (tomar periodo 00-24 o el más representativo)
    const estadoCieloArray = dia.estadoCielo || [];
    let estadoRepresentativo = estadoCieloArray.find((e) => e.periodo === '00-24') ||
      estadoCieloArray.find((e) => e.periodo === '12-24') ||
      estadoCieloArray[0];

    if (estadoRepresentativo) {
      dayData.skyState = {
        code: estadoRepresentativo.value || null,
        description: estadoRepresentativo.descripcion || null,
      };
    }

    // Probabilidad de precipitación (tomar periodo 00-24 o el más representativo)
    const precipArray = dia.probPrecipitacion || [];
    let precipRepresentativa = precipArray.find((p) => p.periodo === '00-24') ||
      precipArray[0];

    if (precipRepresentativa?.value !== undefined) {
      let prob = precipRepresentativa.value;
      if (typeof prob === 'string') prob = parseFloat(prob);
      if (!isNaN(prob)) {
        dayData.precipProb = prob;
      }
    }

    daily.push(dayData);
  }

  logger.info(`Transformed AEMET daily data: ${daily.length} daily entries`);

  return { daily };
}
