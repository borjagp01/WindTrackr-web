# Decisiones Técnicas - WindTrackr

Este documento detalla las decisiones técnicas tomadas durante el desarrollo de WindTrackr y las justificaciones detrás de ellas.

## 1. Stack Principal

### ✅ Vite + React + TypeScript

**Decisión**: Usar Vite como build tool en lugar de Create React App o Next.js

**Justificación**:
- **Velocidad**: Vite es significativamente más rápido que webpack (usado por CRA)
- **HMR instantáneo**: Hot Module Replacement casi inmediato
- **Build optimizado**: Usa esbuild para builds rápidos
- **SPA pura**: No necesitamos SSR (Next.js sería overkill para Fase 0)
- **Flexibilidad**: Perfecto para desplegar en Firebase Hosting como SPA estática

## 2. Estado: Zustand vs React Query

### ✅ Zustand para estado global + Custom Hooks para data fetching

**Decisión**: Usar Zustand en lugar de React Query

**Justificación**:
- **Simplicidad**: Zustand es extremadamente ligero (~1KB) y simple
- **No necesitamos cache complejo**: En Fase 0 con mock data, no hay problemas de sincronización
- **Preparado para Firebase**: Firebase Realtime Database tiene su propio sistema de subscripciones
- **Menos dependencias**: Custom hooks son suficientes para fetch básico
- **Performance**: Sin overhead de React Query para un caso de uso simple

**Alternativa considerada**: React Query sería mejor si:
- Tuviéramos múltiples endpoints REST
- Necesitáramos invalidación de cache compleja
- Fuéramos a hacer polling extensivo

**Conclusión**: Para Fase 0 y futuro Firebase Realtime DB, Zustand + hooks es más adecuado.

## 3. Estilos: Tailwind CSS

### ✅ Tailwind CSS 4.x

**Decisión**: Tailwind CSS sobre CSS-in-JS (styled-components, emotion) o CSS Modules

**Justificación**:
- **Velocidad de desarrollo**: Utility-first permite prototipar rápidamente
- **Consistencia**: Sistema de diseño built-in (spacing, colors, etc.)
- **Dark mode**: Soporte nativo con `dark:` prefix
- **Build-time**: Purge CSS automático = bundles pequeños
- **Performance**: No runtime overhead (vs CSS-in-JS)
- **Tailwind v4**: Nueva versión con mejor performance y DX

**Alternativa considerada**: CSS-in-JS permitiría styles dinámicos más fáciles, pero:
- Añade runtime overhead
- Más complejo para temas
- No necesitamos estilos tan dinámicos

## 4. Gráficas: Recharts

### ✅ Recharts 3.x

**Decisión**: Recharts sobre Chart.js, Victory, o D3

**Justificación**:
- **React-first**: Componentes nativos de React (no wrappers)
- **Declarativo**: Fácil de entender y mantener
- **Responsive**: Out-of-the-box responsive
- **Customizable**: Suficiente para nuestras necesidades
- **Bundle size**: Aceptable (~100KB minified)
- **SVG-based**: Mejor para interactividad

**Alternativa considerada**:
- **Chart.js**: Más performante con muchos puntos, pero menos React-friendly
- **D3**: Muy potente pero overkill y curva de aprendizaje alta
- **Victory**: Similar a Recharts pero menos popular

**Conclusión**: Recharts es el sweet spot entre facilidad de uso y features.

## 5. Mapas: React Leaflet

### ✅ React Leaflet + OpenStreetMap

**Decisión**: Leaflet sobre Google Maps o Mapbox

**Justificación**:
- **Open Source**: Sin costos de API
- **OpenStreetMap**: Tiles gratuitos
- **Lightweight**: Más ligero que Mapbox GL
- **Suficiente**: No necesitamos features avanzadas de Mapbox
- **React Leaflet**: Wrapper oficial bien mantenido

**Alternativa considerada**:
- **Google Maps**: Requiere API key y puede tener costos
- **Mapbox**: Excelente pero overkill para nuestro caso
- **MapLibre**: Bueno pero Leaflet tiene mejor ecosistema React

## 6. Router: React Router v7

### ✅ React Router 7 (latest)

**Decisión**: React Router estándar

**Justificación**:
- **Standard de facto**: La solución más común para SPA React
- **Flexible**: Perfecto para nuestra estructura de páginas
- **TypeScript**: Excelente soporte de tipos
- **v7**: Nueva versión con mejoras de performance
- **No necesitamos file-based routing**: TanStack Router sería overkill

## 7. i18n: react-i18next

### ✅ react-i18next

**Decisión**: react-i18next sobre react-intl

**Justificación**:
- **Popular**: Más descargas y mejor mantenida
- **Flexible**: Interpolación, plurales, contextos
- **Bundle size**: Similar a react-intl
- **TypeScript**: Buen soporte de tipos
- **Lazy loading**: Soporte para cargar traducciones bajo demanda (futuro)

**Alternativa considerada**: react-intl (de FormatJS) es también excelente, pero:
- API más verbosa
- Menos flexible para casos complejos
- Similar en tamaño

## 8. Testing: Vitest

### ✅ Vitest + React Testing Library

**Decisión**: Vitest sobre Jest

**Justificación**:
- **Vite-native**: Comparte config con Vite
- **Más rápido**: Significativamente más rápido que Jest
- **API compatible con Jest**: Fácil migración si es necesario
- **ESM nativo**: Sin problemas con módulos ES
- **UI mode**: Vitest UI es excelente para debugging

