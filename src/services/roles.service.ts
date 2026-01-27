import api from './api';

export interface Rol {
  id: number;
  nombre: string;
  descripcion?: string;
  activo: boolean;
}

export const getRoles = async () => {
  const { data } = await api.get('/rol');
  return data;
};

export const createRol = async (payload: Partial<Rol>) => {
  const { data } = await api.post('/rol', payload);
  return data;
};

export const updateRol = async (id: number, payload: Partial<Rol>) => {
  const { data } = await api.put(`/rol/${id}`, payload);
  return data;
};

export const deleteRol = async (id: number) => {
  const { data } = await api.delete(`/rol/${id}`);
  return data;
};