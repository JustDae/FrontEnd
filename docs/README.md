# 📚 Documentación de Restaurant App

Bienvenido a la documentación completa de Restaurant App. Aquí encontrarás todo lo que necesitas para entender, desarrollar y mantener la aplicación.

## 📖 Documentos Principales

### 1. [README.md](../README.md) - Visión General
- Descripción del proyecto
- Características principales
- Instalación y setup
- Tecnologías utilizadas
- Scripts disponibles

### 2. [COMPONENTS.md](COMPONENTS.md) - Guía de Componentes
- Documentación de componentes públicos
- Componentes de formularios (Dialogs)
- Componentes comunes reutilizables
- Convenciones de componentes
- Estructura recomendada

### 3. [SERVICES.md](SERVICES.md) - Guía de Servicios API
- Cliente API base (axios)
- Documentación de cada servicio
- Métodos disponibles con ejemplos
- Patrones de uso
- Manejo de errores

### 4. [ROUTING.md](ROUTING.md) - Sistema de Rutas
- Estructura de rutas (públicas/privadas)
- Listado completo de rutas
- Guardias de ruta (RequireAuth, RequireRole)
- Navegación programática
- Parámetros de ruta

### 5. [CONTEXTS.md](CONTEXTS.md) - Estado Global
- AuthContext - Autenticación
- UiContext - UI y notificaciones
- Custom hooks
- Ejemplos de uso
- Mejores prácticas

### 6. [DEVELOPMENT.md](DEVELOPMENT.md) - Guía para Desarrolladores
- Setup inicial
- Convenciones de código
- Workflow de desarrollo
- Testing
- Debugging
- Deployment

### 7. [API_INTEGRATION.md](API_INTEGRATION.md) - Integración Backend
- Configuración del cliente API
- Flujo de requisiciones
- Autenticación JWT
- Manejo de errores
- Interceptores
- Rate limiting y caché

## 🚀 Inicio Rápido

### Para Nuevos Desarrolladores
1. Lee [README.md](../README.md) para entender el proyecto
2. Sigue la sección "Instalación"
3. Lee [DEVELOPMENT.md](DEVELOPMENT.md) para convenciones
4. Consulta [COMPONENTS.md](COMPONENTS.md) para crear componentes

### Para Implementar Nuevas Características
1. Consulta [ROUTING.md](ROUTING.md) para saber dónde va
2. Crea componentes siguiendo [COMPONENTS.md](COMPONENTS.md)
3. Implementa servicios según [SERVICES.md](SERVICES.md)
4. Usa contextos del [CONTEXTS.md](CONTEXTS.md)

### Para Conectar con Backend
1. Lee [API_INTEGRATION.md](API_INTEGRATION.md)
2. Consulta [SERVICES.md](SERVICES.md) para el patrón de servicio
3. Usa helpers de error de [API_INTEGRATION.md](API_INTEGRATION.md)

## 🗺️ Mapa de la Aplicación

### Rutas Públicas
```
/                    - Página inicio
/login              - Login
/register           - Registro
/products           - Catálogo
/about              - Acerca de
/order/:id          - Detalle pedido
```

### Rutas Administrativas
```
/dashboard          - Panel principal
/admin/productos    - Gestión de productos
/admin/categorias   - Gestión de categorías
/admin/promociones  - Gestión de promociones
/admin/pedidos      - Gestión de pedidos
/admin/facturas     - Gestión de facturas
/admin/usuarios     - Gestión de usuarios
/admin/roles        - Gestión de roles
/admin/restaurante  - Configuración
/admin/auditoria    - Logs de auditoría
```

## 📁 Estructura de Carpetas

```
src/
├── components/      → Componentes React reutilizables
├── context/        → Estado global (Auth, UI)
├── hooks/          → Custom React hooks
├── layouts/        → Layouts de página
├── pages/          → Componentes de página
├── routes/         → Configuración de rutas
├── services/       → Servicios de API
├── utils/          → Funciones utilitarias
├── App.tsx         → Componente principal
└── main.tsx        → Punto de entrada
```

