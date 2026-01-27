import api from './api';

export interface Notificacion {
  id?: number;
  titulo: string;
  mensaje: string;
  tipo: string; // INFO | ALERTA | ERROR
  leida: boolean;
}

export const getNotificaciones = () =>
  api.get<Notificacion[]>("/notificaciones");

export const marcarLeida = (id: number) =>
  api.put(`/notificaciones/${id}/leer`);
