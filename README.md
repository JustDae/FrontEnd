# 🍽️ Restaurant App - Frontend

Aplicación web moderna para la gestión integral de un restaurante. Desarrollada con **React**, **TypeScript** y **Vite**, ofreciendo una experiencia de usuario fluida y un panel de administración completo.

##  Tabla de Contenidos

- [Características](#características)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Scripts Disponibles](#scripts-disponibles)
- [Configuración](#configuración)
- [Autenticación y Autorización](#autenticación-y-autorización)
- [Documentación Adicional](#documentación-adicional)

##  Características

### Para Usuarios Públicos
-  **Página de Inicio** - Carrusel de productos destacados
-  **Catálogo de Productos** - Exploración y filtrado de productos
-  **Detalles de Pedidos** - Seguimiento de pedidos realizados
-  **Autenticación** - Login y registro de usuarios
- ! **Información** - Página "Acerca de" del restaurante

### Para Administradores
* **Panel Administrativo:** Control total de inventario (CRUD de productos), categorías y promociones.
* **Sistema de Roles:** Acceso granular para Admin, Manager y Usuario final mediante Guards de React Router.
* **Visualización de Datos:** Dashboard con métricas clave del negocio y auditoría de cambios.
* **Experiencia de Cliente:** Catálogo filtrable, seguimiento de pedidos y login seguro con JWT.

##  Requisitos Previos

- **Node.js** (versión 16 o superior)
- **npm** (incluido con Node.js)
- Una API backend funcionando (consulta la documentación del backend)

##  Instalación

### 1. Clonar el Repositorio
```bash
git clone <repository-url>
cd restaurant-app
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar Variables de Entorno
Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
VITE_API_BASE_URL=http://localhost:3000
```

### 4. Iniciar el Servidor de Desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

##  Estructura del Proyecto

```
src/
├── components/          
│   ├── categories/     # Categorías
│   ├── common/         # Componentes comunes (ConfirmDialog, etc.)
│   ├── detalle-pedido/ # Detalles de pedidos
│   ├── factura/        # Facturas
│   ├── productos/      # Productos
│   ├── promociones/    # Promociones
│   ├── public/         # Componentes públicos (Header, Footer, Carousel)
│   ├── restaurante/    # Configuración del restaurante
│   ├── roles/          # Gestión de roles
│   └── users/          # Gestión de usuarios
│
├── context/            # Context API para estado global
│   ├── AuthContext.tsx # Contexto de autenticación
│   └── UiContext.tsx   # Contexto de UI
│
├── hooks/
│   ├── useCategoriesOptions.ts
│   ├── usePedidosOptions.ts
│   └── useProductosOptions.ts
│
├── layouts/            # Layouts principales
│   ├── DashboardLayout.tsx   # Panel administrativo
│   ├── PrivateLayout.tsx     # Rutas privadas
│   ├── PublicLayout.tsx      # Rutas públicas
│   └── ScrollToHash.tsx      # Scroll automático
│
├── pages/
│   ├── private/        # Páginas administrativas protegidas
│   │   ├── AuditLogsPage.tsx
│   │   ├── CategoriesPage.tsx
│   │   ├── DashboardHome.tsx
│   │   ├── DetallePedidoPage.tsx
│   │   ├── FacturaPage.tsx
│   │   ├── PedidosPage.tsx
│   │   ├── ProductosPage.tsx
│   │   ├── PromocionesPage.tsx
│   │   ├── RestaurantePage.tsx
│   │   ├── RolesPage.tsx
│   │   └── UsersPage.tsx
│   └── public/         # Páginas públicas
│       ├── Login.tsx
│       ├── Register.tsx
│       ├── PublicHome.tsx
│       ├── PublicProducts.tsx
│       ├── PublicAbout.tsx
│       └── PublicOrderDetail.tsx
│
├── routes/             # Configuración de rutas
│   ├── app.routes.tsx
│   ├── private.routes.tsx
│   ├── public.routes.tsx
│   ├── RequireAuth.tsx    # Guard para rutas autenticadas
│   └── RequireRole.tsx    # Guard para rutas con rol específico
│
├── services/           # Servicios de API
│   ├── api.ts          # Cliente axios configurado
│   ├── auth.service.ts
│   ├── categories.service.ts
│   ├── detalle-pedido.service.ts
│   ├── factura.service.ts
│   ├── pedidos.service.ts
│   ├── productos.service.ts
│   ├── promocion.service.ts
│   ├── restaurante.service.ts
│   ├── roles.service.ts
│   ├── users.service.ts
│   └── audit-logs.service.ts
│
├── utils/              # Funciones utilitarias
│   ├── getApiErrorMessage.ts  # Manejo de errores de API
│   └── jwt.ts          # Utilidades para JWT
│
├── App.tsx             # Componente principal
├── main.tsx            # Punto de entrada
├── vite-env.d.ts       # Tipos de Vite
├── index.css           # Estilos globales
└── App.css             # Estilos de App
```

##  Scripts Disponibles

```bash
# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Vista previa de la compilación
npm run preview

# Ejecutar linter
npm lint

# Ejecutar pruebas
npm test

# Ejecutar pruebas en modo watch
npm run test:watch

# Ejecutar pruebas en modo CI
npm run test:ci
```

##  Autenticación y Autorización

La aplicación utiliza **JWT (JSON Web Tokens)** para autenticación:

- Los tokens se almacenan en el localStorage
- Los tokens se envían automáticamente en cada request con la cabecera `Authorization`
- Las rutas protegidas usan guardias (`RequireAuth`, `RequireRole`)
- Los roles disponibles controlan el acceso a diferentes secciones

**Tipos de Usuario:**
- **Admin** - Acceso completo al panel administrativo
- **Manager** - Gestión de pedidos y productos
- **User** - Usuario estándar del restaurante

## Tecnologías Principales

| Librería | Versión | Propósito |
|----------|---------|----------|
| React | ^19.2.0 | Framework UI |
| TypeScript | ~5.9.3 | Tipado estático |
| Vite | ^7.2.4 | Build tool y dev server |
| Material-UI | ^7.3.7 | Componentes UI |
| React Router | ^7.13.0 | Enrutamiento |
| Axios | ^1.13.2 | Cliente HTTP |
| Framer Motion | ^12.29.2 | Animaciones |
| Jest | ^30.2.0 | Testing |
| ESLint | ^9.39.1 | Linting |

## Configuración


### TypeScript (`tsconfig.json`)
- Configurado para ES2020
- Strict mode habilitado
- JSX configurado para React

### Vite (`vite.config.ts`)
- Plugin React habilitado
- HMR para desarrollo
- Optimizaciones de build

## Documentación Adicional

Para más información detallada, consulta:

- [Guía de Componentes](docs/COMPONENTS.md) - Documentación de componentes principales
- [Guía de Servicios](docs/SERVICES.md) - Documentación de servicios de API
- [Guía de Enrutamiento](docs/ROUTING.md) - Sistema de rutas
- [Guía de Contextos](docs/CONTEXTS.md) - Estado global de la aplicación
- [Guía de Desarrollo](docs/DEVELOPMENT.md) - Guía para desarrolladores
- [API Integration](docs/API_INTEGRATION.md) - Integración con el backend

## Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

##  Licencia

Este proyecto está bajo licencia MIT.

##  Soporte

Para soporte o reportar problemas, por favor contacta al equipo de desarrollo o abre un issue en el repositorio.

---