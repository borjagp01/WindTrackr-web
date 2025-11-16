# 🎯 Próximos Pasos - WindTrackr

## 📋 Estado Actual

✅ **Fase 0**: Completada - App con mock data funcional
✅ **Fase 1 - Firebase DB**: Completada - Integración con Firebase Realtime Database
⏳ **Fase 1 - Firebase Auth**: Pendiente
⏳ **Fase 1 - Real-time**: Pendiente

## 🚀 Acción Inmediata: Probar con Arduino

### 1. Verificar que Arduino está subiendo datos

```bash
npm run inspect-firebase
```

**Qué esperar**:
```
🔍 Inspecting Firebase Realtime Database structure...

📊 Root level keys: [ 'stations', 'readings', 'forecasts' ]
...
```

**Si ves datos**: ¡Perfecto! El Arduino está funcionando.
**Si NO ves datos**: Necesitas configurar el Arduino o usar seed:

```bash
npm run seed-firebase
```

### 2. Ejecutar la app

```bash
npm run dev
```

Abre `http://localhost:5173`

### 3. Verificar en el navegador

- **Panel de debug** (esquina inferior derecha):
  - Debe decir "Data Source: firebase"
  - Debe decir "Status: ● Connected"
  - Debe mostrar número de estaciones

- **Console de DevTools**:
  - Busca "Using Firebase data source"
  - Revisa si hay errores

- **Network tab**:
  - Deberías ver requests a `firebasedatabase.app`

### 4. Si algo falla

Consulta la sección de **Troubleshooting** en `FIREBASE_GUIDE.md`.

## 🔐 Siguiente Feature: Firebase Auth

### Objetivo

Permitir que los usuarios se autentiquen para:
- Guardar estaciones favoritas
- Personalizar el dashboard
- (Futuro) Configurar alertas

### Implementación Recomendada

#### 1. Habilitar Auth Providers en Firebase Console

1. Abre [Firebase Console](https://console.firebase.google.com/)
2. Selecciona proyecto "windtrackr"
3. Ve a **Authentication** → **Sign-in method**
4. Habilita:
   - Google
   - Email/Password

#### 2. Instalar dependencias (ya instaladas)

Firebase Auth ya está incluido en el SDK instalado.

#### 3. Crear AuthContext

**Archivo a crear**: `src/features/auth/AuthContext.tsx`

```typescript
import { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth } from '@/app/firebase';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signInWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUpWithEmail = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

#### 4. Integrar en App

**Modificar**: `src/app/App.tsx`

```tsx
import { AuthProvider } from '@/features/auth/AuthContext';

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
```

#### 5. Crear componentes de Login/Logout

**Archivo a crear**: `src/components/AuthButton/AuthButton.tsx`

```tsx
import { useAuth } from '@/features/auth/AuthContext';

export function AuthButton() {
  const { user, signInWithGoogle, logout } = useAuth();

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <img
          src={user.photoURL || undefined}
          alt={user.displayName || 'User'}
          className="w-8 h-8 rounded-full"
        />
        <span className="text-sm">{user.displayName}</span>
        <button
          onClick={logout}
          className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={signInWithGoogle}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Sign in with Google
    </button>
  );
}
```

#### 6. Añadir al NavBar

**Modificar**: `src/components/NavBar/NavBar.tsx`

```tsx
import { AuthButton } from '@/components/AuthButton';

