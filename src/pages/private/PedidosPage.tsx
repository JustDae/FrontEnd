import { useState, useEffect, type JSX } from "react";
import {
  Box, Typography, TextField, IconButton, Button,
  List, ListItem, ListItemText, ListItemSecondaryAction, Paper, Chip,
  Stack
} from "@mui/material";
import { Search, Visibility, Delete, Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getPedidos, deletePedido, type Pedido } from "../../services/pedidos.service";
import { useUi } from "../../context/UiContext";

export default function PedidosPage(): JSX.Element {
  const { notify } = useUi();
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [filtro, setFiltro] = useState("");

  const fetchPedidos = (): void => {
    getPedidos()
      .then(res => setPedidos(res.items || res.data.items));
  }

  useEffect(fetchPedidos, []);

  const filtrados = pedidos.filter(p =>
    p.nombre_cliente.toLowerCase().includes(filtro.toLowerCase()) ||
    p.id.toString().includes(filtro)
  );

  const eliminar = (id: string): void => {
    if (confirm("¿Eliminar este pedido permanentemente?")) {
      deletePedido(id).then(() => {
        notify({ message: "Pedido eliminado", severity: "success" });
        fetchPedidos();
      });
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>Gestión de Pedidos</Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={() => navigate("/dashboard/pedidos/nuevo")}
          sx={{ bgcolor: "#F55345", "&:hover": { bgcolor: "#d44538" } }}
        >
          Abrir Mesa / Cliente
        </Button>
      </Stack>

      <Box mb={3}>
        <TextField
          placeholder="Buscar pedido o cliente..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          fullWidth
          InputProps={{ endAdornment: <Search /> }}
        />
      </Box>

      <Paper variant="outlined">
        <List>
          {filtrados.map((pedido) => (
            <ListItem key={pedido.id} divider>
              <ListItemText 
                primary={pedido.nombre_cliente} 
                secondary={`ID: ${pedido.id} | Fecha: ${new Date(pedido.createdAt).toLocaleDateString()}`} 
              />
              <Box sx={{ mr: 8 }}>
                <Chip 
                  label={`Total: $${pedido.total}`} 
                  color="primary" 
                  variant="outlined" 
                  sx={{ fontWeight: "bold", borderColor: "#F55345", color: "#F55345" }}
                />
              </Box>
              <ListItemSecondaryAction>
                <IconButton 
                  onClick={() => navigate(`/dashboard/detalle-pedido`, { state: { pedidoId: pedido.id } })}
                  sx={{ color: "#F55345" }}
                >
                  <Visibility />
                </IconButton>
                <IconButton onClick={() => eliminar(pedido.id)} color="error">
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
}