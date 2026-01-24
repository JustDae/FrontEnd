import { api } from "./api.ts";

export interface ProductoDto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  estado: boolean;
  imagen?: string;
  category?: {
    id: number;
    name: string;
  };
}

interface PaginationMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

interface PaginationData {
  items: ProductoDto[];
  meta: PaginationMeta;
}

interface ApiResponse {
  message: string;
  data: PaginationData;
}

export const getPublicProducts = async (params: { q?: string; page?: number; limit?: number }) => {
  const { data } = await api.get<ApiResponse>('/productos', {
    params: {
      search: params.q,
      page: params.page,
      limit: params.limit,
      estado: 'true'
    },
  });
  return data;
};

export const getProductImageUrl = (imageName?: string) => {
  if (!imageName) return "/images/plato-default.png"; // Imagen local si no hay foto

  const baseUrl = api.defaults.baseURL || 'http://localhost:3000';

  const cleanBaseUrl = typeof baseUrl === 'string' && baseUrl.endsWith('/')
    ? baseUrl.slice(0, -1)
    : baseUrl;

  return `${cleanBaseUrl}/productos/${imageName}`;
};