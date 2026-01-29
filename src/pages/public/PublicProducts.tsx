import { type JSX, useEffect, useState } from "react";
import { 
  Box, Typography, Grid, Card, CardContent, Chip, CircularProgress, Alert, Container, Stack
} from "@mui/material";
import { getProductos, type Producto } from "../../services/productos.service";

export default function PublicProducts(): JSX.Element {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getProductos({ limit: 50 });
        setProductos(data.items || data);
      } catch {
        setError("No se pudo cargar el menú en este momento.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

<<<<<<< HEAD
  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <CircularProgress sx={{ color: "#F55345" }} />
    </Box>
  );

  if (error) return <Container sx={{ mt: 4 }}><Alert severity="error">{error}</Alert></Container>;

  return (
    <Container sx={{ py: 6 }}>
      <Stack spacing={1} mb={6} alignItems="center">
        <Typography variant="h3" sx={{ fontWeight: "bold", color: "#F55345" }}>
          Nuestro Menú
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Descubre los mejores sabores preparados para ti.
        </Typography>
      </Stack>

      <Grid container spacing={4}>
        {productos.map((prod) => (
          <Grid key={prod.id} size={{xs: 12, sm: 6, md: 4}}>
            <Card 
              elevation={0} 
              sx={{ 
                height: "100%", 
                borderRadius: 4, 
                border: "1px solid #eee",
                transition: "0.3s",
                "&:hover": { transform: "translateY(-5px)", boxShadow: "0 10px 20px rgba(0,0,0,0.05)" }
              }}
            >
              {/* Aquí podrías poner una imagen si la tienes en tu backend */}
              <Box 
                sx={{ 
                  height: 200, 
                  bgcolor: "rgba(245, 83, 69, 0.05)", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center" 
                }}
              >
                <Typography variant="h1" sx={{ opacity: 0.1 }}>🍲</Typography>
              </Box>

              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {prod.nombre}
                  </Typography>
                  <Typography variant="h6" sx={{ color: "#F55345", fontWeight: "bold" }}>
                    ${prod.precio}
                  </Typography>
                </Stack>

                <Chip 
                  label={prod.categoria?.name || "Especialidad"} 
                  size="small" 
                  sx={{ bgcolor: "#eee", fontWeight: "500" }} 
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {productos.length === 0 && (
        <Typography variant="h6" textAlign="center" color="text.secondary" mt={10}>
          Próximamente estaremos agregando nuevos platillos.
        </Typography>
=======
  return (
    <Container 
      id="menu" 
      sx={{ 
        py: 6, 
        minHeight: "60vh",
        scrollMarginTop: "100px" 
      }}
    >
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" py={10}>
          <CircularProgress sx={{ color: "#F55345" }} />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <>
          <Stack spacing={1} mb={6} alignItems="center">
            <Typography variant="h3" sx={{ fontWeight: "bold", color: "#F55345" }}>
              Nuestro Menú
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Descubre los mejores sabores preparados para ti.
            </Typography>
          </Stack>

          <Grid container spacing={4}>
            {productos.map((prod) => (
              <Grid key={prod.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card 
                  elevation={0} 
                  sx={{ 
                    height: "100%", 
                    borderRadius: 4, 
                    border: "1px solid #eee",
                    transition: "0.3s",
                    "&:hover": { 
                      transform: "translateY(-5px)", 
                      boxShadow: "0 10px 20px rgba(0,0,0,0.05)" 
                    }
                  }}
                >
                  <Box 
                    sx={{ 
                      height: 200, 
                      bgcolor: "rgba(245, 83, 69, 0.05)", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center" 
                    }}
                  >
                    <Typography variant="h1" sx={{ opacity: 0.1 }}>🍲</Typography>
                  </Box>

                  <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        {prod.nombre}
                      </Typography>
                      <Typography variant="h6" sx={{ color: "#F55345", fontWeight: "bold" }}>
                        ${prod.precio}
                      </Typography>
                    </Stack>
                    <Chip 
                      label={prod.categoria?.name || "Especialidad"} 
                      size="small" 
                      sx={{ bgcolor: "#eee", fontWeight: "500" }} 
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {productos.length === 0 && (
            <Typography variant="h6" textAlign="center" color="text.secondary" mt={10}>
              Próximamente estaremos agregando nuevos platillos.
            </Typography>
          )}
        </>
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
      )}
    </Container>
  );
}