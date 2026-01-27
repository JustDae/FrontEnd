import api from './api';

export interface Restaurante {
  id: number;
  name: string;
  direccion: string;
  telefono: string;
  ruc: string;
  slogan?: string;
  logo?: string;
}

export const getRestaurante = async () => {
  const { data } = await api.get('/restaurante');
  return data;
};

export const createRestaurante = async (payload: any) => {
  const { data } = await api.post('/restaurante', payload);
  return data;
};

export const updateRestaurante = async (id: number, payload: any) => {
  const { data } = await api.put(`/restaurante/${id}`, payload);
  return data;
};

export const uploadRestauranteLogo = async (id: number, file: File) => {
  const formData = new FormData();
  formData.append('logo', file);

  const { data } = await api.put(`/restaurante/${id}/logo`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};