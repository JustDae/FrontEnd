import type { Notificacion } from "../../services/notificacion.service";

interface Props {
  data: Notificacion;
  onLeer: (id: number) => void;
}

export default function NotificacionItem({ data, onLeer }: Props) {
  return (
    <div style={{ border: "1px solid #ccc", marginBottom: "8px", padding: "8px" }}>
      <h4>{data.titulo}</h4>
      <p>{data.mensaje}</p>
      <small>{data.tipo}</small>

      {!data.leida && (
        <button onClick={() => onLeer(data.id!)}>
          Marcar como leída
        </button>
      )}
    </div>
  );
}
