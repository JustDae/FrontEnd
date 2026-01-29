# 🔗 Guía de Integración con API

Documentación sobre cómo el frontend se integra con el backend.

## Índice

- [Configuración del Cliente API](#configuración-del-cliente-api)
- [Flujo de Requisiciones](#flujo-de-requisiciones)
- [Autenticación](#autenticación)
- [Manejo de Errores](#manejo-de-errores)
- [Interceptores](#interceptores)
- [Rate Limiting](#rate-limiting)
- [Caché de Datos](#caché-de-datos)

## Configuración del Cliente API

### Archivo Principal: `src/services/api.ts`

```typescript
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const API_TIMEOUT = 30000; // 30 segundos

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Configuración de interceptores
api.interceptors.request.use(
  config => {
    // Agregar token al header
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

api.interceptors.response.use(
  response => response,
  error => {
    // Manejo de errores centralizado
    handleApiError(error);
    return Promise.reject(error);
  }
);
```

## Flujo de Requisiciones

### Flujo Típico GET
```
1. Usuario navega a página
2. useEffect dispara petición GET
3. Mostrar loading spinner
4. API responde con datos
5. Actualizar estado con datos
6. Renderizar datos
7. Si error → mostrar mensaje
```

**Ejemplo:**
```typescript
useEffect(() => {
  const loadData = async () => {
    setLoading(true);
    try {
      const productos = await productosService.getAllProducts();
      setProductos(productos);
    } catch (error) {
      setError(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  loadData();
}, []);
```

### Flujo Típico POST
```
1. Usuario llena formulario
2. Click en "Guardar"
3. Deshabilitar botón (mostrar loading)
4. Validar datos en cliente
5. Enviar POST a API
6. API procesa y responde
7. Si éxito → cerrar modal + notificación
8. Si error → mostrar mensaje en formulario
```

**Ejemplo:**
```typescript
const handleSave = async (formData: FormData) => {
  setSaving(true);
  try {
    const result = await productosService.createProduct(formData);
    showSnackbar('Producto creado', 'success');
    onSuccess?.(result);
  } catch (error) {
    setFormError(getApiErrorMessage(error));
  } finally {
    setSaving(false);
  }
};
```

## Autenticación

### Token Storage
```typescript
// Guardar token después de login
const handleLogin = async (email: string, password: string) => {
  const response = await authService.login(email, password);
  localStorage.setItem('authToken', response.token);
  localStorage.setItem('user', JSON.stringify(response.user));
};

// Obtener token para requests
const token = localStorage.getItem('authToken');

// Limpiar al logout
const handleLogout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  navigate('/login');
};
```

### JWT Structure
```typescript
// Token típico JWT
// Header
{
  "alg": "HS256",
  "typ": "JWT"
}

// Payload
{
  "sub": "1234567890",
  "name": "Juan Pérez",
  "iat": 1516239022,
  "exp": 1516242622,
  "rol": "admin"
}

// Signature
HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret)
```

### Renovación de Token
```typescript
// Si el token expira, intentar renovar
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { token } = await authService.refreshToken();
        localStorage.setItem('authToken', token);
        
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Si falla renovación, redirigir a login
        navigate('/login');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

## Manejo de Errores

### Tipos de Error
```typescript
interface ApiError {
  status: number;
  message: string;
  errors?: {
    field: string;
    message: string;
  }[];
}

// Ejemplos de respuesta de error
// 400 Bad Request
{
  "status": 400,
  "message": "Validación fallida",
  "errors": [
    { "field": "email", "message": "Email inválido" },
    { "field": "password", "message": "Mínimo 8 caracteres" }
  ]
}

// 401 Unauthorized
{
  "status": 401,
  "message": "No autenticado"
}

// 403 Forbidden
{
  "status": 403,
  "message": "No tiene permiso para acceder"
}

// 404 Not Found
{
  "status": 404,
  "message": "Recurso no encontrado"
}

// 500 Server Error
{
  "status": 500,
  "message": "Error interno del servidor"
}
```

### Función Helper: `getApiErrorMessage`
```typescript
// src/utils/getApiErrorMessage.ts
export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const response = error.response?.data;
    
    if (typeof response?.message === 'string') {
      return response.message;
    }

    // Errores de validación
    if (Array.isArray(response?.errors)) {
      return response.errors
        .map(e => `${e.field}: ${e.message}`)
        .join(', ');
    }

    // Fallback por status
    switch (error.response?.status) {
      case 400: return 'Datos inválidos';
      case 401: return 'No autenticado';
      case 403: return 'Acceso denegado';
      case 404: return 'No encontrado';
      case 500: return 'Error del servidor';
      default: return 'Error desconocido';
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Error desconocido';
}
```

### Uso en Componentes
```typescript
try {
  await productosService.createProduct(formData);
  showSnackbar('Éxito', 'success');
} catch (error) {
  const errorMessage = getApiErrorMessage(error);
  showSnackbar(errorMessage, 'error');
}
```

## Interceptores

### Request Interceptor
```typescript
api.interceptors.request.use(
  config => {
    // 1. Agregar token
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 2. Agregar headers personalizados
    config.headers['X-Request-ID'] = generateRequestId();

    // 3. Logging en desarrollo
    if (import.meta.env.DEV) {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  error => Promise.reject(error)
);
```

### Response Interceptor
```typescript
api.interceptors.response.use(
  response => {
    // Logging en desarrollo
    if (import.meta.env.DEV) {
      console.log(`API Response: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  error => {
    // Manejo centralizado de errores
    handleApiError(error);
    return Promise.reject(error);
  }
);

function handleApiError(error: AxiosError) {
  switch (error.response?.status) {
    case 401:
      // Token expirado, renovar o logout
      refreshTokenOrLogout();
      break;
    case 403:
      // Acceso denegado
      navigate('/forbidden');
      break;
    case 500:
      // Error servidor
      showServerError();
      break;
  }
}
```

## Rate Limiting

### Cliente Rate Limiting
```typescript
const createRateLimitedService = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  limit: number = 3, // máximo 3 requests en paralelo
  window: number = 1000 // por segundo
): T => {
  let requestCount = 0;
  let lastResetTime = Date.now();

  return (async (...args) => {
    const now = Date.now();
    if (now - lastResetTime > window) {
      requestCount = 0;
      lastResetTime = now;
    }

    if (requestCount >= limit) {
      throw new Error('Rate limit exceeded');
    }

    requestCount++;
    return fn(...args);
  }) as T;
};

// Uso
const limitedSearch = createRateLimitedService(
  productosService.searchProducts,
  3,
  1000
);
```

### Server Rate Limiting
El servidor debe implementar rate limiting. El cliente debe manejar respuesta 429:

```typescript
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers['retry-after'] || 60;
      console.warn(`Rate limited. Retry after ${retryAfter}s`);
      
      // Esperar y reintentar
      await new Promise(r => setTimeout(r, retryAfter * 1000));
      return api(error.config);
    }
    return Promise.reject(error);
  }
);
```

## Caché de Datos

### Cache Simple con Estado
```typescript
const useProductsCache = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cacheTime, setCacheTime] = useState<number>(0);
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

  const getProducts = async (force = false) => {
    const now = Date.now();
    
    if (!force && now - cacheTime < CACHE_DURATION) {
      return products; // Usar cache
    }

    const data = await productosService.getAllProducts();
    setProducts(data);
    setCacheTime(now);
    return data;
  };

  return { products, getProducts };
};
```

### Cache con LocalStorage
```typescript
const useLocalStorageCache = (key: string, duration: number = 300000) => {
  const setCache = (data: any) => {
    localStorage.setItem(key, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  };

  const getCache = () => {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > duration) {
      localStorage.removeItem(key);
      return null;
    }

    return data;
  };

  return { setCache, getCache };
};
```

---

Para más información:
- [Axios Documentation](https://axios-http.com/)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [JWT Introduction](https://jwt.io/introduction)
