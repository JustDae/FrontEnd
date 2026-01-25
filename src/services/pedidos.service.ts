import api from './api';

export interface Pedido {
  id: string;
  nombre_cliente: string;
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePedidoDto {
  nombre_cliente: string;
}

export interface UpdatePedidoDto {
  nombre_cliente?: string;
  total?: number;
}

export const getPedidos = async (params?: { page?: number; limit?: number; search?: string }) => {
  const { data } = await api.get('/pedidos', { params });
  return data;
};

export const getPedidoById = async (id: string) => {
  const { data } = await api.get(`/pedidos/${id}`);
  return data;
};

export const createPedido = async (dto: CreatePedidoDto) => {
  const { data } = await api.post('/pedidos', dto);
  return data;
};

export const updatePedido = async (id: string, dto: UpdatePedidoDto) => {
  const { data } = await api.put(`/pedidos/${id}`, dto);
  return data;
};

export const deletePedido = async (id: string) => {
  const { data } = await api.delete(`/pedidos/${id}`);
  return data;
};