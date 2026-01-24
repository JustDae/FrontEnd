import { useState, useEffect, type JSX } from "react";
import {
  Box, Typography, TextField, IconButton, Button,
  List, ListItem, ListItemText, ListItemSecondaryAction, Paper
} from "@mui/material";
import { Search, Edit, Delete } from "@mui/icons-material";
import { 
  getDetallePedidos, 
  deleteDetallePedido, 
  type DetallePedido 
} from "../../services/detalle-pedido.service";
import DetallePedidoFormDialog from "../../components/detalle-pedido/DetallePedidoFormDialog";

export default function DetallePedido(): JSX.Element {
  const [detalles, setDetalles] = useState<DetallePedido[]>([]);
  const [filtro, setFiltro] = useState("");
  const [open, setOpen] = useState(false);
  const [editando, setEditando] = useState<DetallePedido | null>(null);

  const fetchDetalles = (): void => {
    getDetallePedidos()
      .then(res => setDetalles(res.items));
  }

  useEffect(fetchDetalles, []);

  const filtrados = detalles.filter(d =>
    d.producto?.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    d.pedidoId.toString().includes(filtro)
  );

  const eliminar = (id: number): void => {
    if (confirm("¿Eliminar este detalle del pedido?")) {
      deleteDetallePedido(id)
        .then(fetchDetalles);
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
      <Typography variant="h5" gutterBottom>Detalles de Pedidos</Typography>
      <Box display="flex" gap={2} alignItems="center" mb={2}>
        <TextField
          placeholder="Buscar..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          InputProps={{ endAdornment: <Search /> }}
        />
        <Button 
          variant="contained" 
          color="primary" 
          onClick={abrirNuevo}
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
                <IconButton onClick={() => abrirEditar(detalle)} color="primary">
                  <Edit />
                </IconButton>
                <IconButton onClick={() => eliminar(detalle.id)} color="error">
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>

      <DetallePedidoFormDialog
        open={open}
        mode={editando ? "edit" : "create"}
        initial={editando}
        productos={[]} 
        pedidos={[]}
        onClose={() => setOpen(false)}
        onSubmit={() => {
            setOpen(false);
            fetchDetalles();
        }}
      />
    </Box>
  );
}