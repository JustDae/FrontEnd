# 🗺️ Guía de Enrutamiento

Documentación detallada del sistema de enrutamiento de la aplicación.

## Índice

- [Estructura de Rutas](#estructura-de-rutas)
- [Rutas Públicas](#rutas-públicas)
- [Rutas Privadas](#rutas-privadas)
- [Guardias de Ruta](#guardias-de-ruta)
- [Configuración](#configuración)

## Estructura de Rutas

La aplicación utiliza **React Router v7** para manejar la navegación. Las rutas están organizadas en tres archivos:

```
src/routes/
├── app.routes.tsx      # Rutas principales
├── public.routes.tsx   # Rutas públicas
├── private.routes.tsx  # Rutas privadas/admin
├── RequireAuth.tsx     # Guard de autenticación
└── RequireRole.tsx     # Guard de autorización
```

## Rutas Públicas

**Archivo:** `src/routes/public.routes.tsx`

Rutas accesibles sin autenticación.

### `/` - Página de Inicio
- **Componente:** `PublicHome.tsx`
- **Layout:** `PublicLayout`
- **Descripción:** Página principal del restaurante con carrusel de productos

### `/login` - Iniciar Sesión
- **Componente:** `Login.tsx`
- **Layout:** `PublicLayout`
- **Descripción:** Formulario de login para usuarios

### `/register` - Registro
- **Componente:** `Register.tsx`
- **Layout:** `PublicLayout`
- **Descripción:** Formulario de registro de nuevos usuarios

### `/products` - Productos
- **Componente:** `PublicProducts.tsx`
- **Layout:** `PublicLayout`
- **Descripción:** Catálogo de productos públicos

### `/about` - Acerca De
- **Componente:** `PublicAbout.tsx`
- **Layout:** `PublicLayout`
- **Descripción:** Información sobre el restaurante

### `/order/:id` - Detalle de Pedido
- **Componente:** `PublicOrderDetail.tsx`
- **Layout:** `PublicLayout`
- **Parámetros:** `id` (número del pedido)
- **Descripción:** Detalles de un pedido específico para seguimiento

## Rutas Privadas

**Archivo:** `src/routes/private.routes.tsx`

Rutas protegidas que requieren autenticación y roles específicos.

### Rutas de Administrador

#### `/dashboard` - Panel Principal
- **Componente:** `DashboardHome.tsx`
- **Layout:** `DashboardLayout`
- **Rol Requerido:** `admin`, `manager`
- **Descripción:** Panel de control principal

#### `/admin/productos` - Gestión de Productos
- **Componente:** `ProductosPage.tsx`
- **Layout:** `DashboardLayout`
- **Rol Requerido:** `admin`, `manager`
- **Funcionalidades:**
  - Listado de productos
  - Crear nuevo producto
  - Editar producto
  - Eliminar producto

#### `/admin/categorias` - Gestión de Categorías
- **Componente:** `CategoriesPage.tsx`
- **Layout:** `DashboardLayout`
- **Rol Requerido:** `admin`
- **Funcionalidades:**
  - CRUD de categorías
  - Gestión de productos por categoría

#### `/admin/promociones` - Gestión de Promociones
- **Componente:** `PromocionesPage.tsx`
- **Layout:** `DashboardLayout`
- **Rol Requerido:** `admin`
- **Funcionalidades:**
  - Crear/editar promociones
  - Establecer vigencia
  - Configurar descuentos

#### `/admin/pedidos` - Gestión de Pedidos
- **Componente:** `PedidosPage.tsx`
- **Layout:** `DashboardLayout`
- **Rol Requerido:** `admin`, `manager`
- **Funcionalidades:**
  - Listado de pedidos
  - Cambiar estado
  - Ver detalles

#### `/admin/pedidos/:id` - Detalles del Pedido
- **Componente:** `DetallePedidoPage.tsx`
- **Layout:** `DashboardLayout`
- **Rol Requerido:** `admin`, `manager`
- **Parámetros:** `id` (número del pedido)

#### `/admin/facturas` - Gestión de Facturas
- **Componente:** `FacturaPage.tsx`
- **Layout:** `DashboardLayout`
- **Rol Requerido:** `admin`
- **Funcionalidades:**
  - Crear facturas
  - Descargar PDF
  - Historial

#### `/admin/usuarios` - Gestión de Usuarios
- **Componente:** `UsersPage.tsx`
- **Layout:** `DashboardLayout`
- **Rol Requerido:** `admin`
- **Funcionalidades:**
  - Listado de usuarios
  - Crear usuario
  - Editar perfil
  - Cambiar rol

#### `/admin/roles` - Gestión de Roles
- **Componente:** `RolesPage.tsx`
- **Layout:** `DashboardLayout`
- **Rol Requerido:** `admin`
- **Funcionalidades:**
  - CRUD de roles
  - Asignación de permisos

#### `/admin/restaurante` - Configuración
- **Componente:** `RestaurantePage.tsx`
- **Layout:** `DashboardLayout`
- **Rol Requerido:** `admin`
- **Funcionalidades:**
  - Editar datos del restaurante
  - Configurar horarios
  - Información general

#### `/admin/auditoria` - Registro de Auditoría
- **Componente:** `AuditLogsPage.tsx`
- **Layout:** `DashboardLayout`
- **Rol Requerido:** `admin`
- **Funcionalidades:**
  - Ver historial de cambios
  - Filtrar por usuario/entidad
  - Exportar logs

### Ruta de Error

#### `/forbidden` - Acceso Denegado
- **Componente:** `Forbidden.tsx`
- **Descripción:** Se muestra cuando el usuario no tiene permisos para acceder

## Guardias de Ruta

### RequireAuth
**Ubicación:** `src/routes/RequireAuth.tsx`

Guarda las rutas privadas verificando autenticación.

**Comportamiento:**
- Si el usuario NO está autenticado → Redirige a `/login`
- Si el usuario está autenticado → Permite acceso
- Valida el token JWT almacenado

**Uso:**
```typescript
<Route element={<RequireAuth><PrivatePage /></RequireAuth>} path="/private" />
```

### RequireRole
**Ubicación:** `src/routes/RequireRole.tsx`

Guarda rutas verificando que el usuario tenga el rol requerido.

**Comportamiento:**
- Si el usuario NO tiene el rol → Redirige a `/forbidden`
- Si el usuario tiene el rol → Permite acceso
- Acepta múltiples roles

**Uso:**
```typescript
<Route 
  element={<RequireRole roles={['admin']}><AdminPage /></RequireRole>} 
  path="/admin" 
/>
```

## Configuración

### app.routes.tsx
**Archivo Principal de Rutas**

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { publicRoutes } from './public.routes';
import { privateRoutes } from './private.routes';
import { RequireAuth } from './RequireAuth';

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas */}
        {publicRoutes.map(route => (
          <Route key={route.path} {...route} />
        ))}

        {/* Rutas Privadas */}
        {privateRoutes.map(route => (
          <Route 
            key={route.path}
            element={<RequireAuth>{route.element}</RequireAuth>}
            path={route.path}
          />
        ))}

        {/* Ruta 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
```

### Navegación Programática

```typescript
import { useNavigate } from 'react-router-dom';

const MyComponent = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/admin/productos');
    // O con estado
    navigate('/dashboard', { state: { tab: 'analytics' } });
  };

  return <button onClick={handleNavigate}>Ir al Dashboard</button>;
};
```

### Enlaces Navegables

```typescript
import { Link } from 'react-router-dom';

<Link to="/admin/productos">Productos</Link>
```

### Parámetros de Ruta

```typescript
import { useParams } from 'react-router-dom';

const PedidoDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  return <div>Pedido #{id}</div>;
};
```

### Query Parameters

```typescript
import { useSearchParams } from 'react-router-dom';

const ProductsList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const category = searchParams.get('category');
  const page = searchParams.get('page') || '1';

  return (
    <div>
      Categoría: {category}, Página: {page}
    </div>
  );
};
```

## Flujo de Autenticación

```
Usuario no autenticado
    ↓
Intenta acceder a ruta privada
    ↓
RequireAuth verifica token
    ↓
¿Token válido?
├─ No → Redirige a /login
└─ Sí → RequireRole verifica rol
        ├─ No tiene rol → Redirige a /forbidden
        └─ Tiene rol → Permite acceso
```

## Mejores Prácticas

1. **Agrupar rutas relacionadas** - Usar prefijos como `/admin/`
2. **Usar guardias apropiados** - RequireAuth para privadas, RequireRole para permisos específicos
3. **Nombres descriptivos** - Rutas claras y consistentes
4. **Documentar roles requeridos** - Especificar qué roles pueden acceder
5. **Manejar redirecciones** - Redirigir a login o forbidden según sea necesario
6. **Validar en backend** - Aunque haya guardias en el frontend, validar siempre en API

---

Para más información sobre React Router, consulta la [documentación oficial](https://reactrouter.com/).
