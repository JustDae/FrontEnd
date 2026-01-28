import { useState, useEffect, useCallback, type JSX } from "react";
import {
  Alert, Box, Button, Card, CardContent, CardMedia, Container,
  Grid as Grid, Pagination, Stack, TextField, Typography,
  InputAdornment, Skeleton, Chip, Avatar, Zoom, alpha, useTheme, useMediaQuery
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
  container: { minHeight: '100vh', bgcolor: '#f8fafc', pb: { xs: 5, md: 10 } },
  searchBar: {
    width: '100%',
    maxWidth: { xs: '100%', sm: 600, md: 800 },
    mx: 'auto',
    '& .MuiOutlinedInput-root': {
      borderRadius: '50px',
      bgcolor: 'white',
      px: { xs: 2, md: 3 },
      height: { xs: '40px', md: '50px' },
      fontSize: { xs: '0.8rem', md: '0.9rem' },
      boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
      '& fieldset': { border: '1px solid #f1f5f9' },
      '&:hover fieldset': { borderColor: brandColor },
      '&.Mui-focused fieldset': { borderColor: brandColor, borderWidth: '2px' }
    }
  },
  productCard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: { xs: '16px', md: '24px' },
    border: '1px solid #f1f5f9',
    bgcolor: 'white',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      transform: { md: 'translateY(-8px)' },
      boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
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
    fontSize: { xs: '0.7rem', md: '0.75rem' },
    height: '24px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
  }
};

export default function PublicHome(): JSX.Element {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [sp, setSp] = useSearchParams();
  const navigate = useNavigate();

  const [q, setQ] = useState(sp.get("q") || "");
  const [items, setItems] = useState<Producto[]>([]);
  const [page, setPage] = useState(Number(sp.get("page") || "1"));
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMenu = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/productos", {
        params: { page, limit: 15, search: q }
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
      <Box sx={{ width: '100%', mb: { xs: 4, md: 6 } }}>
        <Box sx={{ 
          width: '100%', 
          height: { xs: '300px', sm: '450px', md: '600px' },
          overflow: 'hidden',
          bgcolor: '#1e293b'
        }}>
          <HomeCarousel />
        </Box>
      </Box>

      <Container maxWidth={false} sx={{ px: { xs: 2, sm: 4, md: 6, lg: 10 } }}>
        <Box sx={{ mb: { xs: 4, md: 6 }, textAlign: 'center' }}>
          <Stack direction="row" justifyContent="center" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
            <Avatar sx={{ width: { xs: 28, md: 32 }, height: { xs: 28, md: 32 }, bgcolor: alpha(brandColor, 0.1), color: brandColor }}>
              <LocalDining sx={{ fontSize: { xs: '0.9rem', md: '1.1rem' } }} />
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 900, color: '#0f172a', letterSpacing: '-1px', fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
              Menú <Box component="span" sx={{ color: brandColor }}>Fresco</Box>
            </Typography>
          </Stack>
          
          <TextField
            placeholder="Buscar platillos..."
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
            fullWidth
            sx={styles.searchBar}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: brandColor, fontSize: '1.1rem', ml: 1 }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {error && <Alert severity="error" sx={{ mb: 4, borderRadius: '15px', fontSize: '0.8rem' }}>{error}</Alert>}

        <Grid container spacing={{ xs: 2, md: 3 }}>
          {loading ? (
            Array.from(new Array(8)).map((_, i) => (
              <Grid key={i} size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }}>
                <Skeleton variant="rounded" height={220} sx={{ borderRadius: '24px', mb: 1 }} />
                <Skeleton width="60%" height={25} sx={{ mb: 1 }} />
                <Skeleton width="40%" height={20} />
              </Grid>
            ))
          ) : items.length === 0 ? (
            <Grid size={{ xs: 12 }}>
              <Stack alignItems="center" sx={{ py: 10, opacity: 0.3 }}>
                <RestaurantMenu sx={{ fontSize: { xs: 60, md: 80 }, mb: 1 }} />
                <Typography variant="body2" fontWeight={700}>Sin resultados</Typography>
              </Stack>
            </Grid>
          ) : (
            items.map((p) => (
              <Grid key={p.id} size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }}>
                <Zoom in style={{ transitionDelay: '50ms' }}>
                  <Card sx={styles.productCard} elevation={0}>
                    <Box sx={{ position: 'relative', overflow: 'hidden', height: { xs: 200, md: 180 } }}>
                      <CardMedia
                        className="card-image"
                        component="img"
                        image={getProductImageUrl(p.imageUrl)}
                        alt={p.nombre}
                        sx={{ height: '100%', transition: 'transform 0.6s ease', objectFit: 'cover' }}
                      />
                      <Chip label={`$${Number(p.precio).toFixed(2)}`} sx={styles.priceBadge} />
                    </Box>

                    <CardContent sx={{ p: { xs: 2, md: 2.5 }, flexGrow: 1 }}>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: brandColor, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.65rem' }}>
                        {p.categoria?.nombre || p.categoria?.name || "General"}
                      </Typography>
                      
                      <Typography variant="body2" sx={{ fontWeight: 800, mt: 0.5, mb: 0.5, color: '#1e293b', lineHeight: 1.2, fontSize: { xs: '0.9rem', md: '0.875rem' } }}>
                        {p.nombre}
                      </Typography>

                      <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 2, lineHeight: 1.4, height: '2.8rem', overflow: 'hidden', fontSize: '0.72rem' }}>
                        {p.descripcion || "Selección gourmet preparada con los mejores ingredientes."}
                      </Typography>

                      <Button
                        variant="contained"
                        fullWidth
                        size={isMobile ? "medium" : "small"}
                        endIcon={<ArrowForward sx={{ fontSize: '0.9rem' }} />}
                        onClick={() => navigate(`/productos/${p.id}`)}
                        sx={{
                          bgcolor: '#0f172a',
                          color: 'white',
                          py: { xs: 1.2, md: 1 },
                          borderRadius: '12px',
                          textTransform: 'none',
                          fontWeight: 700,
                          fontSize: '0.75rem',
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
          <Stack direction="row" justifyContent="center" sx={{ mt: { xs: 4, md: 6 } }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, v) => {
                setPage(v);
                window.scrollTo({ top: isMobile ? 300 : 500, behavior: 'smooth' });
              }}
              size={isMobile ? "medium" : "small"}
              siblingCount={isMobile ? 0 : 1}
              sx={{
                '& .MuiPaginationItem-root': { fontWeight: 700, fontSize: '0.75rem' },
                '& .Mui-selected': { bgcolor: `${brandColor} !important`, color: 'white' }
              }}
            />
          </Stack>
        )}
      </Container>
    </Box>
  );
}