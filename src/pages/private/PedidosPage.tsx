<<<<<<< HEAD
import { useState, useEffect, useMemo, type JSX } from "react";
=======
import { useState, useEffect, useMemo, useCallback, type JSX } from "react";
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
import { 
  Box, Typography, TextField, Button, Paper, Table, 
  TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, Breadcrumbs, Link,
<<<<<<< HEAD
  Stack, Card, CardContent, Avatar, Skeleton, InputAdornment, Tooltip, Chip, Grid
} from "@mui/material";
import { 
  Search, Add, Visibility, NavigateNext, 
  ShoppingBag, PointOfSale
=======
  Stack, Card, CardContent, Avatar, Skeleton, Tooltip, Chip, Grid
} from "@mui/material";
import { 
  Search, Add, Visibility, NavigateNext, 
  ShoppingBag, PointOfSale, AccessTime, Person
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getPedidos, createPedido, type Pedido } from "../../services/pedidos.service";
import { useUi } from "../../context/UiContext";

<<<<<<< HEAD
=======
const styles = {
  container: { p: { xs: 2, md: 4 }, bgcolor: "#f8fafc", minHeight: "100vh" },
  statCard: { 
    borderRadius: "20px", border: "none", 
    boxShadow: "0 4px 20px rgba(0,0,0,0.03)", bgcolor: "white",
    transition: "transform 0.2s", "&:hover": { transform: "translateY(-4px)" }
  },
  actionButton: { 
    bgcolor: "#F55345", "&:hover": { bgcolor: "#d44538", boxShadow: "0 8px 20px rgba(245, 83, 69, 0.3)" },
    borderRadius: "12px", px: 4, py: 1.2, fontWeight: 700, textTransform: "none" 
  },
  searchBar: {
    bgcolor: "white", borderRadius: "16px", px: 2, mb: 4,
    boxShadow: "0 2px 10px rgba(0,0,0,0.02)", border: "1px solid #e2e8f0"
  },
  tableRow: { 
    "&:hover": { bgcolor: "#f1f5f9" }, 
    transition: "background-color 0.2s" 
  },
  badge: { fontWeight: 800, borderRadius: "8px", px: 1 }
};

>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
export default function PedidosPage(): JSX.Element {
  const { notify } = useUi();
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [nombreCliente, setNombreCliente] = useState("");

<<<<<<< HEAD
  const cargarPedidos = async () => {
=======
  const cargarPedidos = useCallback(async () => {
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
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
<<<<<<< HEAD
  };

  useEffect(() => {
    cargarPedidos();
  }, [filtro]);
=======
  }, [filtro]);

  useEffect(() => {
    cargarPedidos();
  }, [cargarPedidos]);
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e

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

<<<<<<< HEAD
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
=======
  return (
    <Box sx={styles.container}>
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs separator={<NavigateNext sx={{ fontSize: 16, opacity: 0.5 }} />} sx={{ mb: 1 }}>
          <Link underline="hover" color="inherit" onClick={() => navigate("/dashboard")} sx={{ cursor: "pointer", fontSize: 12, fontWeight: 500 }}>
            Dashboard
          </Link>
          <Typography sx={{ fontWeight: 600, fontSize: 12, color: "text.primary" }}>Pedidos</Typography>
        </Breadcrumbs>
        
        <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 900, color: "#1e293b", letterSpacing: "-1px" }}>
              Órdenes
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 500 }}>
              Flujo de comandas en tiempo real
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            startIcon={<Add />}
            onClick={() => setOpenModal(true)}
            sx={styles.actionButton}
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
          >
            Abrir Mesa
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
<<<<<<< HEAD
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
=======
        <Grid size={{xs:12, md:6}}>
          <Card sx={{ ...styles.statCard, borderLeft: "6px solid #F55345" }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" spacing={3} alignItems="center">
                <Avatar sx={{ bgcolor: "rgba(245, 83, 69, 0.08)", color: "#F55345", width: 60, height: 60, borderRadius: "15px" }}>
                  <ShoppingBag />
                </Avatar>
                <Box>
                  <Typography variant="overline" sx={{ fontWeight: 800, color: "#94a3b8", letterSpacing: "1px" }}>Comandas Activas</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 900, color: "#1e293b" }}>{pedidos.length}</Typography>
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
<<<<<<< HEAD
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
=======
        <Grid size={{xs:12, md:6}}>
          <Card sx={{ ...styles.statCard, borderLeft: "6px solid #10b981" }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" spacing={3} alignItems="center">
                <Avatar sx={{ bgcolor: "rgba(16, 185, 129, 0.08)", color: "#10b981", width: 60, height: 60, borderRadius: "15px" }}>
                  <PointOfSale />
                </Avatar>
                <Box>
                  <Typography variant="overline" sx={{ fontWeight: 800, color: "#94a3b8", letterSpacing: "1px" }}>Facturación Total</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 900, color: "#10b981" }}>${totalVentas.toFixed(2)}</Typography>
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

