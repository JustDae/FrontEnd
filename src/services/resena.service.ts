import api from './api';

export interface Resena {
  id?: number;
  comentario: string;
  calificacion: number; // 1 a 5
}

export const getResenas = () =>
  api.get<Resena[]>("/resenas");

export const createResena = (data: Resena) =>
  api.post("/resenas", data);
