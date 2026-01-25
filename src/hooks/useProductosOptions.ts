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
        setOptions(res.data.items || res.data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { options, loading };
}