<<<<<<< HEAD
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
=======
      <Box sx={styles.searchBar}>
        <TextField
          placeholder="Buscar por cliente o ID de orden..."
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          fullWidth
          variant="standard"
<<<<<<< HEAD
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
=======
          InputProps={{ 
            disableUnderline: true, 
            startAdornment: <Search sx={{ color: "#94a3b8", mr: 2 }} />,
            sx: { py: 2, fontSize: 16, fontWeight: 500 } 
          }}
        />
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: "24px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <Table>
          <TableHead sx={{ bgcolor: "#f8fafc" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 800, color: "#64748b", fontSize: 12 }}>ORDEN</TableCell>
              <TableCell sx={{ fontWeight: 800, color: "#64748b", fontSize: 12 }}>CLIENTE / MESA</TableCell>
              <TableCell sx={{ fontWeight: 800, color: "#64748b", fontSize: 12 }}>MONTO</TableCell>
              <TableCell sx={{ fontWeight: 800, color: "#64748b", fontSize: 12 }}>REGISTRO</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800, color: "#64748b", fontSize: 12 }}>ACCIONES</TableCell>
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              [...Array(5)].map((_, i) => (
<<<<<<< HEAD
                <TableRow key={i}><TableCell colSpan={5}><Skeleton height={45} /></TableCell></TableRow>
              ))
            ) : pedidos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                  <Typography color="text.secondary">No hay pedidos registrados.</Typography>
=======
                <TableRow key={i}><TableCell colSpan={5}><Skeleton height={60} sx={{ mx: 2 }} /></TableCell></TableRow>
              ))
            ) : pedidos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 12 }}>
                  <Typography sx={{ color: "#94a3b8", fontWeight: 600 }}>No hay pedidos en curso</Typography>
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
                </TableCell>
              </TableRow>
            ) : (
              pedidos.map((p) => (
<<<<<<< HEAD
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
=======
                <TableRow key={p.id} sx={styles.tableRow}>
                  <TableCell>
                    <Chip 
                      label={`ID-${p.id.substring(0, 5).toUpperCase()}`} 
                      size="small" 
                      sx={{ ...styles.badge, bgcolor: "#eff6ff", color: "#2563eb" }} 
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar sx={{ width: 32, height: 32, fontSize: 14, bgcolor: "#f1f5f9", color: "#475569" }}>
                        <Person fontSize="inherit" />
                      </Avatar>
                      <Typography sx={{ fontWeight: 700, color: "#1e293b" }}>{p.nombre_cliente}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: 800, color: "#1e293b" }}>${p.total}</Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ color: "#64748b" }}>
                      <AccessTime sx={{ fontSize: 16 }} />
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {new Date(p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Gestionar Orden">
                      <IconButton 
                        onClick={() => navigate(`/dashboard/detalle-pedido/${p.id}`)}
                        sx={{ bgcolor: "#f8fafc", color: "#64748b", "&:hover": { bgcolor: "#1e293b", color: "white" } }}
                      >
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
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

<<<<<<< HEAD
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
=======
      <Dialog 
        open={openModal} 
        onClose={() => setOpenModal(false)} 
        fullWidth maxWidth="xs" 
        PaperProps={{ sx: { borderRadius: "24px", p: 1, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" } }}
      >
        <DialogTitle sx={{ fontWeight: 900, fontSize: 24, pb: 1 }}>Nueva Orden</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 3, color: "#64748b", fontWeight: 500 }}>
            Ingresa la identificación para la nueva mesa o pedido para llevar.
          </Typography>
          <TextField
            autoFocus
            placeholder="Nombre del cliente o mesa..."
            fullWidth
            value={nombreCliente}
            onChange={(e) => setNombreCliente(e.target.value)}
            variant="outlined"
            InputProps={{ sx: { borderRadius: "16px", bgcolor: "#f8fafc" } }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button onClick={() => setOpenModal(false)} sx={{ textTransform: "none", color: "#64748b", fontWeight: 700 }}>Descartar</Button>
          <Button 
            onClick={handleCrearPedido} 
            variant="contained" 
            sx={{ ...styles.actionButton, py: 1 }}
          >
            Confirmar e ir a Menú
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}