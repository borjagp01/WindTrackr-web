# Script de Configuración de Estaciones

Este script te ayuda a añadir la configuración de AEMET a tus estaciones existentes.

## Uso

```bash
node add-aemet-config.js
```

El script:
1. Lee las estaciones actuales de Firebase
2. Para cada estación te pregunta:
   - Código INE del municipio
   - API Key de AEMET
3. Actualiza la configuración en Firebase

## Códigos INE comunes (Cádiz)

- **Tarifa:** 11033
- **Algeciras:** 11004
- **Barbate:** 11007
- **Los Barrios:** 11012
- **San Roque:** 11031

## Obtener API Keys

1. Regístrate en https://opendata.aemet.es/centrodedescargas/inicio
2. Desde tu perfil, solicita una API Key
3. Puedes solicitar múltiples keys si tienes varias estaciones

**Importante:** Cada API Key tiene límite de 1 petición/minuto
