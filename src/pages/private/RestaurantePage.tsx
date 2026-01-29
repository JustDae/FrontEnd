import { useState, useEffect, type JSX } from "react";
import {
  Box, Typography, Button, Paper, Stack, Grid, Chip, Avatar
} from "@mui/material";
import {
  Edit, Store, Phone, LocationOn, Receipt, Assignment
} from "@mui/icons-material";
import { useUi } from "../../context/UiContext";
import {
  getRestaurante,
  createRestaurante,
  updateRestaurante,
  uploadRestauranteLogo,
  type Restaurante
} from "../../services/restaurante.service";
import RestauranteFormDialog from "../../components/restaurante/RestauranteFormDialog";

export default function RestaurantePage(): JSX.Element {
  const { notify } = useUi();
  const [restaurante, setRestaurante] = useState<Restaurante | null>(null);
  const [open, setOpen] = useState(false);
  const VITE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const fetchRestaurante = async () => {
    try {
      const res: any = await getRestaurante();
      const lista = res.data || res;
      if (Array.isArray(lista) && lista.length > 0) {
        setRestaurante(lista[0]);
      } else {
        setRestaurante(null);
      }
    } catch (err) {
      console.error(err);
      notify({ message: "Error al cargar datos del restaurante", severity: "error" });
    }
  };

  useEffect(() => { fetchRestaurante(); }, []);

  const handleSave = async (payload: any) => {
    try {
      const { logoFile, ...restData } = payload;
      let currentRest;

      if (restaurante) {
        const res = await updateRestaurante(restaurante.id, restData);
        currentRest = res.data || res;
      } else {
        const res = await createRestaurante(restData);
        currentRest = res.data || res;
      }

      if (logoFile && currentRest?.id) {
        await uploadRestauranteLogo(currentRest.id, logoFile);
      }

      notify({ message: "Configuración guardada con éxito", severity: "success" });
      setOpen(false);
      fetchRestaurante();
    } catch (err) {
      console.error(err);
      notify({ message: "Error al guardar la configuración", severity: "error" });
    }
  };

  return (
    <Box sx={{
      p: 4,
      bgcolor: "#f9f9f9",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    }}>
      <Typography variant="h4" sx={{ fontWeight: 900, mb: 4, color: "#2d3436" }}>
        Configuración del Negocio
      </Typography>

      {!restaurante ? (
        <Paper sx={{
          p: 8,
          textAlign: "center",
          borderRadius: "20px",
          overflow: "hidden",
          border: "3px dashed #ccc",
          bgcolor: 'transparent',
          width: "100%",
          maxWidth: 900,
          elevation: 4,
        }}>
          <Store sx={{ fontSize: 80, color: "#ccc", mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Parece que aún no has configurado tu restaurante.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => setOpen(true)}
            sx={{ mt: 3, bgcolor: "#F55345", borderRadius: '10px', px: 4 }}
          >
            Empezar Configuración
          </Button>
        </Paper>
      ) : (
        <Paper sx={{ borderRadius: "20px", overflow: "hidden", maxWidth: 900, mx: "auto", elevation: 4 }}>
          <Box sx={{ bgcolor: "#2d3436", color: "white", p: 5, position: "relative" }}>
             <Stack direction="row" spacing={4} alignItems="center">
                <Avatar
                  src={restaurante.logo ? `${VITE_API_URL}/restaurante/${restaurante.logo}` : ""}
                  sx={{ width: 120, height: 120, borderRadius: "15px", bgcolor: 'white', border: '4px solid #F55345' }}
                >
                  <Store sx={{ fontSize: 60, color: '#2d3436' }} />
                </Avatar>
                 <Box>
                  <Typography variant="overline" sx={{ letterSpacing: 2, color: '#F55345', fontWeight: 'bold' }}>
                    DATOS OFICIALES
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                    {restaurante.name}
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.8, fontWeight: 300 }}>
                    {restaurante.slogan || "Sin slogan configurado"}
                  </Typography>
                </Box>
             </Stack>

             <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={() => setOpen(true)}
                sx={{
                  position: "absolute", top: 30, right: 30,
                  bgcolor: "rgba(255,255,255,0.1)", backdropFilter: 'blur(10px)',
                  "&:hover": { bgcolor: "rgba(255,255,255,0.2)" }
                }}
             >
               Editar Perfil
             </Button>
          </Box>

          <Box sx={{ p: 5 }}>
            <Grid container spacing={5}>
              <Grid size={{ xs:12, md:6 }}>
                 <Stack spacing={4}>
                    <InfoBox icon={<Assignment />} label="RUC / Identificación" value={restaurante.ruc} />
                    <InfoBox icon={<LocationOn />} label="Dirección Física" value={restaurante.direccion} />
                 </Stack>
              </Grid>
              <Grid size={{ xs:12, md:6 }}>
                 <Stack spacing={4}>
                    <InfoBox icon={<Phone />} label="Teléfono de Contacto" value={restaurante.telefono} />
                    <Stack direction="row" spacing={2} alignItems="center">
                       <Receipt color="disabled" />
                       <Box>
                         <Typography variant="caption" color="text.secondary">Estado de Facturación</Typography>
                         <Box sx={{ mt: 0.5 }}>
                            <Chip label="Listo para emitir" color="success" size="small" variant="outlined" />
                         </Box>
                       </Box>
                    </Stack>
                 </Stack>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      )}

      <RestauranteFormDialog
        open={open}
        initial={restaurante}
        onClose={() => setOpen(false)}
        onSubmit={handleSave}
      />
    </Box>
  );
}

function InfoBox({ icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <Stack direction="row" spacing={2} alignItems="flex-start">
      <Box sx={{ color: '#F55345', mt: 0.5 }}>{icon}</Box>
      <Box>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold', textTransform: 'uppercase' }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500, color: '#2d3436' }}>
          {value}
        </Typography>
      </Box>
    </Stack>
  );
}