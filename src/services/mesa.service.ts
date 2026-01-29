import api from './api';

export interface Mesa {
  id?: number;
  numeroMesa: string;
  capacidad: number;
  estado: string;
  ubicacion: string;
}

export const getMesas = () => api.get<Mesa[]>("/mesa");

export const createMesa = (data: Mesa) =>
  api.post("/mesa", data);
