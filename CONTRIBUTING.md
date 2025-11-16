# 🤝 Guía de Contribución - WindTrackr

¡Gracias por tu interés en contribuir a WindTrackr! Este documento te guiará en el proceso.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [Cómo Contribuir](#cómo-contribuir)
- [Configuración del Entorno](#configuración-del-entorno)
- [Flujo de Trabajo](#flujo-de-trabajo)
- [Estándares de Código](#estándares-de-código)
- [Testing](#testing)
- [Documentación](#documentación)

## 📜 Código de Conducta

Este proyecto adhiere a un código de conducta básico:

- Sé respetuoso y considerado
- Acepta críticas constructivas
- Enfócate en lo mejor para la comunidad
- Muestra empatía hacia otros miembros

## 🚀 Cómo Contribuir

### Tipos de Contribuciones Bienvenidas

- 🐛 **Bug reports**: Reporta problemas o errores
- ✨ **Feature requests**: Sugiere nuevas funcionalidades
- 📝 **Documentación**: Mejora o traduce documentación
- 🎨 **UI/UX**: Mejoras visuales o de experiencia
- ⚡ **Performance**: Optimizaciones de rendimiento
- 🧪 **Tests**: Añade o mejora tests

### Antes de Empezar

1. Revisa los [issues existentes](../../issues) para evitar duplicados
2. Para cambios mayores, abre un issue primero para discutir
3. Para bug fixes, puedes proceder directamente con un PR

## 🛠️ Configuración del Entorno

### 1. Fork y Clone

```bash
# Fork el repositorio en GitHub
# Luego clona tu fork
git clone https://github.com/TU-USUARIO/estacion-meteorologica.git
cd estacion-meteorologica
```

### 2. Configurar Upstream

```bash
git remote add upstream https://github.com/ORIGINAL-OWNER/estacion-meteorologica.git
git fetch upstream
```

### 3. Instalar Dependencias

```bash
npm install
```

### 4. Verificar Configuración

```bash
npm run dev     # Debe iniciar sin errores
npm run test    # Debe pasar todos los tests
npm run lint    # Debe pasar sin warnings
```

## 🔄 Flujo de Trabajo

### 1. Crear una Rama

```bash
# Actualiza main
git checkout main
git pull upstream main

# Crea una rama descriptiva
git checkout -b feature/nombre-descriptivo
# o
git checkout -b fix/descripcion-del-bug
```

### Convención de Nombres de Ramas

- `feature/` - Nueva funcionalidad
- `fix/` - Corrección de bugs
- `docs/` - Cambios en documentación
- `refactor/` - Refactorización de código
- `test/` - Añadir o mejorar tests
- `chore/` - Tareas de mantenimiento

### 2. Hacer Cambios

- Escribe código limpio y bien documentado
- Sigue los estándares de código (ver abajo)
- Añade tests para nuevas funcionalidades
- Actualiza documentación si es necesario

### 3. Commit

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Formato
<type>(<scope>): <description>

# Ejemplos
feat(stations): add wind rose chart
fix(map): correct marker positioning
docs(readme): update installation steps
style(theme): improve dark mode colors
refactor(utils): simplify date formatting
test(units): add tests for wind direction
chore(deps): update dependencies
```

**Types permitidos**:
- `feat`: Nueva funcionalidad
- `fix`: Bug fix
- `docs`: Documentación
- `style`: Cambios de estilo/formato
- `refactor`: Refactorización
- `test`: Tests
- `chore`: Mantenimiento
- `perf`: Mejoras de performance

### 4. Push

```bash
git push origin feature/nombre-descriptivo
```

### 5. Pull Request

1. Ve a tu fork en GitHub
2. Click en "Pull Request"
3. Selecciona tu rama
4. Llena el template de PR:
   - Descripción clara del cambio
   - Relaciona issues si aplica
   - Screenshots si hay cambios visuales
   - Checklist completado

## 📝 Estándares de Código

### TypeScript

- **Strict mode**: Siempre habilitado
- **No `any`**: Usa tipos específicos o `unknown`
- **Interfaces sobre Types**: Para objetos
- **Naming**:
  - PascalCase: Componentes, interfaces, types
  - camelCase: variables, funciones
  - UPPER_CASE: constantes globales

```typescript
// ✅ Bien
interface Station {
  id: string;
  name: string;
}

const fetchStation = async (id: string): Promise<Station> => {
  // ...
};

// ❌ Mal
const FetchStation = async (id: any) => {
  // ...
};
```

### React

- **Functional Components**: Siempre
- **Hooks**: Sigue reglas de hooks
- **Props**: Usa TypeScript interfaces
- **Naming**: PascalCase para componentes

```typescript
// ✅ Bien
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

export function Button({ onClick, children }: ButtonProps) {
  return <button onClick={onClick}>{children}</button>;
}

// ❌ Mal
export const button = (props) => {
  return <button>{props.children}</button>;
};
```

### Imports

- Usa path aliases `@/`
- Ordena imports: React → Third-party → Local
- Usa imports con nombre cuando sea posible

```typescript
// ✅ Bien
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStations } from '@/features/stations/hooks';
import type { Station } from '@/types';

// ❌ Mal
import { useStations } from '../../features/stations/hooks';
import type { Station } from '../../types';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
```

### Estilos (Tailwind)

- Mobile-first: Empieza sin breakpoints
- Dark mode: Usa `dark:` prefix
- Reutiliza clases: Extrae componentes si repites

```tsx
// ✅ Bien
<div className="p-4 md:p-6 lg:p-8 bg-white dark:bg-gray-800">

// ❌ Mal
<div className="lg:p-8 md:p-6 p-4 bg-white">  {/* orden incorrecto */}
```

## 🧪 Testing

### Escribir Tests

```typescript
import { describe, it, expect } from 'vitest';

describe('ComponentName', () => {
  it('should render correctly', () => {
    // Arrange
    const props = { ... };

    // Act
    render(<Component {...props} />);

    // Assert
    expect(screen.getByText('...')).toBeInTheDocument();
  });
});
```

### Ejecutar Tests

```bash
# Todos los tests
npm run test

# Watch mode
npm run test:watch

# Con coverage
npm run test -- --coverage
```

### Requisitos

- ✅ Tests para nueva funcionalidad
- ✅ Tests pasan antes de hacer PR
- ✅ Coverage no disminuye (ideal)

## 📚 Documentación

### Código

- **JSDoc**: Para funciones públicas/complejas
- **Comentarios**: Cuando la lógica no es obvia
- **README**: Actualiza si cambias setup/config

```typescript
/**
 * Calculate wind speed average from readings
 * @param readings - Array of wind readings
 * @returns Average wind speed in knots
 */
export function calculateAverage(readings: Reading[]): number {
  // Implementation
}
```

### Documentación de Usuario

- Actualiza **README.md** si cambias:
  - Instalación
  - Scripts
  - Configuración
- Actualiza **QUICKSTART.md** si cambias:
  - Primeros pasos
  - Comandos básicos
- Añade ejemplos cuando sea útil

## ✅ Checklist Antes de PR

- [ ] Código sigue estándares
- [ ] Tests añadidos/actualizados
- [ ] Tests pasan (`npm run test`)
- [ ] Linter pasa (`npm run lint`)
- [ ] Build exitoso (`npm run build`)
- [ ] Documentación actualizada
- [ ] Commits siguen Conventional Commits
- [ ] Branch actualizada con main

## 🎯 Áreas de Contribución Prioritarias

### Fase 0 (Actual)

- [ ] Mejorar tests coverage
- [ ] Optimizar bundle size
- [ ] Mejorar accesibilidad
- [ ] Traducción a inglés (i18n)
- [ ] PWA manifest e íconos

### Fase 1 (Próxima)

- [ ] Firebase Integration
- [ ] Firebase Auth
- [ ] Panel de administración
- [ ] Modo offline básico

## 🐛 Reportar Bugs

Usa el [template de issue](../../issues/new?template=bug_report.md):

1. **Descripción**: Qué pasó
2. **Pasos para reproducir**: Cómo replicar
3. **Comportamiento esperado**: Qué debería pasar
4. **Screenshots**: Si aplica
5. **Entorno**: OS, navegador, versión

## ✨ Sugerir Features

Usa el [template de issue](../../issues/new?template=feature_request.md):

1. **Problema**: Qué problema resuelve
2. **Solución propuesta**: Tu idea
3. **Alternativas**: Otras opciones consideradas
4. **Contexto adicional**: Cualquier info relevante

## 📞 Contacto

- **Issues**: Para bugs y features
- **Discussions**: Para preguntas generales
- **Email**: [tu-email@example.com]

## 🙏 Reconocimientos

Todos los contribuidores serán añadidos al README en la sección de créditos.

---

**¡Gracias por contribuir a WindTrackr!** 🌬️
