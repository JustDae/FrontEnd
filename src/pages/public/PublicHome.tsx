import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  Grid,
  Pagination,
  Stack,
  TextField,
  Typography,
  Chip
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getPublicProducts, getProductImageUrl, type ProductoDto } from "../../services/productos.service";
import { HomeCarousel } from "../../components/public/HomeCarousel";

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
  const navigate = useNavigate();

  const qParam = sp.get("q") || "";
  const pageParam = Number(sp.get("page") || "1");
  const limitParam = Number(sp.get("limit") || "9");

  const [q, setQ] = useState(qParam);
  const debouncedQ = useDebouncedValue(q, 450);

  const [items, setItems] = useState<ProductoDto[]>([]);
  const [page, setPage] = useState(Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1);
  const [limit] = useState(Number.isFinite(limitParam) && limitParam > 0 ? limitParam : 9);

  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const brandColor = '#F55345';

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

        const res = await getPublicProducts(queryKey);

        if (res.data) {
          setItems(res.data.items);
          setTotalPages(res.data.meta.totalPages);
        } else {
            setItems([]);
        }

      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el menú. Revisa la conexión con el servidor.");
      } finally {
        setLoading(false);
      }
    })();
  }, [queryKey]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQ]);

  if (loading && items.length === 0) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
      <CircularProgress sx={{ color: brandColor }} />
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa', pb: 8 }}>

      <Container maxWidth="xl" sx={{ mt: 2, mb: 6 }}>
        <HomeCarousel />
      </Container>

      <Container maxWidth="lg">
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#222', mb: 1 }}>
            Nuestro Menú
          </Typography>
          <Box sx={{ width: '60px', height: '4px', bgcolor: brandColor, mx: 'auto', mb: 4, borderRadius: 2 }} />

          <TextField
            label="¿Qué se te antoja hoy?"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            fullWidth
            sx={{ maxWidth: 500, bgcolor: 'white' }}
          />
        </Box>

        {error ? (
          <Alert severity="error">{error}</Alert>
        ) : items.length === 0 ? (
          <Alert severity="info" sx={{ mt: 2 }}>No encontramos platillos activos.</Alert>
        ) : (
          <Grid container spacing={4}>
            {items.map((p) => (
              <Grid item key={p.id} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    transition: 'all 0.3s ease',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 30px rgba(0,0,0,0.12)'
                    }
                  }}
                >
                  <Box sx={{ position: 'relative', overflow: 'hidden', height: 220 }}>
                    <CardMedia
                      component="img"
                      height="100%"
                      // Usamos el helper para la URL completa
                      image={getProductImageUrl(p.imagen)}
                      alt={p.nombre}
                      sx={{ objectFit: 'cover' }}
                    />
                    <Box sx={{
                      position: 'absolute',
                      bottom: 10,
                      right: 10,
                      bgcolor: 'white',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: '8px',
                      fontWeight: 'bold',
                      color: brandColor,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                    }}>
                      ${Number(p.precio).toFixed(2)}
                    </Box>
                  </Box>

                  <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
                    <Stack direction="row" spacing={1} mb={1}>
                       {p.category && (
                         <Chip
                            label={p.category.name}
                            size="small"
                            sx={{ bgcolor: '#fff0ee', color: brandColor, fontWeight: 600 }}
                         />
                       )}
                    </Stack>

                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, lineHeight: 1.2 }}>
                      {p.nombre}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flexGrow: 1 }}>
                      {p.descripcion || "Una delicia preparada al momento."}
                    </Typography>

                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => navigate(`/product/${p.id}`)}
                      sx={{
                        bgcolor: brandColor,
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 700,
                        py: 1,
                        boxShadow: 'none',
                        '&:hover': { bgcolor: '#d44336' }
                      }}
                    >
                      Ordenar
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {totalPages > 1 && (
            <Stack direction="row" justifyContent="center" sx={{ py: 6 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
                size="large"
              />
            </Stack>
        )}
      </Container>
    </Box>
  );
}