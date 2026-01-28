import { 
  Box, 
  Container, 
  Typography, 
  Stack, 
  Button,
  useTheme, 
  useMediaQuery 
} from "@mui/material";
import Grid from '@mui/material/Grid';
import type { JSX } from "react";

const brandColor = '#F55345';

export default function PublicAbout(): JSX.Element {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const galleryImages = [
    "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800",
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=800",
    "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?q=80&w=800",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800"
  ];

  return (
    <Box sx={{ bgcolor: 'white', pt: { xs: 8, md: 12 }, pb: 10 }}>
      <Container maxWidth="lg">
        <Stack spacing={10}>
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="overline" 
              sx={{ 
                fontWeight: 800, 
                color: brandColor, 
                letterSpacing: 2,
                display: 'block',
                mb: 1
              }}
            >
              Nuestra Historia
            </Typography>
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 950, 
                letterSpacing: '-2px', 
                color: '#0f172a',
                fontSize: { xs: '2.5rem', md: '4rem' },
                lineHeight: 1
              }}
            >
              Pasión por la <br /> excelencia culinaria.
            </Typography>
          </Box>

          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Grid container spacing={2}>
                {galleryImages.map((src, index) => (
                  <Grid key={index} size={{ xs: 6 }}>
                    <Box 
                      sx={{ 
                        borderRadius: '24px', 
                        overflow: 'hidden',
                        height: { xs: 140, md: 240 },
                        boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
                        transition: 'transform 0.3s ease',
                        '&:hover': { transform: 'scale(1.02)' }
                      }}
                    >
                      <Box
                        component="img"
                        src={src}
                        alt={`Galería ${index + 1}`}
                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={4}>
                <Stack spacing={2}>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>
                    Gastronomía con carácter.
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#64748b', fontSize: '1.1rem', lineHeight: 1.8 }}>
                    En <strong>MixBowls</strong>, elevamos ingredientes frescos con técnicas modernas. Creamos platos únicos diseñados para sorprender tus sentidos, manteniendo siempre la calidad premium como nuestra prioridad.
                  </Typography>
                </Stack>
                
                <Button 
                  variant="contained" 
                  size="large"
                  component="a"
                  href="/#menu" 
                  sx={{ 
                    bgcolor: brandColor, 
                    color: 'white',
                    borderRadius: '14px',
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 700,
                    textTransform: 'none',
                    width: 'fit-content',
                    textDecoration: 'none',
                    '&:hover': {
                      bgcolor: '#d44337',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 20px rgba(245, 83, 69, 0.3)'
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  Explorar el Menú
                </Button>
              </Stack>
            </Grid>
          </Grid>

          <Box 
            sx={{ 
              bgcolor: '#0f172a', 
              borderRadius: '40px', 
              p: { xs: 4, md: 8 },
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Grid container spacing={4} justifyContent="center">
              {[
                { label: 'Calidad', desc: 'Seleccionamos solo los ingredientes más frescos y de origen ético.' },
                { label: 'Innovación', desc: 'Reimaginamos sabores clásicos con técnicas culinarias modernas.' },
                { label: 'Pasión', desc: 'Cada detalle en tu plato es preparado con dedicación absoluta.' }
              ].map((item, index) => (
                <Grid key={index} size={{ xs: 12, md: 4 }}>
                  <Stack spacing={2} textAlign="center">
                    <Typography variant="h5" sx={{ fontWeight: 900, color: brandColor }}>
                      {item.label}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '1rem' }}>
                      {item.desc}
                    </Typography>
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Grid container spacing={6} alignItems="center" direction={isMobile ? 'column-reverse' : 'row'}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={3}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>
                  El arte de la armonía.
                </Typography>
                <Typography variant="body1" sx={{ color: '#64748b', fontSize: '1.1rem', lineHeight: 1.8 }}>
                  Nuestra filosofía se basa en el equilibrio perfecto. No se trata solo de servir alimentos; se trata de cómo los sabores audaces contrastan y se complementan. Las texturas sorprendentes y el punto exacto de cocción crean una sinfonía en tu paladar.
                </Typography>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box 
                sx={{ 
                  borderRadius: '32px', 
                  overflow: 'hidden',
                  height: { xs: 300, md: 500 },
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                }}
              >
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1920"
                  alt="Armonía de ingredientes frescos"
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}