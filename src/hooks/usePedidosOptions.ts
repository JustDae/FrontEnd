import { useEffect, useState } from "react";
import { getPedidos } from "../services/pedidos.service";

export function usePedidosOptions() {
  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await getPedidos({ page: 1, limit: 100 });

        const lista = res.data?.items || res.data || [];
        setOptions(Array.isArray(lista) ? lista : []);

      } catch (err) {
        console.error("Error cargando opciones de pedidos", err);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { options, loading };
}