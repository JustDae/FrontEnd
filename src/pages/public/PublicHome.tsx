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
    maxWidth: 550,
    mx: 'auto',
    '& .MuiOutlinedInput-root': {
      borderRadius: '50px',
      bgcolor: 'white',
      px: 3,
      height: '45px',
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
    borderRadius: '24px',
    border: '1px solid #f1f5f9',
    bgcolor: 'white',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
      '& .card-image': { transform: 'scale(1.05)' }
    }
  },
  priceBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    bgcolor: 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(4px)',
    color: '#1e293b',
    fontWeight: 800,
    fontSize: '0.9rem',
    height: '28px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
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
      <Container maxWidth="md" sx={{ mt: 2, mb: 4 }}>
        <Box sx={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', maxHeight: '300px' }}>
          <HomeCarousel />
        </Box>
      </Container>

      <Container maxWidth="md">
        <Box sx={{ mb: 5, textAlign: 'center' }}>
          <Stack direction="row" justifyContent="center" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: `${brandColor}15`, color: brandColor }}>
              <LocalDining sx={{ fontSize: '1.2rem' }} />
            </Avatar>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a', letterSpacing: '-1px' }}>
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
                  <Search sx={{ color: brandColor, fontSize: '1.2rem' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '15px' }}>{error}</Alert>}

        <Grid container spacing={3}>
          {loading ? (
            [1, 2, 3, 4, 5, 6].map((i) => (
              <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                <Skeleton variant="rounded" height={200} sx={{ borderRadius: '24px', mb: 1 }} />
                <Skeleton width="60%" />
              </Grid>
            ))
          ) : items.length === 0 ? (
            <Grid size={{ xs: 12 }}>
              <Stack alignItems="center" sx={{ py: 6, opacity: 0.3 }}>
                <RestaurantMenu sx={{ fontSize: 80, mb: 1 }} />
                <Typography variant="h6" fontWeight={700}>No hay platos</Typography>
              </Stack>
            </Grid>
          ) : (
            items.map((p) => (
              <Grid key={p.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Zoom in style={{ transitionDelay: '50ms' }}>
                  <Card sx={styles.productCard} elevation={0}>
                    <Box sx={{ position: 'relative', overflow: 'hidden', height: 160 }}>
                      <CardMedia
                        className="card-image"
                        component="img"
                        image={getProductImageUrl(p.imageUrl)}
                        alt={p.nombre}
                        sx={{ height: '100%', transition: 'transform 0.6s ease', objectFit: 'cover' }}
                      />
                      <Chip label={`$${Number(p.precio).toFixed(2)}`} sx={styles.priceBadge} />
                    </Box>

                    <CardContent sx={{ p: 2, flexGrow: 1 }}>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: brandColor, textTransform: 'uppercase' }}>
                        {p.categoria?.nombre || p.categoria?.name || "General"}
                      </Typography>
                      
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, mt: 0.2, mb: 0.5, color: '#1e293b', lineHeight: 1.2 }}>
                        {p.nombre}
                      </Typography>

                      <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 2, lineHeight: 1.4, height: '2.8rem', overflow: 'hidden' }}>
                        {p.descripcion || "Ingredientes seleccionados para una experiencia única."}
                      </Typography>

                      <Button
                        variant="contained"
                        fullWidth
                        size="small"
                        endIcon={<ArrowForward sx={{ fontSize: '1rem' }} />}
                        onClick={() => navigate(`/productos/${p.id}`)}
                        sx={{
                          bgcolor: '#0f172a',
                          color: 'white',
                          py: 1,
                          borderRadius: '12px',
                          textTransform: 'none',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          '&:hover': { bgcolor: brandColor, boxShadow: `0 8px 16px ${brandColor}30` }
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
          <Stack direction="row" justifyContent="center" sx={{ mt: 5 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, v) => setPage(v)}
              size="medium"
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