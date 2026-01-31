import api from './api';

export interface Mesa {
  id: number;
  numero: string;
  capacidad: number;
  estado: 'libre' | 'ocupada' | 'reservada';
}

export const getMesas = async (page = 1, limit = 10, search = "") => {
  const { data } = await api.get(`/mesa?page=${page}&limit=${limit}&search=${search}`);
  return data;
};

export const createMesa = async (payload: Omit<Mesa, 'id'>) => {
  const { data } = await api.post('/mesa', payload);
  return data;
};

export const updateMesa = async (id: number, payload: Partial<Mesa>) => {
  const { data } = await api.put(`/mesa/${id}`, payload);
  return data;
};

export const deleteMesa = async (id: number) => {
  const { data } = await api.delete(`/mesa/${id}`);
  return data;
};