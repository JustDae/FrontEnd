import { useEffect, useMemo, useState, type JSX } from "react";
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
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getProductImageUrl } from "../../services/productos.service";
import api from "../../services/api";
import { HomeCarousel } from "../../components/public/HomeCarousel";

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  imageUrl?: string;
  descripcion?: string;
  categoria?: { id: number; name: string };
}

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

  const [q, setQ] = useState(qParam);
  const debouncedQ = useDebouncedValue(q, 450);

  const [items, setItems] = useState<Producto[]>([]);
  const [page, setPage] = useState(pageParam > 0 ? pageParam : 1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const brandColor = '#F55345';

  useEffect(() => {
    setSp((prev) => {
      const next = new URLSearchParams(prev);
      if (q) next.set("q", q);
      else next.delete("q");
      next.set("page", String(page));
      return next;
    });
  }, [q, page, setSp]);

  useEffect(() => {
    const fetchPublicMenu = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get("/productos", {
          params: {
            page,
            limit: 9,
            search: debouncedQ
          }
        });

        const result = res.data?.data?.items || res.data?.items || [];
        setItems(result);
        setTotalPages(res.data?.data?.meta?.totalPages || 1);
      } catch {
        setError("No se pudo cargar el menú del restaurante.");
      } finally {
        setLoading(false);
      }
    };

    fetchPublicMenu();
  }, [debouncedQ, page]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQ]);

  if (loading && items.length === 0) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
      <CircularProgress sx={{ color: brandColor }} />
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#ffffff', pb: 8 }}>
      <Container maxWidth="xl" sx={{ mt: 2, mb: 6 }}>
        <HomeCarousel />
      </Container>

      <Container maxWidth="lg">
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#222', mb: 1 }}>
            Nuestro Menú
          </Typography>
          <Box sx={{ width: '50px', height: '4px', bgcolor: brandColor, mx: 'auto', mb: 4 }} />

          <TextField
            placeholder="¿Qué se te antoja hoy? (Tacos, Pizza...)"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            fullWidth
            sx={{ maxWidth: 600 }}
          />
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {items.length === 0 && !loading ? (
          <Alert severity="info" sx={{ mt: 2 }}>No encontramos platos con ese nombre.</Alert>
        ) : (
          <>
            <Grid container spacing={3}>
              {items.map((p) => (
                <Grid item key={p.id} xs={12} sm={6} md={4}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: '16px',
                      transition: '0.3s',
                      '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 12px 30px rgba(0,0,0,0.12)' }
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="220"
                      image={getProductImageUrl(p.imageUrl)}
                      alt={p.nombre}
                      sx={{ objectFit: 'cover' }}
                    />

                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: brandColor, textTransform: 'uppercase' }}>
                          {p.categoria?.name || "General"}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 800, color: '#2e7d32' }}>
                          ${p.precio}
                        </Typography>
                      </Stack>

                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                        {p.nombre}
                      </Typography>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, minHeight: '40px' }}>
                        {p.descripcion || "Plato preparado con ingredientes frescos del día."}
                      </Typography>

                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => navigate(`/productos/${p.id}`)}
                        sx={{
                          bgcolor: brandColor,
                          textTransform: 'none',
                          fontWeight: 700,
                          '&:hover': { bgcolor: '#d44336' }
                        }}
                      >
                        Ver Detalle
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Stack direction="row" justifyContent="center" sx={{ py: 6 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                sx={{ '& .Mui-selected': { bgcolor: `${brandColor} !important` } }}
              />
            </Stack>
          </>
        )}
      </Container>
    </Box>
  );
}