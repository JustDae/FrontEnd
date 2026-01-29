# Guía de Servicios API

Documentación detallada de los servicios que manejan la comunicación con el backend.

## Índice

- [Cliente API Base](#cliente-api-base)
- [Servicios Disponibles](#servicios-disponibles)
- [Patrones de Uso](#patrones-de-uso)
- [Manejo de Errores](#manejo-de-errores)

## Cliente API Base

### api.ts
**Ubicación:** `src/services/api.ts`

Cliente Axios configurado centralmente para todas las peticiones HTTP.

**Características:**
- Configuración de URL base desde variables de entorno
- Interceptores para manejar tokens JWT
- Configuración de headers por defecto
- Manejo centralizado de errores

**Uso:**
```typescript
import { api } from '@/services/api';

// GET
const response = await api.get('/endpoint');

// POST
const response = await api.post('/endpoint', { data });

// PUT
const response = await api.put('/endpoint/:id', { data });

// DELETE
await api.delete('/endpoint/:id');
```

**Variables de Entorno Requeridas:**
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## Servicios Disponibles

### Auth Service
**Ubicación:** `src/services/auth.service.ts`

Gestión de autenticación y sesión de usuario.

**Métodos:**
```typescript
// Login
login(email: string, password: string): Promise<{ token: string; user: User }>

// Register
register(userData: RegisterData): Promise<{ token: string; user: User }>

// Logout
logout(): void

// Validar sesión
validateSession(): Promise<User>

// Renovar token
refreshToken(): Promise<string>
```

**Ejemplo:**
```typescript
import { authService } from '@/services/auth.service';

try {
  const response = await authService.login('user@example.com', 'password');
  localStorage.setItem('token', response.token);
} catch (error) {
  console.error('Login failed:', error);
}
```

### Products Service
**Ubicación:** `src/services/productos.service.ts`

Gestión de productos.

**Métodos:**
```typescript
// Obtener todos los productos
getAllProducts(filters?: FilterOptions): Promise<Product[]>

// Obtener producto por ID
getProductById(id: number): Promise<Product>

// Crear producto
createProduct(data: CreateProductDTO): Promise<Product>

// Actualizar producto
updateProduct(id: number, data: UpdateProductDTO): Promise<Product>

// Eliminar producto
deleteProduct(id: number): Promise<void>

// Buscar productos
searchProducts(query: string): Promise<Product[]>
```

**Ejemplo:**
```typescript
import { productosService } from '@/services/productos.service';

const productos = await productosService.getAllProducts({ categoryId: 1 });
```

### Categories Service
**Ubicación:** `src/services/categories.service.ts`

Gestión de categorías de productos.

**Métodos:**
```typescript
// Obtener todas las categorías
getAllCategories(): Promise<Category[]>

// Obtener categoría por ID
getCategoryById(id: number): Promise<Category>

// Crear categoría
createCategory(data: CreateCategoryDTO): Promise<Category>

// Actualizar categoría
updateCategory(id: number, data: UpdateCategoryDTO): Promise<Category>

// Eliminar categoría
deleteCategory(id: number): Promise<void>
```

### Users Service
**Ubicación:** `src/services/users.service.ts`

Gestión de usuarios.

**Métodos:**
```typescript
// Obtener todos los usuarios
getAllUsers(): Promise<User[]>

// Obtener usuario por ID
getUserById(id: number): Promise<User>

// Crear usuario
createUser(data: CreateUserDTO): Promise<User>

// Actualizar usuario
updateUser(id: number, data: UpdateUserDTO): Promise<User>

// Eliminar usuario
deleteUser(id: number): Promise<void>

// Cambiar contraseña
changePassword(id: number, password: string): Promise<void>
```

### Roles Service
**Ubicación:** `src/services/roles.service.ts`

Gestión de roles y permisos.

**Métodos:**
```typescript
// Obtener todos los roles
getAllRoles(): Promise<Role[]>

// Obtener rol por ID
getRoleById(id: number): Promise<Role>

// Crear rol
createRole(data: CreateRoleDTO): Promise<Role>

// Actualizar rol
updateRole(id: number, data: UpdateRoleDTO): Promise<Role>

// Eliminar rol
deleteRole(id: number): Promise<void>

// Obtener permisos disponibles
getAvailablePermissions(): Promise<Permission[]>
```

### Pedidos Service
**Ubicación:** `src/services/pedidos.service.ts`

Gestión de pedidos.

**Métodos:**
```typescript
// Obtener todos los pedidos
getAllPedidos(filters?: FilterOptions): Promise<Pedido[]>

// Obtener pedido por ID
getPedidoById(id: number): Promise<Pedido>

// Crear pedido
createPedido(data: CreatePedidoDTO): Promise<Pedido>

// Actualizar pedido
updatePedido(id: number, data: UpdatePedidoDTO): Promise<Pedido>

// Cambiar estado del pedido
updatePedidoStatus(id: number, status: string): Promise<Pedido>

// Eliminar pedido
deletePedido(id: number): Promise<void>
```

### Promotions Service
**Ubicación:** `src/services/promocion.service.ts`

Gestión de promociones.

**Métodos:**
```typescript
// Obtener todas las promociones
getAllPromociones(): Promise<Promocion[]>

// Obtener promoción por ID
getPromocionById(id: number): Promise<Promocion>

// Crear promoción
createPromocion(data: CreatePromocionDTO): Promise<Promocion>

// Actualizar promoción
updatePromocion(id: number, data: UpdatePromocionDTO): Promise<Promocion>

// Eliminar promoción
deletePromocion(id: number): Promise<void>

// Obtener promociones activas
getActivePromociones(): Promise<Promocion[]>
```

### Invoices Service
**Ubicación:** `src/services/factura.service.ts`

Gestión de facturas.

**Métodos:**
```typescript
// Obtener todas las facturas
getAllFacturas(): Promise<Factura[]>

// Obtener factura por ID
getFacturaById(id: number): Promise<Factura>

// Crear factura
createFactura(data: CreateFacturaDTO): Promise<Factura>

// Obtener facturas por rango de fechas
getFacturasByDateRange(startDate: Date, endDate: Date): Promise<Factura[]>

// Descargar factura PDF
downloadFacturaPDF(id: number): Promise<Blob>
```

### Restaurant Service
**Ubicación:** `src/services/restaurante.service.ts`

Configuración del restaurante.

**Métodos:**
```typescript
// Obtener configuración del restaurante
getRestaurantConfig(): Promise<RestaurantConfig>

// Actualizar configuración
updateRestaurantConfig(data: UpdateRestaurantDTO): Promise<RestaurantConfig>

// Obtener horarios
getHours(): Promise<Hours>

// Actualizar horarios
updateHours(data: UpdateHoursDTO): Promise<Hours>
```

### Audit Logs Service
**Ubicación:** `src/services/audit-logs.service.ts`

Registro de auditoría de cambios.

**Métodos:**
```typescript
// Obtener todos los logs
getAllAuditLogs(filters?: FilterOptions): Promise<AuditLog[]>

// Obtener logs por usuario
getLogsByUser(userId: number): Promise<AuditLog[]>

// Obtener logs por entidad
getLogsByEntity(entity: string): Promise<AuditLog[]>

// Obtener logs por rango de fechas
getLogsByDateRange(startDate: Date, endDate: Date): Promise<AuditLog[]>
```

## Patrones de Uso

### Obtener Datos
```typescript
import { productosService } from '@/services/productos.service';
import { useState, useEffect } from 'react';

const ProductList = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await productosService.getAllProducts();
        setProductos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {productos.map(p => (
        <li key={p.id}>{p.nombre}</li>
      ))}
    </ul>
  );
};
```

### Crear/Actualizar Datos
```typescript
const handleCreateProduct = async (formData) => {
  try {
    const newProduct = await productosService.createProduct(formData);
    setProductos([...productos, newProduct]);
    onClose();
  } catch (error) {
    showError(getApiErrorMessage(error));
  }
};
```

### Eliminar Datos
```typescript
const handleDeleteProduct = async (id) => {
  try {
    await productosService.deleteProduct(id);
    setProductos(productos.filter(p => p.id !== id));
  } catch (error) {
    showError('No se pudo eliminar el producto');
  }
};
```

## Manejo de Errores

### getApiErrorMessage Utility
**Ubicación:** `src/utils/getApiErrorMessage.ts`

Función para extraer mensajes de error de la API de forma consistente.

**Uso:**
```typescript
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

try {
  await someService.method();
} catch (error) {
  const message = getApiErrorMessage(error);
  showError(message); // "Mensaje de error desde la API"
}
```

**Tipos de Error Manejados:**
- Errores de validación (400)
- Errores de autenticación (401)
- Errores de autorización (403)
- Errores de no encontrado (404)
- Errores del servidor (500)
- Errores de red

---

Para más información sobre Axios, consulta la [documentación oficial](https://axios-http.com/).
