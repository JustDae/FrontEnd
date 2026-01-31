import api from './api';

export interface MetodoPago {
  id: number;
  nombre: string;
  descripcion?: string;
}

export const getMetodosPago = async () => {
  const { data } = await api.get('/metodo-pago');
  return data; // Retorna SuccessResponseDto
};

export const createMetodoPago = async (payload: Omit<MetodoPago, 'id'>) => {
  const { data } = await api.post('/metodo-pago', payload);
  return data;
};

export const updateMetodoPago = async (id: number, payload: Partial<MetodoPago>) => {
  const { data } = await api.put(`/metodo-pago/${id}`, payload);
  return data;
};

export const deleteMetodoPago = async (id: number) => {
  const { data } = await api.delete(`/metodo-pago/${id}`);
  return data;
};