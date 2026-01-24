import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  CircularProgress,
  Pagination,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import { getPublicPosts, type PublicPostDto } from "../../services/posts.service";

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}

export default function PublicHome(): JSX.Element {
  const [sp, setSp] = useSearchParams();

  const qParam = sp.get("q") || "";
  const pageParam = Number(sp.get("page") || "1");
  const limitParam = Number(sp.get("limit") || "10");

  const [q, setQ] = useState(qParam);
  const debouncedQ = useDebouncedValue(q, 450);

  const [items, setItems] = useState<PublicPostDto[]>([]);
  const [page, setPage] = useState(Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1);
  const [limit] = useState(Number.isFinite(limitParam) && limitParam > 0 ? limitParam : 10);

  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const queryKey = useMemo(() => ({ q: debouncedQ, page, limit }), [debouncedQ, page, limit]);

  useEffect(() => {
    setSp((prev) => {
      const next = new URLSearchParams(prev);
      if (q) next.set("q", q);
      else next.delete("q");
      next.set("page", String(page));
      next.set("limit", String(limit));
      return next;
    });
  }, [q, page, limit, setSp]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res: any = await getPublicPosts(queryKey);
        setItems(res.data.items);
        setTotalPages(res.totalPages || 1);
      } catch {
        setError("No se pudieron cargar los posts.");
      } finally {
        setLoading(false);
      }
    })();
  }, [queryKey]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQ]);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Stack spacing={2}>
      <Typography variant="h4">Posts</Typography>

      <TextField label="Buscar" value={q} onChange={(e) => setQ(e.target.value)} fullWidth />

      {items.length === 0 ? (
        <Alert severity="info">No hay resultados.</Alert>
      ) : (
        <>
          {items.map((p) => (
            <Card key={p.id} variant="outlined">
              <CardActionArea component={RouterLink} to={`/posts/${p.id}`}>
                <CardContent>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <Chip size="small" label={p.category!.name || "General"} />
                    <Typography variant="caption" color="text.secondary">
                      {p.createdAt || ""}
                    </Typography>
                  </Stack>

                  <Typography variant="h6" sx={{ mb: 0.5 }}>
                    {p.title}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {p.excerpt || ""}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}

          <Stack direction="row" justifyContent="center" sx={{ py: 1 }}>
            <Pagination count={totalPages} page={page} onChange={(_, value) => setPage(value)} />
          </Stack>
        </>
      )}
    </Stack>
  );
}