import { useState, useEffect, useCallback, type JSX } from "react";
import {
  Alert, Box, Button, Card, CardContent, CardMedia, Container,
  Grid as Grid, Pagination, Stack, TextField, Typography,
  InputAdornment, Skeleton, Chip, Avatar, Zoom
} from "@mui/material";
import { Search, LocalDining, ArrowForward, RestaurantMenu } from "@mui/icons-material";
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
  categoria?: { id: number; name?: string; nombre?: string };
}

const brandColor = '#F55345';

const styles = {
  container: { minHeight: '100vh', bgcolor: '#f8fafc', pb: 10 },
  searchBar: {
    maxWidth: 700,
    mx: 'auto',
    '& .MuiOutlinedInput-root': {
      borderRadius: '50px',
      bgcolor: 'white',
      px: 3,
      boxShadow: '0 10px 40px rgba(0,0,0,0.04)',
      '& fieldset': { border: '1px solid #f1f5f9' },
      '&:hover fieldset': { borderColor: brandColor },
      '&.Mui-focused fieldset': { borderColor: brandColor, borderWidth: '2px' }
    }
  },
  productCard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '32px',
    border: '1px solid #f1f5f9',
    bgcolor: 'white',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      transform: 'translateY(-12px)',
      boxShadow: '0 30px 60px rgba(0,0,0,0.1)',
      '& .card-image': { transform: 'scale(1.08)' }
    }
  },
  priceBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    bgcolor: 'rgba(255,255,255,0.9)',
    backdropFilter: 'blur(8px)',
    color: '#1e293b',
    fontWeight: 900,
    fontSize: '1.1rem',
    px: 1,
    boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
  }
};

export default function PublicHome(): JSX.Element {
  const [sp, setSp] = useSearchParams();
  const navigate = useNavigate();

  const qParam = sp.get("q") || "";
  const pageParam = Number(sp.get("page") || "1");

  const [q, setQ] = useState(qParam);
  const [items, setItems] = useState<Producto[]>([]);
  const [page, setPage] = useState(pageParam > 0 ? pageParam : 1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMenu = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/productos", {
        params: { page, limit: 9, search: q }
      });
      const result = res.data?.data?.items || res.data?.items || [];
      setItems(result);
      setTotalPages(res.data?.data?.meta?.totalPages || 1);
    } catch {
      setError("Error al conectar con la cocina.");
    } finally {
      setLoading(false);
    }
  }, [page, q]);

  useEffect(() => {
    const timer = setTimeout(() => fetchMenu(), 400);
    return () => clearTimeout(timer);
  }, [fetchMenu]);

  useEffect(() => {
    setSp({ q, page: String(page) }, { replace: true });
  }, [q, page, setSp]);

  return (
    <Box sx={styles.container}>
      <Container maxWidth="xl" sx={{ mt: 2, mb: 6 }}>
        <Box sx={{ borderRadius: '40px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
          <HomeCarousel />
        </Box>
      </Container>

      <Container maxWidth="lg">
        <Box sx={{ mb: 8, textAlign: 'center' }}>
          <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <Avatar sx={{ bgcolor: `${brandColor}15`, color: brandColor }}>
              <LocalDining />
            </Avatar>
            <Typography variant="h3" sx={{ fontWeight: 950, color: '#0f172a', letterSpacing: '-2px' }}>
              Menú <Box component="span" sx={{ color: brandColor }}>Fresco</Box>
            </Typography>
          </Stack>
          
          <TextField
            placeholder="¿Qué te gustaría comer?"
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
            fullWidth
            sx={styles.searchBar}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: brandColor, ml: 1 }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {error && <Alert severity="error" sx={{ mb: 4, borderRadius: '20px' }}>{error}</Alert>}

        <Grid container spacing={4}>
          {loading ? (
            [1, 2, 3, 4, 5, 6].map((i) => (
              <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                <Skeleton variant="rounded" height={280} sx={{ borderRadius: '32px', mb: 2 }} />
                <Skeleton width="60%" height={30} />
              </Grid>
            ))
          ) : items.length === 0 ? (
            <Grid size={{ xs: 12 }}>
              <Stack alignItems="center" sx={{ py: 10, opacity: 0.3 }}>
                <RestaurantMenu sx={{ fontSize: 100, mb: 2 }} />
                <Typography variant="h5" fontWeight={700}>No hay platos disponibles</Typography>
              </Stack>
            </Grid>
          ) : (
            items.map((p) => (
              <Grid key={p.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Zoom in style={{ transitionDelay: '100ms' }}>
                  <Card sx={styles.productCard} elevation={0}>
                    <Box sx={{ position: 'relative', overflow: 'hidden', height: 260 }}>
                      <CardMedia
                        className="card-image"
                        component="img"
                        image={getProductImageUrl(p.imageUrl)}
                        alt={p.nombre}
                        sx={{ height: '100%', transition: 'transform 0.6s ease' }}
                      />
                      <Chip label={`$${Number(p.precio).toFixed(2)}`} sx={styles.priceBadge} />
                    </Box>

                    <CardContent sx={{ p: 4, flexGrow: 1 }}>
                      <Typography variant="overline" sx={{ fontWeight: 900, color: brandColor, letterSpacing: '1px' }}>
                        {p.categoria?.nombre || p.categoria?.name || "General"}
                      </Typography>
                      
                      <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5, mb: 1.5, color: '#1e293b' }}>
                        {p.nombre}
                      </Typography>

                      <Typography variant="body2" sx={{ color: '#64748b', mb: 4, lineHeight: 1.7, minHeight: '3.4rem' }}>
                        {p.descripcion || "Ingredientes seleccionados para una experiencia de sabor inolvidable."}
                      </Typography>

                      <Button
                        variant="contained"
                        fullWidth
                        endIcon={<ArrowForward />}
                        onClick={() => navigate(`/productos/${p.id}`)}
                        sx={{
                          bgcolor: '#0f172a',
                          color: 'white',
                          py: 1.8,
                          borderRadius: '18px',
                          textTransform: 'none',
                          fontWeight: 800,
                          '&:hover': { bgcolor: brandColor, boxShadow: `0 12px 24px ${brandColor}40` }
                        }}
                      >
                        Ver Detalles
                      </Button>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>
            ))
          )}
        </Grid>

        {!loading && items.length > 0 && (
          <Stack direction="row" justifyContent="center" sx={{ mt: 8 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, v) => setPage(v)}
              size="large"
              sx={{
                '& .MuiPaginationItem-root': { fontWeight: 700 },
                '& .Mui-selected': { bgcolor: `${brandColor} !important`, color: 'white' }
              }}
            />
          </Stack>
        )}
      </Container>
    </Box>
  );
}