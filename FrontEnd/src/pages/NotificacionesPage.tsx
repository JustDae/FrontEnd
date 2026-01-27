import { useEffect, useState } from "react";
import {
  getNotificaciones,
  marcarLeida,
  type Notificacion,
} from "../services/notificacion.service";
import NotificacionItem from "../components/notificacion/NotificacionItem";

export default function NotificacionesPage() {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);

  useEffect(() => {
    getNotificaciones().then(res => setNotificaciones(res.data));
  }, []);

  const handleLeer = async (id: number) => {
    await marcarLeida(id);
    setNotificaciones(
      notificaciones.map(n =>
        n.id === id ? { ...n, leida: true } : n
      )
    );
  };

  return (
    <>
      <h1>Notificaciones</h1>

      {notificaciones.map(n => (
        <NotificacionItem
          key={n.id}
          data={n}
          onLeer={handleLeer}
        />
      ))}
    </>
  );
}
