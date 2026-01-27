import api from './api';

export interface Factura {
  id: number;
  fechaEmision: string;
  razonSocial: string;
  ruc_cedula: string;
  total: number;
  pedidoId: string;
  pedido?: any;
}

export const getFacturas = async (page = 1, limit = 10, search = "") => {
  const { data } = await api.get(`/factura?page=${page}&limit=${limit}&search=${search}`);
  return data;
};

export const createFactura = async (payload: { razonSocial: string; ruc_cedula: string; pedidoId: string }) => {
  const { data } = await api.post('/factura', payload);
  return data;
};

export const getFacturaById = async (id: number) => {
  const { data } = await api.get(`/factura/${id}`);
  return data;
};