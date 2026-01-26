import { useState, useEffect, useMemo, type JSX } from "react";
import { 
  Box, Typography, TextField, Button, Paper, Table, 
  TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, Breadcrumbs, Link,
  Stack, Card, CardContent, Avatar, Skeleton, InputAdornment, Tooltip, Chip, Grid
} from "@mui/material";
import { 
  Search, Add, Visibility, NavigateNext, 
  ShoppingBag, PointOfSale
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getPedidos, createPedido, type Pedido } from "../../services/pedidos.service";
import { useUi } from "../../context/UiContext";

export default function PedidosPage(): JSX.Element {
  const { notify } = useUi();
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [nombreCliente, setNombreCliente] = useState("");

  const cargarPedidos = async () => {
    try {
      setLoading(true);
      const res = await getPedidos({ search: filtro });
      const lista = res.data?.items || res.data || [];
      setPedidos(Array.isArray(lista) ? lista : []);
    } catch {
      setPedidos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPedidos();
  }, [filtro]);

  const totalVentas = useMemo(() => {
    return pedidos.reduce((acc, p) => acc + (Number(p.total) || 0), 0);
  }, [pedidos]);

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
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#f4f6f8", minHeight: "100vh" }}>
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ mb: 1 }}>
          <Link underline="hover" color="inherit" onClick={() => navigate("/dashboard")} sx={{ cursor: "pointer", fontSize: 13 }}>
            Dashboard
          </Link>
          <Typography color="text.primary" sx={{ fontWeight: 600, fontSize: 13 }}>Pedidos</Typography>
        </Breadcrumbs>
        
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#1c252e" }}>
              Gestión de Pedidos
            </Typography>
            <Typography variant="body2" color="text.secondary">Control de comandas y facturación</Typography>
          </Box>
          <Button 
            variant="contained" 
            disableElevation
            startIcon={<Add />}
            onClick={() => setOpenModal(true)}
            sx={{ 
              bgcolor: "#F55345", 
              "&:hover": { bgcolor: "#d44538" },
              borderRadius: "10px",
              px: 3,
              fontWeight: 700,
              textTransform: "none"
            }}
          >
            Abrir Mesa
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined" sx={{ borderRadius: "16px", borderLeft: "6px solid #F55345", borderRight: "none", borderTop: "none", borderBottom: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: "rgba(245, 83, 69, 0.1)", color: "#F55345", width: 56, height: 56 }}>
                  <ShoppingBag />
                </Avatar>
                <Box>
                  <Typography variant="overline" sx={{ fontWeight: 700, color: "text.secondary" }}>Total Pedidos</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800 }}>{pedidos.length}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined" sx={{ borderRadius: "16px", borderLeft: "6px solid #4caf50", borderRight: "none", borderTop: "none", borderBottom: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: "rgba(76, 175, 80, 0.1)", color: "#4caf50", width: 56, height: 56 }}>
                  <PointOfSale />
                </Avatar>
                <Box>
                  <Typography variant="overline" sx={{ fontWeight: 700, color: "text.secondary" }}>Ventas Visibles</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: "#2e7d32" }}>${totalVentas.toFixed(2)}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper 
        elevation={0} 
        sx={{ 
          p: 0.5, 
          mb: 3, 
          borderRadius: "12px", 
          border: "1px solid rgba(145, 158, 171, 0.2)", 
          display: "flex", 
          alignItems: "center", 
          bgcolor: "white" 
        }}
      >
        <InputAdornment position="start" sx={{ ml: 2 }}>
          <Search color="action" />
        </InputAdornment>
        <TextField
          placeholder="Buscar por cliente o ID..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          fullWidth
          variant="standard"
          InputProps={{ disableUnderline: true, sx: { py: 1.5, px: 1, fontSize: 15 } }}
        />
      </Paper>

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: "16px", border: "1px solid #edf2f7", overflow: "hidden" }}>
        <Table>
          <TableHead sx={{ bgcolor: "#f8f9fa" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: "#718096" }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#718096" }}>CLIENTE</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#718096" }}>TOTAL</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#718096" }}>FECHA</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: "#718096" }}>ACCIONES</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}><TableCell colSpan={5}><Skeleton height={45} /></TableCell></TableRow>
              ))
            ) : pedidos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                  <Typography color="text.secondary">No hay pedidos registrados.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              pedidos.map((p) => (
                <TableRow key={p.id} hover>
                  <TableCell>
                    <Chip label={`#${p.id.substring(0, 8)}`} size="small" sx={{ fontWeight: 700, bgcolor: "#f4f6f8" }} />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{p.nombre_cliente}</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#F55345" }}>${p.total}</TableCell>
                  <TableCell color="text.secondary">{new Date(p.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Ver Detalles">
                      <IconButton color="primary" onClick={() => verDetalle(p.id)} sx={{ bgcolor: "rgba(25, 118, 210, 0.05)", "&:hover": { bgcolor: "rgba(25, 118, 210, 0.12)" } }}>
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: "16px", p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Nueva Orden</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Asigne un nombre a la mesa o al cliente.</Typography>
          <TextField
            autoFocus
            placeholder="Ej. Mesa 4 / Carlos"
            fullWidth
            variant="outlined"
            value={nombreCliente}
            onChange={(e) => setNombreCliente(e.target.value)}
            InputProps={{ sx: { borderRadius: "10px" } }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setOpenModal(false)} sx={{ textTransform: "none", color: "text.secondary" }}>Cancelar</Button>
          <Button 
            onClick={handleCrearPedido} 
            variant="contained" 
            disableElevation
            sx={{ bgcolor: "#F55345", "&:hover": { bgcolor: "#d44538" }, borderRadius: "8px", textTransform: "none", px: 3 }}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}