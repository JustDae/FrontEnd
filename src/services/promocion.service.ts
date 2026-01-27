import api from './api';

export interface Promocion {
  _id?: string;
  nombre: string;
  descripcion?: string;
  codigo: string;
  descuentoPorcentaje: number;
  fechaInicio: string;
  fechaFin: string;
  activo: boolean;
}

export const getPromociones = async () => {
  const { data } = await api.get('/promociones');
  return data;
};

export const createPromocion = async (payload: Partial<Promocion>) => {
  const { data } = await api.post('/promociones', payload);
  return data;
};

export const deletePromocion = async (id: string) => {
  const { data } = await api.delete(`/promociones/${id}`);
  return data;
};