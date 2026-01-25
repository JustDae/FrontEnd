import { useState, useEffect, type JSX } from "react";
import { 
  Box, Typography, TextField, Button, Paper, Table, 
  TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import { Search, Add, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getPedidos, createPedido, type Pedido } from "../../services/pedidos.service";
import { useUi } from "../../context/UiContext";

export default function PedidosPage(): JSX.Element {
  const { notify } = useUi();
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [filtro, setFiltro] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [nombreCliente, setNombreCliente] = useState("");

  const cargarPedidos = async () => {
    try {
      const res = await getPedidos({ search: filtro });
      const lista = res.data?.items || res.data || [];
      setPedidos(Array.isArray(lista) ? lista : []);
    } catch {
      setPedidos([]);
    }
  };

  useEffect(() => {
    cargarPedidos();
  }, [filtro]);

  const handleCrearPedido = async () => {
    if (!nombreCliente.trim()) {
      notify({ message: "El nombre del cliente es obligatorio", severity: "warning" });
      return;
    }

    try {
      const nuevoPedido = await createPedido({ 
        nombre_cliente: nombreCliente,
        direccion: "Local",
        telefono: "0999999999",
        correo: "cliente@restaurante.com",
        estado: "PENDIENTE",
        fecha_pedido: new Date().toISOString(),
        mesaId: 1,
        metodoPagoId: 1
      });

      notify({ message: "Pedido creado con éxito", severity: "success" });
      setOpenModal(false);
      setNombreCliente("");
      
      if (nuevoPedido.data?.id) {
        navigate(`/dashboard/detalle-pedido/${nuevoPedido.data.id}`);
      }
    } catch (error) {
      notify({ message: "Error al crear el pedido", severity: "error" });
    }
  };

  const verDetalle = (id: string) => {
    navigate(`/dashboard/detalle-pedido/${id}`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>Gestión de Pedidos</Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={() => setOpenModal(true)}
          sx={{ bgcolor: "#F55345", "&:hover": { bgcolor: "#d44538" } }}
        >
          Abrir Mesa / Cliente
        </Button>
      </Box>

      <TextField
        fullWidth
        placeholder="Buscar pedido o cliente..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        sx={{ mb: 3, bgcolor: "white" }}
        InputProps={{ endAdornment: <Search /> }}
      />

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead sx={{ bgcolor: "#f5f5f5" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Cliente</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Total</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Fecha</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pedidos.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.id.substring(0, 8)}</TableCell>
                <TableCell>{p.nombre_cliente}</TableCell>
                <TableCell>${p.total}</TableCell>
                <TableCell>{new Date(p.createdAt).toLocaleDateString()}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => verDetalle(p.id)}>
                    <Visibility />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: "bold" }}>Nueva Orden</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre del Cliente o Mesa"
            fullWidth
            variant="outlined"
            value={nombreCliente}
            onChange={(e) => setNombreCliente(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenModal(false)}>Cancelar</Button>
          <Button 
            onClick={handleCrearPedido} 
            variant="contained" 
            sx={{ bgcolor: "#F55345", "&:hover": { bgcolor: "#d44538" } }}
          >
            Confirmar y Abrir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}