# 📦 Guía de Componentes

Documentación detallada de los componentes principales de la aplicación Restaurant App.

## Índice

- [Componentes Públicos](#componentes-públicos)
- [Componentes de Formularios](#componentes-de-formularios)
- [Componentes Comunes](#componentes-comunes)
- [Convenciones de Componentes](#convenciones-de-componentes)

## Componentes Públicos

### PublicHeader
**Ubicación:** `src/components/public/PublicHeader.tsx`

Componente de encabezado para las páginas públicas. Incluye navegación, logo y enlaces de autenticación.

**Props:**
- Ninguno por defecto, usa contexto de autenticación

**Características:**
- Navegación responsiva
- Logo del restaurante
- Menú de usuario autenticado
- Enlaces de login/registro

### PublicFooter
**Ubicación:** `src/components/public/PublicFooter.tsx`

Pie de página con información del restaurante y enlaces útiles.

**Props:**
- Ninguno por defecto

**Características:**
- Información de contacto
- Enlaces de navegación
- Información del restaurante

### HomeCarousel
**Ubicación:** `src/components/public/HomeCarousel.tsx`

Carrusel de productos destacados para la página de inicio.

**Props:**
- Ninguno por defecto

**Características:**
- Swiper para productos destacados
- Navegación por flechas
- Responsivo

## Componentes de Formularios

### CategoryFormDialog
**Ubicación:** `src/components/categories/CategoryFormDialog.tsx`

Diálogo modal para crear/editar categorías.

**Props:**
```typescript
interface CategoryFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  categoryId?: number; // Para editar
}
```

**Funcionalidades:**
- Crear nuevas categorías
- Editar categorías existentes
- Validación de formulario
- Manejo de errores

### ProductoFormDialog
**Ubicación:** `src/components/productos/ProductoFormDialog.tsx`

Diálogo modal para crear/editar productos.

**Props:**
```typescript
interface ProductoFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  productoId?: number; // Para editar
}
```

**Funcionalidades:**
- Crear/editar productos
- Selección de categoría
- Subida de imágenes
- Gestión de precios

### UserFormDialog
**Ubicación:** `src/components/users/UserFormDialog.tsx`

Diálogo modal para crear/editar usuarios.

**Props:**
```typescript
interface UserFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  userId?: number; // Para editar
}
```

**Funcionalidades:**
- Crear nuevos usuarios
- Editar perfil de usuario
- Asignación de roles
- Validación de email único

### RoleFormDialog
**Ubicación:** `src/components/roles/RoleFormDialog.tsx`

Diálogo modal para crear/editar roles.

**Props:**
```typescript
interface RoleFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  roleId?: number; // Para editar
}
```

**Funcionalidades:**
- Crear/editar roles
- Asignación de permisos
- Gestión de permisos por módulo

### PromocionFormDialog
**Ubicación:** `src/components/promociones/PromocionFormDialog.tsx`

Diálogo modal para crear/editar promociones.

**Props:**
```typescript
interface PromocionFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  promocionId?: number; // Para editar
}
```

**Funcionalidades:**
- Crear/editar promociones
- Establecer fechas de vigencia
- Configurar descuentos
- Seleccionar productos

### FacturaFormDialog
**Ubicación:** `src/components/factura/FacturaFormDialog.tsx`

Diálogo modal para crear/editar facturas.

**Props:**
```typescript
interface FacturaFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  facturaId?: number; // Para editar
}
```

**Funcionalidades:**
- Crear nuevas facturas
- Seleccionar pedido
- Generar PDF
- Validar datos

### RestauranteFormDialog
**Ubicación:** `src/components/restaurante/RestauranteFormDialog.tsx`

Diálogo modal para configurar datos del restaurante.

**Props:**
```typescript
interface RestauranteFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}
```

**Funcionalidades:**
- Editar nombre del restaurante
- Configurar dirección
- Teléfono y email
- Horarios de atención

### DetallePedidoFormDialog
**Ubicación:** `src/components/detalle-pedido/DetallePedidoFormDialog.tsx`

Diálogo modal para gestionar detalles de pedidos.

**Props:**
```typescript
interface DetallePedidoFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  detalleId?: number; // Para editar
  pedidoId?: number;  // Para crear nuevo
}
```

**Funcionalidades:**
- Agregar/editar items de pedido
- Gestionar cantidades
- Calcular subtotales

## Componentes Comunes

### ConfirmDialog
**Ubicación:** `src/components/common/ConfirmDialog.tsx`

Diálogo de confirmación para acciones destructivas.

**Props:**
```typescript
interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}
```

**Uso:**
```typescript
<ConfirmDialog
  open={openConfirm}
  title="Eliminar Producto"
  message="¿Estás seguro de que quieres eliminar este producto?"
  onConfirm={handleDelete}
  onCancel={() => setOpenConfirm(false)}
/>
```

## Convenciones de Componentes

### Estructura de Componente
```typescript
import { FC, useState } from 'react';
import { Button, Dialog, TextField } from '@mui/material';

interface MyComponentProps {
  prop1: string;
  prop2?: number;
  onClose: () => void;
}

export const MyComponent: FC<MyComponentProps> = ({ prop1, prop2, onClose }) => {
  const [state, setState] = useState('');

  return (
    <Dialog open={true} onClose={onClose}>
      {/* Contenido */}
    </Dialog>
  );
};
```

### Naming Conventions
- Componentes funcionales con `export const ComponentName: FC<Props>`
- Props con sufijo `Props`
- Handlers con prefijo `on` o `handle`
- Estados privados con `use` para hooks

### Estilos
- Usar `sx` prop de Material-UI para estilos inline
- Crear archivos `.css` separados para estilos globales
- Mantener estilos locales en los componentes cuando sea posible

### Props Recomendadas
```typescript
interface DialogComponentProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  isLoading?: boolean;
  itemId?: number | string;
  title?: string;
}
```

---

Para más información sobre cómo usar estos componentes, consulta la documentación de [Material-UI](https://mui.com/).
