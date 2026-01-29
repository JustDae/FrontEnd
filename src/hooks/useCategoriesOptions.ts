import { useEffect, useState } from "react";
import { getCategories, type CategoryDto } from "../services/categories.service";

export function useCategoriesOptions() {
  const [options, setOptions] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await getCategories({ page: 1, limit: 200, sort: "name", order: "ASC" });
        setOptions(res.items);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { options, loading };
}