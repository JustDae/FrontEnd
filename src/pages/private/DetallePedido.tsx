import { useState, useEffect, type JSX } from "react";
import { useLocation } from "react-router-dom";
import {
  Box, Typography, TextField, IconButton, Button,
  List, ListItem, ListItemText, ListItemSecondaryAction, Paper, LinearProgress
} from "@mui/material";
import { Search, Edit, Delete } from "@mui/icons-material";
import { 
  getDetallePedidos, 
  deleteDetallePedido, 
  type DetallePedido 
} from "../../services/detalle-pedido.service";
import DetallePedidoFormDialog from "../../components/detalle-pedido/DetallePedidoFormDialog";

import { useProductosOptions } from "../../hooks/useProductosOptions";
import { usePedidosOptions } from "../../hooks/usePedidosOptions";

export default function DetallePedido(): JSX.Element {
  const location = useLocation();
  
  const { options: productos, loading: loadingProd } = useProductosOptions();
  const { options: pedidos, loading: loadingPed } = usePedidosOptions();

  const [detalles, setDetalles] = useState<DetallePedido[]>([]);
  const [filtro, setFiltro] = useState("");
  const [open, setOpen] = useState(false);
  const [editando, setEditando] = useState<DetallePedido | null>(null);
  const [fetching, setFetching] = useState(false);

  const fetchDetalles = (): void => {
    setFetching(true);
    getDetallePedidos()
      .then(res => setDetalles(res.items))
      .finally(() => setFetching(false));
  }

  useEffect(fetchDetalles, []);

  useEffect(() => {
    if (location.state?.nuevoPedidoId) {
      setEditando(null);
      setOpen(true);
    }
  }, [location.state]);

  const filtrados = detalles.filter(d =>
    d.producto?.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    d.pedidoId.toString().includes(filtro)
  );

  const eliminar = (id: number): void => {
    if (confirm("¿Eliminar este detalle del pedido?")) {
      deleteDetallePedido(id).then(fetchDetalles);
    }
  }

  const abrirNuevo = (): void => {
    setEditando(null);
    setOpen(true);
  }

  const abrirEditar = (detalle: DetallePedido): void => {
    setEditando(detalle);
    setOpen(true);
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
        Detalles de Pedidos
      </Typography>
      
      {(loadingProd || loadingPed || fetching) && (
        <LinearProgress sx={{ mb: 2, bgcolor: "rgba(245, 83, 69, 0.1)", "& .MuiLinearProgress-bar": { bgcolor: "#F55345" } }} />
      )}

      <Box display="flex" gap={2} alignItems="center" mb={2}>
        <TextField
          placeholder="Buscar por plato o # pedido..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          InputProps={{ endAdornment: <Search /> }}
          fullWidth
        />
        <Button 
          variant="contained" 
          onClick={abrirNuevo}
          sx={{ bgcolor: "#F55345", "&:hover": { bgcolor: "#d44538" }, minWidth: "160px" }}
        >
          Nuevo detalle
        </Button>
      </Box>

      <Paper variant="outlined">
        <List>
          {filtrados.map((detalle) => (
            <ListItem key={detalle.id} divider>
              <ListItemText 
                primary={`${detalle.producto?.nombre} x ${detalle.cantidad}`} 
                secondary={`Pedido #${detalle.pedidoId} - Subtotal: $${detalle.subtotal}`} 
              />
              <ListItemSecondaryAction>
                <IconButton onClick={() => abrirEditar(detalle)} sx={{ color: "#F55345" }}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => eliminar(detalle.id)} color="error">
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
          {filtrados.length === 0 && !fetching && (
            <Typography sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>
              No se encontraron registros.
            </Typography>
          )}
        </List>
      </Paper>

      <DetallePedidoFormDialog
        open={open}
        mode={editando ? "edit" : "create"}
        initial={editando || (location.state?.nuevoPedidoId ? { pedidoId: location.state.nuevoPedidoId } as any : null)}
        productos={productos} 
        pedidos={pedidos}
        onClose={() => setOpen(false)}
        onSubmit={() => {
            setOpen(false);
            fetchDetalles();
        }}
      />
    </Box>
  );
}