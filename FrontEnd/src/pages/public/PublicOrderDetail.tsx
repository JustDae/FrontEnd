import { type JSX, useEffect, useState } from "react";
import { Alert, Box, Button, Chip, CircularProgress, Stack, Typography, Paper, Divider } from "@mui/material";
import { Link as RouterLink, useParams } from "react-router-dom";
import { getDetallePedidoById, type DetallePedido } from "../../services/detalle-pedido.service";

export default function PublicOrderDetail(): JSX.Element {
  const { id } = useParams();
  const [detalle, setDetalle] = useState<DetallePedido | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        if (!id) throw new Error("missing id");
        setLoading(true);
        setError(null);
        const data: any = await getDetallePedidoById(id);
        setDetalle(data.data);
      } catch {
        setError("No se pudo cargar el detalle del pedido.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress color="primary" /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!detalle)
    return (
      <Stack spacing={2}>
        <Typography variant="h5">Detalle no encontrado</Typography>
        <Button variant="contained" component={RouterLink} to="/">
          Volver al Home
        </Button>
      </Stack>
    );

  return (
    <Stack spacing={3}>
      <Button variant="outlined" component={RouterLink} to="/" sx={{ width: "fit-content" }}>
        ← Volver
      </Button>

      <Paper elevation={0} sx={{ p: 3, border: "1px solid #eee", borderRadius: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center" mb={2}>
          <Chip 
            size="small" 
            label={`Pedido #${detalle.pedidoId}`} 
            sx={{ bgcolor: "#F55345", color: "white", fontWeight: "bold" }} 
          />
          <Typography variant="caption" color="text.secondary">
            ID Detalle: {detalle.id}
          </Typography>
        </Stack>

        <Typography variant="h4" gutterBottom>
          {detalle.producto?.nombre || "Producto"}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 2, mb: 3 }}>
          <Box>
            <Typography variant="caption" color="text.secondary">Precio Unitario</Typography>
            <Typography variant="h6">${detalle.precio_unitario}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">Cantidad</Typography>
            <Typography variant="h6">{detalle.cantidad}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">Subtotal</Typography>
            <Typography variant="h6" sx={{ color: "#F55345", fontWeight: "bold" }}>
              ${detalle.subtotal}
            </Typography>
          </Box>
        </Box>

        <Box>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Observaciones de preparación:
          </Typography>
          <Typography variant="body1" sx={{ fontStyle: detalle.observaciones ? "normal" : "italic", color: detalle.observaciones ? "text.primary" : "text.disabled" }}>
            {detalle.observaciones || "Sin observaciones adicionales."}
          </Typography>
        </Box>
      </Paper>
    </Stack>
  );
}