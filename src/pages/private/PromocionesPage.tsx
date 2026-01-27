import { useState, useEffect, type JSX } from "react";
import {
  Box, Typography, Button, Grid, Card, CardContent,
  IconButton, Chip, Stack, Divider
} from "@mui/material";
import { LocalOffer, Delete, Add, Event, ConfirmationNumber } from "@mui/icons-material";
import { useUi } from "../../context/UiContext";
import { getPromociones, deletePromocion, createPromocion, type Promocion } from "../../services/promocion.service";
import PromocionFormDialog from "../../components/promociones/PromocionFormDialog";

export default function PromocionesPage(): JSX.Element {
  const { notify } = useUi();
  const [promos, setPromos] = useState<Promocion[]>([]);
  const [open, setOpen] = useState(false);

  const fetchPromos = async () => {
    try {
      const data = await getPromociones();
      setPromos(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      notify({ message: "Error al cargar promociones", severity: "error" });
    }
  };

  useEffect(() => { fetchPromos(); }, []);

  const handleCreate = async (payload: Partial<Promocion>) => {
    try {
      await createPromocion(payload);
      notify({ message: "¡Promoción lanzada!", severity: "success" });
      setOpen(false);
      fetchPromos();
    } catch (err) {
      notify({ message: "Error al crear la promo", severity: "error" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Seguro que quieres quitar esta oferta?")) return;
    try {
      await deletePromocion(id);
      notify({ message: "Promoción eliminada", severity: "success" });
      fetchPromos();
    } catch (err) {
      notify({ message: "No se pudo eliminar", severity: "error" });
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: "#2d3436" }}>
            Promociones y Ofertas
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gestiona los descuentos activos en MongoDB
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
          sx={{ bgcolor: "#F55345", borderRadius: "10px", px: 3 }}
        >
          Nueva Promo
        </Button>
      </Stack>

      <Grid container spacing={3}>
        {promos.map((promo) => (
          <Grid item xs={12} sm={6} md={4} key={promo._id}>
            <Card sx={{ borderRadius: "16px", position: "relative", overflow: "visible" }}>
              {/* Listón de Descuento */}
              <Box sx={{
                position: "absolute", top: -10, right: 10, bgcolor: "#F55345",
                color: "white", px: 2, py: 0.5, borderRadius: "8px", fontWeight: "bold",
                boxShadow: 3
              }}>
                -{promo.descuentoPorcentaje}%
              </Box>

              <CardContent sx={{ pt: 4 }}>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <ConfirmationNumber color="action" />
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>{promo.nombre}</Typography>
                  </Stack>

                  <Typography variant="body2" color="text.secondary" sx={{ minHeight: 40 }}>
                    {promo.descripcion || "Sin descripción adicional"}
                  </Typography>

                  <Divider />

                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">CÓDIGO</Typography>
                      <Chip label={promo.codigo} size="small" sx={{ fontWeight: "bold", bgcolor: "#eee" }} />
                    </Box>
                    <IconButton color="error" onClick={() => handleDelete(promo._id!)}>
                      <Delete />
                    </IconButton>
                  </Stack>

                  <Stack direction="row" spacing={1} alignItems="center" sx={{ bgcolor: "#f9f9f9", p: 1, borderRadius: "8px" }}>
                    <Event sx={{ fontSize: 18, color: "text.secondary" }} />
                    <Typography variant="caption" color="text.secondary">
                      Válido hasta: {new Date(promo.fechaFin).toLocaleDateString()}
                    </Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <PromocionFormDialog
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleCreate}
      />
    </Box>
  );
}