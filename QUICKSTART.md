# 🚀 Guía de Inicio Rápido - WindTrackr

## Instalación y Ejecución en 3 Pasos

### 1️⃣ Instalar dependencias

```bash
npm install
```

### 2️⃣ Iniciar servidor de desarrollo

```bash
npm run dev
```

### 3️⃣ Abrir en navegador

Abre http://localhost:5173

---

## 📋 Comandos Útiles

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo con HMR

# Testing
npm run test             # Ejecutar tests
npm run test:watch       # Tests en modo watch

# Build
npm run build            # Build para producción
npm run preview          # Preview del build

# Calidad de Código
npm run lint             # ESLint
npm run format           # Prettier

# Datos Mock
node scripts/generateMockData.js  # Regenerar datos mock
```

---

## 🎯 Primera Vez que Ejecutas el Proyecto

### Qué Verás

1. **Página Principal (Home)**:
   - Selector de estaciones en la parte superior
   - Panel de información básica de la estación seleccionada
   - Gráfica de series temporales (24h por defecto)
   - Pronóstico de 24 horas
   - Brújula de viento con dirección y velocidad
   - Mapa con la estación seleccionada

2. **Navegación**:
   - **Home** (`/`): Vista principal con dashboard
   - **Mapa** (`/map`): Mapa completo con todas las estaciones
   - **Acerca de** (`/about`): Información del proyecto

### Probar Funcionalidades

✅ **Cambiar de Estación**
- Click en el selector superior
- Buscar por nombre
- Seleccionar una de las 5 estaciones disponibles

✅ **Cambiar Rango de Datos**
- En la gráfica, click en "24h" o "7d"
- Observa cómo cambia la escala temporal

✅ **Modo Oscuro**
- Click en el icono de sol/luna en la barra superior
- El tema se guarda en localStorage

✅ **Explorar el Mapa**
- Click en "Mapa" en la navegación
- Click en cualquier marker
- Click en "Ver estación" para ir a la página de detalle

✅ **Responsive**
- Redimensiona la ventana del navegador
- Prueba en móvil con las DevTools

---

## 📦 Estructura de Carpetas (Rápida)

```
src/
├── components/      # Componentes UI reutilizables
├── pages/           # Páginas de la app (rutas)
├── data/services/   # Capa de datos (MockDataSource)
├── types/           # TypeScript types
├── utils/           # Helpers y formatters
└── theme/           # Sistema de temas
```

---

## 🐛 Problemas Comunes

### El servidor no inicia

```bash
# Limpia node_modules y reinstala
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### No se ven los datos

1. Verifica que existan los archivos en `public/mock/`:
   ```bash
   ls public/mock/
   ```

2. Si no existen, genera los datos:
   ```bash
   node scripts/generateMockData.js
   ```

### Build falla

```bash
# Verifica que TypeScript compile
npm run build
```

Si hay errores de tipos, revisa los archivos indicados.

### Tests fallan

```bash
# Ejecuta tests con más detalle
npm run test -- --reporter=verbose
```

---

## 🎨 Personalización Rápida

### Cambiar Tema de Colores

Edita `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#TU_COLOR_PRINCIPAL',
        // ...
      }
    }
  }
}
```

### Añadir Nueva Estación Mock

Edita `public/mock/stations.json`:

```json
{
  "id": "nueva-estacion",
  "name": "Nueva Estación",
  "location": { "lat": 36.0, "lon": -5.6, "elevationM": 10 },
  "status": "online"
}
```

Luego regenera los datos:

```bash
node scripts/generateMockData.js
```

### Cambiar Idioma de Textos

Edita `src/i18n/config.ts`:

```typescript
const resources = {
  es: {
    translation: {
      'nav.home': 'Tu Texto Aquí',
      // ...
    }
  }
}
```

---

## 🚀 Próximos Pasos

1. **Explora el código**: Empieza por `src/pages/Home.tsx`
2. **Lee el README completo**: Más detalles sobre arquitectura
3. **Revisa DECISIONES_TECNICAS.md**: Entiende las decisiones de diseño
4. **Modifica un componente**: Prueba cambiar estilos o textos
5. **Añade un test**: Crea un test para un componente nuevo

---

## 📚 Recursos

- [Vite Docs](https://vitejs.dev/)
- [React Docs](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)
- [React Leaflet](https://react-leaflet.js.org/)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)

---

¿Tienes dudas? Revisa el README principal o abre un issue en GitHub.

**¡Feliz desarrollo!** 🌬️