**Alternativa considerada**: Jest es el standard, pero:
- Más lento
- Problemas con ESM
- Config separada de Vite

## 9. Arquitectura de Datos

### ✅ Patrón Repository con DataSource Interface

**Decisión**: Abstracción de datos desde el inicio

**Justificación**:
- **Preparación para Firebase**: Permite cambiar de mock a Firebase sin tocar UI
- **Testabilidad**: Fácil mockear en tests
- **Clean Architecture**: Separación de concerns
- **Flexibilidad**: Podemos añadir múltiples sources (APIs externas, etc.)

**Implementación**:
```typescript
// Interface
interface DataSource {
  getStations(): Promise<Station[]>;
  // ...
}

// Factory
function getDataSource() {
  return env.DATA_SOURCE === 'firebase'
    ? new FirebaseDataSource()
    : new MockDataSource();
}
```

## 10. Mock Data Generation

### ✅ Script Node.js para generar JSON

**Decisión**: Generar datos mock con script en lugar de MSW

**Justificación**:
- **Simplicidad**: JSON estático es más simple para Fase 0
- **Performance**: Fetch de JSON es más rápido que MSW interceptors
- **Debugging**: Más fácil inspeccionar datos
- **Deploy**: JSON se sirve directamente desde Firebase Hosting

**Alternativa considerada**: MSW (Mock Service Worker) sería mejor si:
- Necesitáramos simular estados de error complejos
- Tuviéramos lógica de backend (autenticación, validación)
- Quisiéramos testing E2E más robusto

**Conclusión**: Para datos estáticos, JSON es suficiente.

## 11. Tema (Dark Mode)

### ✅ Zustand + Tailwind dark: class

**Decisión**: Store de Zustand con localStorage y Tailwind class-based dark mode

**Justificación**:
- **Persistencia**: localStorage guarda preferencia
- **SSR-friendly**: Aunque no usamos SSR ahora, preparado para futuro
- **Control total**: Podemos sincronizar con preferencias del sistema
- **Tailwind integration**: `dark:` prefix funciona automáticamente

**Implementación**:
```typescript
// Store con persist middleware
const useThemeStore = create(persist(
  (set) => ({ theme: 'light', toggleTheme: () => ... }),
  { name: 'windtrackr-theme' }
));

// CSS
.dark .element { /* dark styles */ }
```

## 12. Firebase Hosting Configuration

### ✅ SPA rewrites + Cache headers optimizados

**Decisión**: Configuración específica para SPA con cache aggressive

**Justificación**:
- **SPA routing**: Rewrite all routes a /index.html
- **Cache de assets**: 1 año para JS/CSS/images (tienen hash en nombre)
- **No cache de HTML**: index.html siempre fresh
- **CDN global**: Firebase Hosting tiene CDN automático

```json
{
  "rewrites": [{ "source": "**", "destination": "/index.html" }],
  "headers": [
    { "source": "**/*.js", "headers": [{ "Cache-Control": "max-age=31536000" }] }
  ]
}
```

## 13. TypeScript Configuration

### ✅ Strict mode + Path aliases

**Decisión**: TypeScript estricto desde el inicio

**Justificación**:
- **Type safety**: Catch bugs en compile time
- **Better DX**: Autocomplete y refactoring
- **Path aliases**: `@/` para imports limpios
- **Build performance**: `verbatimModuleSyntax` para builds rápidos

```json
{
  "strict": true,
  "noUnusedLocals": true,
  "paths": { "@/*": ["./src/*"] }
}
```

## Decisiones para Futuro (Post-Fase 0)

### Firebase Realtime Database vs Firestore

**Recomendación**: Realtime Database

**Justificación**:
- **Real-time**: Mejor para datos de viento que cambian constantemente
- **Simpler**: Estructura de datos más simple
- **Pricing**: Más barato para lecturas frecuentes
- **WebSockets**: Conexión persistente eficiente

**Firestore sería mejor si**: Necesitáramos queries complejas o relaciones

### PWA Implementation

**Recomendación**: Workbox con Vite PWA plugin

**Justificación**:
- **Vite integration**: Plugin oficial `vite-plugin-pwa`
- **Precaching**: Assets automáticamente cached
- **Offline**: Estrategia network-first con fallback

### Code Splitting

**Recomendación**: Route-based splitting

```typescript
const Home = lazy(() => import('./pages/Home'));
const Station = lazy(() => import('./pages/Station'));
```

**Justificación**:
- **Initial load**: Reduce bundle inicial
- **Lazy load**: Carga páginas bajo demanda
- **Simple**: Vite maneja automáticamente

---

## Resumen de Decisiones Clave

| Aspecto | Decisión | Alternativa | Justificación |
|---------|----------|-------------|---------------|
| Build Tool | **Vite** | Next.js, CRA | Velocidad, SPA pura |
| Estado | **Zustand** | React Query | Simplicidad, tamaño |
| Estilos | **Tailwind** | CSS-in-JS | Velocidad dev, no runtime |
| Gráficas | **Recharts** | Chart.js | React-first, declarativo |
| Mapas | **Leaflet** | Mapbox | Open source, suficiente |
| Testing | **Vitest** | Jest | Velocidad, Vite-native |
| i18n | **react-i18next** | react-intl | Flexibilidad, popular |
| Data Layer | **Repository** | Direct fetch | Abstracción, testable |

---

**Última actualización**: Noviembre 2024
