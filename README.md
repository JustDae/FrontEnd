# 🍽️ Restaurant App - Frontend

Aplicación web moderna para la gestión integral de un restaurante. Desarrollada con **React**, **TypeScript** y **Vite**, ofreciendo una experiencia de usuario fluida y un panel de administración completo.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Scripts Disponibles](#scripts-disponibles)
- [Configuración](#configuración)
- [Autenticación y Autorización](#autenticación-y-autorización)
- [Documentación Adicional](#documentación-adicional)

## ✨ Características

### Para Usuarios Públicos
- 🏠 **Página de Inicio** - Carrusel de productos destacados
- 🔍 **Catálogo de Productos** - Exploración y filtrado de productos
- 📋 **Detalles de Pedidos** - Seguimiento de pedidos realizados
- 👤 **Autenticación** - Login y registro de usuarios
- ℹ️ **Información** - Página "Acerca de" del restaurante

### Para Administradores
- 📊 **Dashboard** - Resumen del estado del restaurante
- 🍔 **Gestión de Productos** - CRUD de productos
- 📂 **Gestión de Categorías** - Administración de categorías de productos
- 🎉 **Gestión de Promociones** - Crear y administrar ofertas especiales
- 👥 **Gestión de Usuarios** - Control de cuentas de usuario
- 🔐 **Gestión de Roles** - Configuración de permisos y roles
- 🏢 **Configuración del Restaurante** - Datos principales del negocio
- 📑 **Facturación** - Gestión de facturas
- 📝 **Gestión de Pedidos** - Administración completa de pedidos
- 📊 **Auditoría** - Registro de cambios y actividades del sistema

## 🔧 Requisitos Previos

- **Node.js** (versión 16 o superior)
- **npm** (incluido con Node.js)
- Una API backend funcionando (consulta la documentación del backend)

## 📦 Instalación

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
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=Restaurant App
```

### 4. Iniciar el Servidor de Desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes React reutilizables
│   ├── categories/     # Componentes para gestión de categorías
│   ├── common/         # Componentes comunes (ConfirmDialog, etc.)
│   ├── detalle-pedido/ # Componentes para detalles de pedidos
│   ├── factura/        # Componentes para facturas
│   ├── productos/      # Componentes para productos
│   ├── promociones/    # Componentes para promociones
│   ├── public/         # Componentes públicos (Header, Footer, Carousel)
│   ├── restaurante/    # Componentes de configuración del restaurante
│   ├── roles/          # Componentes para gestión de roles
│   └── users/          # Componentes para gestión de usuarios
│
├── context/            # Context API para estado global
│   ├── AuthContext.tsx # Contexto de autenticación
│   └── UiContext.tsx   # Contexto de UI
│
├── hooks/              # Custom Hooks
│   ├── useCategoriesOptions.ts
│   ├── usePedidosOptions.ts
│   └── useProductosOptions.ts
│
├── layouts/            # Layouts principales
│   ├── DashboardLayout.tsx   # Layout para panel administrativo
│   ├── PrivateLayout.tsx     # Layout para rutas privadas
│   ├── PublicLayout.tsx      # Layout para rutas públicas
│   └── ScrollToHash.tsx      # Componente para scroll automático
│
├── pages/              # Páginas de la aplicación
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

## 🚀 Scripts Disponibles

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

## 🔐 Autenticación y Autorización

La aplicación utiliza **JWT (JSON Web Tokens)** para autenticación:

- Los tokens se almacenan en el localStorage
- Los tokens se envían automáticamente en cada request con la cabecera `Authorization`
- Las rutas protegidas usan guardias (`RequireAuth`, `RequireRole`)
- Los roles disponibles controlan el acceso a diferentes secciones

**Tipos de Usuario:**
- **Admin** - Acceso completo al panel administrativo
- **Manager** - Gestión de pedidos y productos
- **User** - Usuario estándar del restaurante

## 🛠️ Tecnologías Principales

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

## 📝 Configuración

### Variables de Entorno (`.env`)
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=Restaurant App
```

### TypeScript (`tsconfig.json`)
- Configurado para ES2020
- Strict mode habilitado
- JSX configurado para React

### Vite (`vite.config.ts`)
- Plugin React habilitado
- HMR para desarrollo
- Optimizaciones de build

## 📚 Documentación Adicional

Para más información detallada, consulta:

- [Guía de Componentes](docs/COMPONENTS.md) - Documentación de componentes principales
- [Guía de Servicios](docs/SERVICES.md) - Documentación de servicios de API
- [Guía de Enrutamiento](docs/ROUTING.md) - Sistema de rutas
- [Guía de Contextos](docs/CONTEXTS.md) - Estado global de la aplicación
- [Guía de Desarrollo](docs/DEVELOPMENT.md) - Guía para desarrolladores
- [API Integration](docs/API_INTEGRATION.md) - Integración con el backend

## 👥 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo licencia MIT.

## 📧 Soporte

Para soporte o reportar problemas, por favor contacta al equipo de desarrollo o abre un issue en el repositorio.

---

### Notas del Proyecto Anterior

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

 

- [Expand ESLint configuration](#expanding-the-eslint-configuration)
- [React Compiler](#react-compiler)


- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
