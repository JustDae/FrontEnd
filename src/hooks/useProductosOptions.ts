import { useEffect, useState } from "react";
import api from "../services/api";

export function useProductosOptions() {
  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await api.get("/productos");

        const lista = res.data?.data?.items || res.data?.data || [];
        setOptions(Array.isArray(lista) ? lista : []);

      } catch (error) {
        console.error("Error al cargar productos:", error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { options, loading };
}