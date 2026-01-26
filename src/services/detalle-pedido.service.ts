import api from './api';

export interface DetallePedido {
  id: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  observaciones?: string;
  pedidoId: number;
  productoId: number;
  producto?: {
    id: number;
    nombre: string;
    precio: string;
  };
}

export interface CreateDetallePedidoDto {
  pedidoId: number;
  productoId: number;
  cantidad: number;
  observaciones?: string;
}

export const getDetallePedidos = async (params?: { page?: number; limit?: number; search?: string }) => {
  const { data } = await api.get('/detalle-pedido', { params });
  return data;
};

export const getDetallePedidoById = async (id: number | string) => {
  const { data } = await api.get(`/detalle-pedido/${id}`);
  return data;
};

export const createDetallePedido = async (dto: CreateDetallePedidoDto) => {
  const { data } = await api.post('/detalle-pedido', dto);
  return data;
};

export const updateDetallePedido = async (id: number | string, dto: Partial<CreateDetallePedidoDto>) => {
  const { data } = await api.put(`/detalle-pedido/${id}`, dto);
  return data;
};

export const deleteDetallePedido = async (id: number | string) => {
  const { data } = await api.delete(`/detalle-pedido/${id}`);
  return data;
};