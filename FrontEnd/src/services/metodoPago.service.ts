import api from './api';

export interface MetodoPago {
  id?: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
}

export const getMetodosPago = () =>
  api.get<MetodoPago[]>("/metodo-pago");

export const createMetodoPago = (data: MetodoPago) =>
  api.post("/metodo-pago", data);
