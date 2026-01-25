import { useState, type JSX } from "react";
import { Box, Typography, TextField, Button, Paper, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createPedido } from "../../services/pedidos.service";
import { useUi } from "../../context/UiContext";

export default function NewPedido(): JSX.Element {
  const navigate = useNavigate();
  const { notify } = useUi();
  const [nombre, setNombre] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(false);
    try {
      setLoading(true);
      const res = await createPedido({
      nombre_cliente: nombre.trim(),
      direccion: "Local",
      telefono: "9999999999",
      correo: "cliente@email.com",
      estado: "PENDIENTE",
      fecha_pedido: new Date().toISOString(),
      mesaId: 1,
      metodoPagoId: 1
    });
      notify({ message: "Pedido iniciado", severity: "success" });
      
      navigate("/dashboard/detalle-pedido", { 
        state: { nuevoPedidoId: res.data.id } 
      });
    } catch {
      notify({ message: "Error al crear el pedido", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
          Nuevo Pedido
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Ingrese el nombre del cliente para abrir la comanda.
        </Typography>

        <Stack component="form" onSubmit={handleSubmit} spacing={3}>
          <TextField
            label="Nombre del Cliente"
            fullWidth
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            autoFocus
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading || !nombre.trim()}
            sx={{ bgcolor: "#F55345", "&:hover": { bgcolor: "#d44538" }, py: 1.5 }}
          >
            {loading ? "Procesando..." : "Continuar"}
          </Button>
          <Button 
            variant="text" 
            fullWidth 
            onClick={() => navigate("/dashboard/detalle-pedido")}
          >
            Cancelar
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}