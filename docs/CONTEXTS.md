# 🌍 Guía de Contextos (Estado Global)

Documentación del estado global de la aplicación usando Context API.

## Índice

- [Visión General](#visión-general)
- [AuthContext](#authcontext)
- [UiContext](#uicontext)
- [Uso en Componentes](#uso-en-componentes)
- [Mejores Prácticas](#mejores-prácticas)

## Visión General

La aplicación utiliza **React Context API** para manejar estado global sin necesidad de Redux u otra librería de estado.

**Contextos Disponibles:**
- `AuthContext` - Estado de autenticación del usuario
- `UiContext` - Estado de UI (temas, notificaciones, etc.)

## AuthContext

**Ubicación:** `src/context/AuthContext.tsx`

Maneja toda la lógica de autenticación y sesión del usuario.

### Estado
```typescript
interface AuthContextType {
  user: User | null;                    // Usuario autenticado
  token: string | null;                 // JWT token
  isAuthenticated: boolean;             // ¿Está autenticado?
  isLoading: boolean;                   // Estado de carga
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  hasRole: (role: string | string[]) => boolean;
  hasPermission: (permission: string) => boolean;
}
```

### Propiedades

#### `user`
- **Tipo:** `User | null`
- **Descripción:** Objeto del usuario autenticado o null
- **Contenido:**
  ```typescript
  {
    id: number;
    email: string;
    nombre: string;
    apellido: string;
    rol: {
      id: number;
      nombre: string;
      permisos: string[];
    };
  }
  ```

#### `token`
- **Tipo:** `string | null`
- **Descripción:** JWT token para requests autenticados

#### `isAuthenticated`
- **Tipo:** `boolean`
- **Descripción:** Indica si hay usuario autenticado

#### `isLoading`
- **Tipo:** `boolean`
- **Descripción:** Indica si hay operación en progreso

### Métodos

#### `login(email: string, password: string)`
```typescript
const { login } = useAuth();

await login('user@example.com', 'password123');
```

#### `register(userData: RegisterData)`
```typescript
const { register } = useAuth();

await register({
  email: 'newuser@example.com',
  password: 'password123',
  nombre: 'Juan',
  apellido: 'Pérez'
});
```

#### `logout()`
```typescript
const { logout } = useAuth();

logout(); // Limpia sesión y redirige a login
```

#### `updateUser(user: Partial<User>)`
```typescript
const { updateUser } = useAuth();

updateUser({
  nombre: 'Nuevo Nombre'
});
```

#### `hasRole(role: string | string[])`
```typescript
const { hasRole } = useAuth();

if (hasRole('admin')) {
  // Mostrar opción admin
}

// Con múltiples roles
if (hasRole(['admin', 'manager'])) {
  // Mostrar si es admin O manager
}
```

#### `hasPermission(permission: string)`
```typescript
const { hasPermission } = useAuth();

if (hasPermission('can_delete_products')) {
  // Mostrar botón eliminar
}
```

### Ejemplo de Uso
```typescript
import { useAuth } from '@/context/AuthContext';

const Profile = () => {
  const { user, logout, hasRole } = useAuth();

  if (!user) {
    return <div>No autenticado</div>;
  }

  return (
    <div>
      <h1>Hola, {user.nombre}</h1>
      <p>Email: {user.email}</p>
      
      {hasRole('admin') && (
        <button>Ir a Panel Admin</button>
      )}
      
      <button onClick={logout}>Cerrar Sesión</button>
    </div>
  );
};
```

## UiContext

**Ubicación:** `src/context/UiContext.tsx`

Maneja estado de UI como notificaciones, temas, diálogos, etc.

### Estado
```typescript
interface UiContextType {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  showSnackbar: (message: string, severity: 'success' | 'error' | 'warning' | 'info') => void;
  hideSnackbar: () => void;
  snackbar: {
    open: boolean;
    message: string;
    severity: SnackbarSeverity;
  };
  openDialog: (dialog: DialogConfig) => void;
  closeDialog: (dialogId: string) => void;
  dialogs: Map<string, DialogConfig>;
}
```

### Propiedades

#### `theme`
- **Tipo:** `'light' | 'dark'`
- **Descripción:** Tema actual de la aplicación

#### `snackbar`
- **Tipo:** Objeto con propiedades de notificación
- **Contenido:**
  ```typescript
  {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  }
  ```

#### `dialogs`
- **Tipo:** `Map<string, DialogConfig>`
- **Descripción:** Mapa de diálogos abiertos

### Métodos

#### `setTheme(theme: 'light' | 'dark')`
```typescript
const { setTheme } = useUi();

setTheme('dark');
```

#### `showSnackbar(message: string, severity: SnackbarSeverity)`
```typescript
const { showSnackbar } = useUi();

showSnackbar('Producto creado exitosamente', 'success');
showSnackbar('Error al guardar', 'error');
showSnackbar('Advertencia importante', 'warning');
```

#### `hideSnackbar()`
```typescript
const { hideSnackbar } = useUi();

hideSnackbar();
```

#### `openDialog(dialog: DialogConfig)`
```typescript
const { openDialog } = useUi();

openDialog({
  id: 'confirm-delete',
  title: 'Confirmar eliminación',
  message: '¿Estás seguro?',
  onConfirm: () => handleDelete()
});
```

#### `closeDialog(dialogId: string)`
```typescript
const { closeDialog } = useUi();

closeDialog('confirm-delete');
```

### Ejemplo de Uso
```typescript
import { useUi } from '@/context/UiContext';

const ProductForm = () => {
  const { showSnackbar, openDialog } = useUi();

  const handleSave = async () => {
    try {
      await saveProduct();
      showSnackbar('Producto guardado', 'success');
    } catch (error) {
      showSnackbar('Error al guardar', 'error');
    }
  };

  const handleDelete = () => {
    openDialog({
      id: 'delete-product',
      title: 'Eliminar Producto',
      message: '¿Deseas eliminar este producto?',
      onConfirm: async () => {
        await deleteProduct();
        showSnackbar('Producto eliminado', 'success');
      }
    });
  };

  return (
    <>
      <button onClick={handleSave}>Guardar</button>
      <button onClick={handleDelete}>Eliminar</button>
    </>
  );
};
```

## Uso en Componentes

### Custom Hooks para Contextos

Para facilitar el uso, se recomienda crear custom hooks:

```typescript
// hooks/useAuth.ts
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

// hooks/useUi.ts
import { useContext } from 'react';
import { UiContext } from '@/context/UiContext';

export const useUi = () => {
  const context = useContext(UiContext);
  if (!context) {
    throw new Error('useUi debe usarse dentro de UiProvider');
  }
  return context;
};
```

### Provider Setup

En `src/main.tsx` o `src/App.tsx`:

```typescript
import { AuthProvider } from '@/context/AuthContext';
import { UiProvider } from '@/context/UiContext';

function App() {
  return (
    <AuthProvider>
      <UiProvider>
        {/* Tu aplicación */}
      </UiProvider>
    </AuthProvider>
  );
}
```

### Usar en Componentes

```typescript
import { useAuth } from '@/hooks/useAuth';
import { useUi } from '@/hooks/useUi';

const MyComponent = () => {
  const { user, logout } = useAuth();
  const { showSnackbar } = useUi();

  return (
    <div>
      {user && <p>Usuario: {user.nombre}</p>}
      <button onClick={logout}>Salir</button>
    </div>
  );
};
```

## Mejores Prácticas

### 1. Usar Custom Hooks
```typescript
// ✅ Bueno
const { user, logout } = useAuth();

// ❌ Evitar
const context = useContext(AuthContext);
```

### 2. Verificar Contexto en Provider
```typescript
// En el hook personalizado
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
```

### 3. Mantener Contextos Simples
- Evitar contextos muy complejos
- Dividir en múltiples contextos pequeños si es necesario
- Usar Redux para estado muy complejo

### 4. Memoizar Valores
```typescript
const value = useMemo(() => ({
  user,
  token,
  isAuthenticated,
  isLoading
}), [user, token, isAuthenticated, isLoading]);

return (
  <AuthContext.Provider value={value}>
    {children}
  </AuthContext.Provider>
);
```

### 5. No Abusar del Contexto
- No usar para props simples que pasan pocos niveles
- Context es para estado GLOBAL
- Usar props para pasaje simple de datos

---

Para más información, consulta la [documentación de Context API](https://react.dev/reference/react/useContext).
