# 🛠️ Guía de Desarrollo

Guía completa para desarrolladores que trabajan con Restaurant App.

## Índice

- [Setup Inicial](#setup-inicial)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Convenciones de Código](#convenciones-de-código)
- [Workflow de Desarrollo](#workflow-de-desarrollo)
- [Testing](#testing)
- [Debugging](#debugging)
- [Deployment](#deployment)

## Setup Inicial

### Requisitos
- Node.js 16+ (recomendado 18+)
- npm 8+ o yarn 3+
- Git
- VS Code (recomendado)

### Extensiones Recomendadas
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-vue-plugin",
    "bradlc.vscode-tailwindcss",
    "dsznajder.es7-react-js-snippets"
  ]
}
```

### Instalación
```bash
# Clonar repositorio
git clone <repository-url>
cd restaurant-app

# Instalar dependencias
npm install

# Crear archivo .env
cp .env.example .env

# Configurar variables de entorno
# Editar .env con tus valores

# Iniciar servidor
npm run dev
```

## Estructura del Proyecto

### Carpetas Principales
```
src/
├── components/    # Componentes React reutilizables
├── context/       # Estado global con Context API
├── hooks/         # Custom React hooks
├── layouts/       # Layouts de páginas
├── pages/         # Componentes de página
├── routes/        # Configuración de rutas
├── services/      # Servicios API
├── utils/         # Funciones utilitarias
└── styles/        # Estilos globales
```

### Naming Conventions

**Archivos y Carpetas:**
```
components/
  productos/
    ProductoFormDialog.tsx    # PascalCase para componentes
    useProductoForm.ts        # camelCase para hooks
    producto.types.ts         # camelCase para tipos
    index.ts                  # Barrel export
```

**Variables y Funciones:**
```typescript
// camelCase para variables y funciones
const userName = 'Juan';
function getUserData() { }

// UPPER_CASE para constantes
const API_BASE_URL = 'http://localhost:3000/api';
const MAX_RETRIES = 3;

// PascalCase para tipos e interfaces
interface User { }
type ProductStatus = 'active' | 'inactive';
```

## Convenciones de Código

### Importes
```typescript
// Orden recomendado:
// 1. React y librerías externas
import { FC, useState } from 'react';
import { Box, Button } from '@mui/material';
import axios from 'axios';

// 2. Importes del proyecto con alias
import { useAuth } from '@/hooks/useAuth';
import { userService } from '@/services/users.service';
import { Button } from '@/components/common/Button';

// 3. Tipos e interfaces
import { User, UserRole } from '@/types/user.types';
```

### Componentes Funcionales
```typescript
import { FC } from 'react';

interface MyComponentProps {
  title: string;
  onClose: () => void;
  optional?: string;
}

export const MyComponent: FC<MyComponentProps> = ({
  title,
  onClose,
  optional
}) => {
  return <div>{title}</div>;
};
```

### Manejo de Estados
```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [data, setData] = useState<DataType[]>([]);

// Usar useCallback para funciones
const handleFetch = useCallback(async () => {
  setLoading(true);
  try {
    const result = await fetchData();
    setData(result);
  } catch (err) {
    setError('Error al cargar datos');
  } finally {
    setLoading(false);
  }
}, []);
```

### Tipos TypeScript
```typescript
// ✅ Bueno - Tipos explícitos
interface User {
  id: number;
  email: string;
  nombre: string;
}

type Status = 'active' | 'inactive' | 'pending';

// ✅ Usar unknown para valores dinámicos
const handleError = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Error desconocido';
};
```

## Workflow de Desarrollo

### Git Workflow
```bash
# Crear rama para feature
git checkout -b feature/nombre-feature

# Hacer commits con mensajes descriptivos
git commit -m "feat: agregar validación de email"

# Push a rama remota
git push origin feature/nombre-feature

# Crear Pull Request
# Esperar review
# Merge a main
```

### Formato de Commits
```
feat: nueva característica
fix: corrección de bug
refactor: reorganización de código
docs: actualización de documentación
test: nuevas pruebas
chore: tareas de mantenimiento
```

### Crear Nuevo Componente
```bash
# Crear carpeta
mkdir -p src/components/mi-componente

# Crear archivo del componente
touch src/components/mi-componente/MiComponente.tsx

# Crear tipos si es necesario
touch src/components/mi-componente/mi-componente.types.ts

# Crear index para re-exportar
echo "export { MiComponente } from './MiComponente';" > src/components/mi-componente/index.ts
```

**Estructura del archivo:**
```typescript
// src/components/mi-componente/MiComponente.tsx
import { FC } from 'react';
import { MiComponenteProps } from './mi-componente.types';

export const MiComponente: FC<MiComponenteProps> = ({
  prop1,
  onClose
}) => {
  return (
    <div>
      {/* Contenido */}
    </div>
  );
};
```

### Crear Nuevo Servicio
```typescript
// src/services/mi-servicio.service.ts
import { api } from './api';
import { MiDato, CreateMiDatoDTO } from '@/types/mi-dato.types';

export const miService = {
  async getAll(): Promise<MiDato[]> {
    const { data } = await api.get('/mi-endpoint');
    return data;
  },

  async getById(id: number): Promise<MiDato> {
    const { data } = await api.get(`/mi-endpoint/${id}`);
    return data;
  },

  async create(dto: CreateMiDatoDTO): Promise<MiDato> {
    const { data } = await api.post('/mi-endpoint', dto);
    return data;
  },

  async update(id: number, dto: Partial<CreateMiDatoDTO>): Promise<MiDato> {
    const { data } = await api.put(`/mi-endpoint/${id}`, dto);
    return data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/mi-endpoint/${id}`);
  }
};
```

## Testing

### Configuración
El proyecto usa Jest y React Testing Library.

### Ejecutar Pruebas
```bash
# Ejecutar todas las pruebas
npm test

# Modo watch
npm run test:watch

# Con cobertura
npm test -- --coverage

# CI mode
npm run test:ci
```

### Escribir Pruebas
```typescript
// src/components/Button/__tests__/Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('debe renderizar el texto', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('debe ejecutar onClick al hacer click', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    
    screen.getByText('Click').click();
    expect(handleClick).toHaveBeenCalled();
  });
});
```

## Debugging

### Consola del Navegador
```typescript
// Debugging básico
console.log('Valor:', value);
console.error('Error:', error);
console.table(arrayOfObjects);

// Debugging con condiciones
if (DEBUG_MODE) {
  console.log('Estado actual:', state);
}
```

### React DevTools
1. Instalar extensión de navegador
2. Abrir DevTools (F12)
3. Ir a pestaña "Components"
4. Inspeccionar componentes y props

### Redux DevTools (si se usa Redux)
```typescript
// Necesario para devtools
const store = configureStore({
  reducer: rootReducer,
  devTools: true // Habilitar en desarrollo
});
```

### Breakpoints
```typescript
// Pausar en punto específico
if (condition) {
  debugger; // Se pausará aquí en DevTools
}
```

## Deployment

### Build para Producción
```bash
# Compilar proyecto
npm run build

# Verificar build localmente
npm run preview

# Build files estarán en dist/
```

### Verificación Previa
```bash
# Ejecutar linter
npm run lint

# Ejecutar pruebas
npm test

# Compilar TypeScript
npx tsc --noEmit

# Luego hacer build
npm run build
```

### Configuración de Entorno
```env
# .env.production
VITE_API_BASE_URL=https://api.restaurante.com/api
VITE_APP_NAME=Restaurant App
```

### Despliegue
**Opciones comunes:**
1. **Vercel** - Ideal para apps React
2. **Netlify** - Fácil CI/CD integrado
3. **AWS Amplify** - Escalable y potente
4. **GitHub Pages** - Gratuito para proyectos personales

**Ejemplo con Vercel:**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deployar
vercel

# Producción
vercel --prod
```

## Variables de Entorno

### Archivos de Ambiente
```
.env                    # Variables locales (no commitear)
.env.example           # Plantilla de variables
.env.development       # Variables de desarrollo
.env.production        # Variables de producción
```

### Acceder a Variables
```typescript
// En el código
const apiUrl = import.meta.env.VITE_API_BASE_URL;

// En TypeScript
declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_APP_NAME: string;
}
```

## Mejores Prácticas

1. **Tipado fuerte** - Siempre usar TypeScript
2. **Componentes pequeños** - Dividir en partes reutilizables
3. **Props destructured** - Desestructurar props
4. **Error handling** - Manejar errores siempre
5. **Loading states** - Mostrar estado de carga
6. **Validación** - Validar datos en cliente y servidor
7. **Performance** - Usar useMemo, useCallback cuando sea necesario
8. **Accesibilidad** - ARIA labels, navegación por teclado
9. **SEO** - Meta tags, structured data
10. **Testing** - Pruebas unitarias y de integración

---

Para más información, consulta la documentación:
- [React](https://react.dev)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Material-UI](https://mui.com/)