**Ver documentación:** [DEVELOPMENT.md](DEVELOPMENT.md#estructura-del-proyecto)

## 🔧 Tecnologías

| Librería | Versión | Uso |
|----------|---------|-----|
| **React** | ^19.2.0 | Framework UI |
| **TypeScript** | ~5.9.3 | Tipado estático |
| **Vite** | ^7.2.4 | Build tool |
| **Material-UI** | ^7.3.7 | Componentes UI |
| **React Router** | ^7.13.0 | Enrutamiento |
| **Axios** | ^1.13.2 | Cliente HTTP |
| **Jest** | ^30.2.0 | Testing |
| **ESLint** | ^9.39.1 | Linting |

## 📝 Convenciones

### Nombrado
- **Componentes:** PascalCase (`ProductoForm.tsx`)
- **Archivos:** camelCase o PascalCase según tipo
- **Funciones:** camelCase (`getUserData()`)
- **Constantes:** UPPER_CASE (`API_BASE_URL`)
- **Tipos:** PascalCase (`interface User`)

### Organización
- Un componente por archivo
- Carpeta por módulo relacionado
- Tipos en archivo aparte (`*.types.ts`)
- Índice de exportación (`index.ts`)

**Ver documentación:** [DEVELOPMENT.md](DEVELOPMENT.md#convenciones-de-código)

## 🔐 Seguridad

### Autenticación
- JWT tokens almacenados en localStorage
- Token incluido en header Authorization
- Renovación automática de token expirado

**Ver documentación:** [CONTEXTS.md](CONTEXTS.md#authcontext)

### Autorización
- Guardias de ruta por rol (RequireRole)
- Validación en backend siempre
- Botones/menús condicionales por rol

**Ver documentación:** [ROUTING.md](ROUTING.md#guardias-de-ruta)

## 📊 Patrones Comunes

### Obtener Datos
```typescript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

useEffect(() => {
  loadData();
}, []);
```

### Crear/Editar
```typescript
const handleSubmit = async (formData) => {
  try {
    await service.create(formData);
    showSuccess('Creado');
  } catch (error) {
    showError(getApiErrorMessage(error));
  }
};
```

### Eliminar con Confirmación
```typescript
const handleDelete = (id) => {
  openDialog({
    title: 'Confirmar',
    onConfirm: async () => {
      await service.delete(id);
      showSuccess('Eliminado');
    }
  });
};
```

**Ver documentación:** [SERVICES.md](SERVICES.md#patrones-de-uso)

## 🧪 Testing

```bash
# Ejecutar pruebas
npm test

# Modo watch
npm run test:watch

# Con cobertura
npm test -- --coverage
```

**Ver documentación:** [DEVELOPMENT.md](DEVELOPMENT.md#testing)

## 🚀 Deployment

```bash
# Compilar
npm run build

# Verificar build
npm run preview

# Desplegar a Vercel/Netlify
vercel --prod
```

**Ver documentación:** [DEVELOPMENT.md](DEVELOPMENT.md#deployment)

## 💡 Tips Útiles

### Crear Nuevo Componente
```bash
mkdir src/components/nueva-feature
touch src/components/nueva-feature/{ComponentName,component.types,index}.tsx
```

### Crear Nuevo Servicio
Sigue el patrón en [SERVICES.md](SERVICES.md#crear-nuevo-servicio)

### Debugging
Usa React DevTools y la consola del navegador. Ver [DEVELOPMENT.md](DEVELOPMENT.md#debugging)

### Notificaciones
Usa `useUi()` hook para mostrar snackbars. Ver [CONTEXTS.md](CONTEXTS.md#uicontext)

## 🤝 Contribución

1. Crear rama: `git checkout -b feature/nombre`
2. Hacer cambios
3. Commits descriptivos: `git commit -m "feat: descripción"`
4. Push: `git push origin feature/nombre`
5. Pull Request

**Ver documentación:** [DEVELOPMENT.md](DEVELOPMENT.md#git-workflow)

## ❓ Preguntas Frecuentes

**P: ¿Cómo agregar un nuevo campo a un formulario?**
R: Ver [COMPONENTS.md](COMPONENTS.md#componentes-de-formularios)

**P: ¿Cómo conectar con un nuevo endpoint?**
R: Ver [SERVICES.md](SERVICES.md#servicios-disponibles)

**P: ¿Cómo proteger una ruta?**
R: Ver [ROUTING.md](ROUTING.md#guardias-de-ruta)

**P: ¿Cómo manejar errores de API?**
R: Ver [API_INTEGRATION.md](API_INTEGRATION.md#manejo-de-errores)

**P: ¿Cómo usar estado global?**
R: Ver [CONTEXTS.md](CONTEXTS.md#uso-en-componentes)

## 📞 Contacto y Soporte

Para dudas o problemas:
1. Revisar la documentación relevante
2. Buscar en issues del repositorio
3. Crear un nuevo issue con descripción clara

---

**Última actualización:** Enero 2026
**Versión del Proyecto:** 0.0.0
**Versión de React:** 19.2.0
