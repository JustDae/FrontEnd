import api from './api';

export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  categoryId?: number;
  categoria?: {
    id: number;
    name: string;
  };
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const getProductos = async (params?: { page?: number; limit?: number; search?: string }) => {
  const { data } = await api.get('/productos', { params });
  return data;
};

export const getProductoById = async (id: number) => {
  const { data } = await api.get(`/productos/${id}`);
  return data;
};

export const createProducto = async (formData: FormData) => {
  const { data } = await api.post('/productos', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const updateProducto = async (id: number, formData: FormData) => {
  const { data } = await api.put(`/productos/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const deleteProducto = async (id: number) => {
  const { data } = await api.delete(`/productos/${id}`);
  return data;
};