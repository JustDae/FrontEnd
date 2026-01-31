import { useState, useEffect, useMemo, useCallback, type JSX } from "react";
import { 
  Box, Typography, TextField, Button, Paper, Table, 
  TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, Breadcrumbs, Link,
  Stack, Card, CardContent, Avatar, Skeleton, Tooltip, Chip, Grid
} from "@mui/material";
import { 
  Search, Add, Visibility, NavigateNext, 
  ShoppingBag, PointOfSale, AccessTime, Person
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getPedidos, createPedido, type Pedido } from "../../services/pedidos.service";
import { useUi } from "../../context/UiContext";

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

export default function PedidosPage(): JSX.Element {
  const { notify } = useUi();
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [nombreCliente, setNombreCliente] = useState("");

  const cargarPedidos = useCallback(async () => {
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
  }, [filtro]);

  useEffect(() => {
    cargarPedidos();
  }, [cargarPedidos]);

  const totalVentas = useMemo(() => {
    return pedidos.reduce((acc, p) => acc + (Number(p.total) || 0), 0);
  }, [pedidos]);

  const handleCrearPedido = async () => {
  if (!nombreCliente.trim()) {
    notify({ message: "El nombre del cliente es obligatorio", severity: "warning" });
    return;
  }

  const searchParams = new URLSearchParams(window.location.search);
  const mesaIdParam = searchParams.get("mesaId");

  try {
    const nuevoPedido = await createPedido({
      nombre_cliente: nombreCliente,
      direccion: "Local",
      telefono: "0999999999",
      correo: "cliente@restaurante.com",
      estado: "PENDIENTE",
      fecha_pedido: new Date().toISOString(),
      mesaId: mesaIdParam ? parseInt(mesaIdParam) : 7,
      metodoPagoId: 1
    });

    notify({ message: `Pedido para ${nombreCliente} creado con éxito`, severity: "success" });
    setOpenModal(false);
    setNombreCliente("");

    if (nuevoPedido.data?.id) {
      navigate(`/dashboard/detalle-pedido/${nuevoPedido.data.id}`);
    }
  } catch (error: any) {
    console.error("Error al crear pedido:", error);
    const msg = error.response?.data?.message || "Error de conexión con el servidor";
    notify({ message: msg, severity: "error" });
  }
};

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
          >
            Abrir Mesa
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
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
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
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
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={styles.searchBar}>
        <TextField
          placeholder="Buscar por cliente o ID de orden..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          fullWidth
          variant="standard"
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
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}><TableCell colSpan={5}><Skeleton height={60} sx={{ mx: 2 }} /></TableCell></TableRow>
              ))
            ) : pedidos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 12 }}>
                  <Typography sx={{ color: "#94a3b8", fontWeight: 600 }}>No hay pedidos en curso</Typography>
                </TableCell>
              </TableRow>
            ) : (
              pedidos.map((p) => (
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
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}