// En el NavBar, después de ThemeToggle:
<AuthButton />
```

#### 7. (Opcional) Rutas Protegidas

**Archivo a crear**: `src/components/ProtectedRoute/ProtectedRoute.tsx`

```tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
```

**Usar en router**:

```tsx
{
  path: '/favorites',
  element: (
    <ProtectedRoute>
      <FavoritesPage />
    </ProtectedRoute>
  )
}
```

#### 8. Actualizar Firebase Rules

En Firebase Console → Realtime Database → Rules:

```json
{
  "rules": {
    "stations": {
      ".read": true,
      ".write": false
    },
    "readings": {
      ".read": true,
      ".write": false
    },
    "forecasts": {
      ".read": true,
      ".write": false
    },
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

### Testing Auth

1. Ejecuta `npm run dev`
2. Click en "Sign in with Google"
3. Selecciona cuenta de Google
4. Deberías ver tu foto y nombre en el NavBar
5. Click "Logout" para cerrar sesión

## 🔄 Siguiente Feature: Real-time Updates

### Objetivo

Reemplazar queries one-time (`get()`) con subscriptions en tiempo real (`onValue()`).

### Implementación

#### 1. Crear FirebaseDataSourceRealtime

**Opción A**: Modificar `FirebaseDataSource.ts` existente

**Opción B**: Crear nueva clase `FirebaseDataSourceRealtime.ts` (recomendado)

```typescript
import { ref, onValue, off } from 'firebase/database';
import type { Reading } from '@/types';

export class FirebaseDataSourceRealtime {
  subscribeToReadings(
    stationId: string,
    callback: (readings: Reading[]) => void
  ) {
    const dbRef = ref(db, `readings/${stationId}`);

    const listener = onValue(dbRef, (snapshot) => {
      if (!snapshot.exists()) {
        callback([]);
        return;
      }

      const data = snapshot.val();
      const readings = Object.values(data);
      callback(readings);
    });

    // Return cleanup function
    return () => off(dbRef, 'value', listener);
  }
}
```

#### 2. Usar en hooks

**Modificar**: `src/features/stations/hooks.ts`

```typescript
export function useReadingsRealtime(stationId: string, range: ReadingRange) {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dataSource = getDataSource();

    if (dataSource instanceof FirebaseDataSourceRealtime) {
      // Real-time subscription
      const unsubscribe = dataSource.subscribeToReadings(
        stationId,
        (data) => {
          setReadings(filterByRange(data, range));
          setLoading(false);
        }
      );

      return unsubscribe;
    } else {
      // Fallback to one-time fetch
      dataSource.getReadings(stationId, range)
        .then(setReadings)
        .finally(() => setLoading(false));
    }
  }, [stationId, range]);

  return { readings, loading };
}
```

### Testing Real-time

1. Abre la app
2. Abre Firebase Console → Realtime Database
3. Modifica manualmente un valor
4. La app debería actualizarse automáticamente sin refresh

## 📊 Checklist Fase 1 Completa

- [x] Firebase SDK instalado
- [x] FirebaseDataSource implementado
- [x] Scripts de inspect y seed
- [x] Panel de debug
- [x] Documentación completa
- [x] Build exitoso
- [ ] **Probar con Arduino real** ← SIGUIENTE PASO
- [ ] Firebase Auth (Google)
- [ ] Firebase Auth (Email/Password)
- [ ] AuthContext y hooks
- [ ] UI de Login/Logout
- [ ] Rutas protegidas
- [ ] Firebase Rules actualizadas
- [ ] Real-time subscriptions
- [ ] Tests de integración

## 🎯 Prioridad

1. **ALTA**: Probar con Arduino real
2. **ALTA**: Adaptar FirebaseDataSource si estructura difiere
3. **MEDIA**: Implementar Firebase Auth
4. **MEDIA**: Real-time updates
5. **BAJA**: Tests de integración

## 📚 Recursos Adicionales

- `FIREBASE_GUIDE.md` - Guía completa de Firebase
- `FASE1_RESUMEN.md` - Resumen de lo implementado
- `README.md` - Documentación general
- [Firebase Auth Docs](https://firebase.google.com/docs/auth/web/start)
- [Firebase Realtime Database Docs](https://firebase.google.com/docs/database/web/start)

## 💡 Consejos

1. **No modifiques UI**: La arquitectura DataSource permite cambiar backend sin tocar componentes
2. **Usa el panel de debug**: Es tu mejor amigo para troubleshooting
3. **Console logs**: FirebaseDataSource ya tiene logs, úsalos para debugging
4. **Empieza simple**: Auth con Google primero, email/password después
5. **Tests**: Usa Firebase Emulator para tests locales

---

**¿Listo para empezar?** Ejecuta `npm run inspect-firebase` y luego `npm run dev` 🚀
