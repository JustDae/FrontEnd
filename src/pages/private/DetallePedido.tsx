import {
  Alert, Button, IconButton, Pagination, Paper, Stack, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, TextField,
  Typography, InputAdornment, Breadcrumbs, Link, Card, 
<<<<<<< HEAD
  CardContent, Skeleton, Box, Avatar, Grid
=======
  CardContent, Skeleton, Box, Avatar, Grid as Grid, Fade, Tooltip
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
} from "@mui/material";
import { useEffect, useMemo, useState, type JSX } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PaidIcon from '@mui/icons-material/Paid';

import { 
  type DetallePedido, 
  getDetallePedidos, 
  deleteDetallePedido,
  createDetallePedido,
  updateDetallePedido 
} from "../../services/detalle-pedido.service";
import DetallePedidoFormDialog from "../../components/detalle-pedido/DetallePedidoFormDialog";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage.ts";
import { useUi } from "../../context/UiContext.tsx";
import { useProductosOptions } from "../../hooks/useProductosOptions";
import { usePedidosOptions } from "../../hooks/usePedidosOptions";

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}

<<<<<<< HEAD
=======
const styles = {
  container: { p: { xs: 2, md: 4 }, bgcolor: "#f4f7fe", minHeight: "100vh" },
  statCard: { 
    borderRadius: "20px", 
    border: "none", 
    boxShadow: "0 8px 24px rgba(0,0,0,0.02)",
    background: "white",
    transition: "transform 0.2s ease",
    "&:hover": { transform: "translateY(-4px)" }
  },
  tableHeader: { 
    bgcolor: "#f8fafc", 
    "& .MuiTableCell-head": { fontWeight: 800, color: "#64748b", fontSize: "0.75rem", textTransform: "uppercase" } 
  },
  orderBadge: {
    bgcolor: "#e2e8f0",
    color: "#475569",
    px: 1.5,
    py: 0.5,
    borderRadius: "8px",
    fontSize: "0.8rem",
    fontWeight: 700
  },
  actionButton: {
    bgcolor: "#F55345", 
    "&:hover": { bgcolor: "#d44538", boxShadow: "0 8px 16px rgba(245, 83, 69, 0.3)" }, 
    borderRadius: "14px", 
    px: 3, 
    py: 1.2,
    textTransform: "none", 
    fontWeight: 700,
    fontSize: "0.9rem"
  }
};

>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
export default function DetallePedidoPage(): JSX.Element {
  const { notify } = useUi();
  const navigate = useNavigate();
  const [sp, setSp] = useSearchParams();

  const pageParam = Number(sp.get("page") || "1");
  const searchParam = sp.get("search") || "";

  const [page, setPage] = useState(Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1);
  const [limit] = useState(10);
  const [search, setSearch] = useState(searchParam);
  const debouncedSearch = useDebouncedValue(search, 450);

  const [items, setItems] = useState<DetallePedido[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { options: productos } = useProductosOptions();
  const { options: pedidos } = usePedidosOptions();

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [current, setCurrent] = useState<DetallePedido | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<DetallePedido | null>(null);

  const totalVendido = useMemo(() => 
    items.reduce((acc, curr) => acc + (Number(curr.subtotal) || 0), 0), 
  [items]);

  const queryKey = useMemo(() => ({
    page,
    limit,
    search: debouncedSearch.trim() || undefined,
  }), [page, limit, debouncedSearch]);

  useEffect(() => {
    setSp((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", String(page));
      if (search) next.set("search", search);
      else next.delete("search");
      return next;
    }, { replace: true });
  }, [page, search, setSp]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getDetallePedidos(queryKey);
      setItems(Array.isArray(res?.items) ? res.items : []);
      setTotalPages(res?.meta?.totalPages || 1);
    } catch {
      setError("Error al cargar los detalles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [queryKey]);

  const onSubmit = async (payload: any) => {
    try {
      if (mode === "create") {
        await createDetallePedido(payload);
        notify({ message: "Plato agregado", severity: "success" });
        setPage(1);
      } else if (current) {
        await updateDetallePedido(current.id, payload);
        notify({ message: "Línea actualizada", severity: "success" });
      }
      setOpen(false);
      await load();
    } catch (e) {
      notify({ message: getApiErrorMessage(e), severity: "error" });
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await deleteDetallePedido(toDelete.id);
      notify({ message: "Registro eliminado", severity: "success" });
      setConfirmOpen(false);
      setToDelete(null);
      await load();
    } catch (e) {
      notify({ message: getApiErrorMessage(e), severity: "error" });
    }
  };

  const onEdit = (item: DetallePedido) => {
    setMode("edit");
    setCurrent(item);
    setOpen(true);
  };

  return (
<<<<<<< HEAD
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#f9f9f9", minHeight: "100vh" }}>
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 1 }}>
          <Link underline="hover" color="inherit" onClick={() => navigate("/dashboard")} sx={{ cursor: 'pointer', fontSize: 13 }}>
            Dashboard
          </Link>
          <Typography color="text.primary" sx={{ fontWeight: 600, fontSize: 13 }}>Facturación</Typography>
        </Breadcrumbs>
        
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" sx={{ fontWeight: 900, color: "#2d3436" }}>Líneas de Pedido</Typography>
=======
    <Box sx={styles.container}>
      <Box sx={{ mb: 5 }}>
        <Breadcrumbs separator={<NavigateNextIcon sx={{ fontSize: 14, opacity: 0.5 }} />} sx={{ mb: 1 }}>
          <Link underline="hover" color="inherit" onClick={() => navigate("/dashboard")} sx={{ cursor: 'pointer', fontSize: 12, fontWeight: 500, color: "#94a3b8" }}>
            Dashboard
          </Link>
          <Typography sx={{ fontWeight: 600, fontSize: 12, color: "#64748b" }}>Facturación</Typography>
        </Breadcrumbs>
        
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#1e293b", letterSpacing: "-0.5px" }}>Detalles de Pedido</Typography>
            <Typography variant="body2" color="text.secondary">Gestiona las líneas de productos y facturación por orden.</Typography>
          </Box>
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => { setMode("create"); setCurrent(null); setOpen(true); }}
<<<<<<< HEAD
            sx={{ bgcolor: "#F55345", "&:hover": { bgcolor: "#d44538" }, borderRadius: "12px", px: 3, textTransform: "none", fontWeight: 700 }}
          >
            Agregar Producto
=======
            sx={styles.actionButton}
          >
            Nueva Línea
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
          </Button>
        </Stack>
      </Box>

<<<<<<< HEAD
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined" sx={{ borderRadius: "16px", borderLeft: "6px solid #F55345", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: "rgba(245, 83, 69, 0.1)", color: "#F55345", width: 56, height: 56 }}>
                  <ReceiptLongIcon />
                </Avatar>
                <Box>
                  <Typography variant="overline" sx={{ fontWeight: 700, color: "text.secondary" }}>Registros</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800 }}>{items.length}</Typography>
=======
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined" sx={{ ...styles.statCard, borderLeft: "6px solid #F55345" }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" spacing={3} alignItems="center">
                <Avatar sx={{ bgcolor: "#fff1f0", color: "#F55345", width: 56, height: 56, borderRadius: "14px" }}>
                  <ReceiptLongIcon />
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", fontSize: "0.7rem", letterSpacing: "1px" }}>Registros actuales</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: "#1e293b" }}>{items.length}</Typography>
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
<<<<<<< HEAD
          <Card variant="outlined" sx={{ borderRadius: "16px", borderLeft: "6px solid #4caf50", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: "rgba(76, 175, 80, 0.1)", color: "#4caf50", width: 56, height: 56 }}>
                  <PaidIcon />
                </Avatar>
                <Box>
                  <Typography variant="overline" sx={{ fontWeight: 700, color: "text.secondary" }}>Venta Página</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: "#2e7d32" }}>${totalVendido.toFixed(2)}</Typography>
=======
          <Card variant="outlined" sx={{ ...styles.statCard, borderLeft: "6px solid #4caf50" }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" spacing={3} alignItems="center">
                <Avatar sx={{ bgcolor: "#f0fdf4", color: "#4caf50", width: 56, height: 56, borderRadius: "14px" }}>
                  <PaidIcon />
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", fontSize: "0.7rem", letterSpacing: "1px" }}>Total Ventas (Página)</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: "#10b981" }}>${totalVendido.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Typography>
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

<<<<<<< HEAD
      <TextField
        placeholder="Buscar por ID o producto..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
        sx={{ mt: 3, "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "white" } }}
        InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>) }}
      />

      {error && <Alert severity="error" sx={{ mt: 3, borderRadius: "12px" }}>{error}</Alert>}

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: "16px", mt: 3, overflow: "hidden" }}>
        <Table>
          <TableHead sx={{ bgcolor: "#fcfcfc" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>ORDEN</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>PRODUCTO</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>CANT.</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>SUBTOTAL</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>ACCIONES</TableCell>
=======
      <Box sx={{ mb: 3 }}>
        <TextField
          placeholder="Busca por ID de pedido o nombre de producto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          sx={{ 
            "& .MuiOutlinedInput-root": { 
              borderRadius: "16px", 
              bgcolor: "white", 
              border: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
              height: "56px"
            },
            "& .MuiOutlinedInput-notchedOutline": { border: "none" }
          }}
          InputProps={{ startAdornment: (<InputAdornment position="start" sx={{ pl: 1 }}><SearchIcon sx={{ color: "#94a3b8" }} /></InputAdornment>) }}
        />
      </Box>

      {error && <Fade in><Alert severity="error" sx={{ mb: 3, borderRadius: "12px" }}>{error}</Alert></Fade>}

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: "24px", overflow: "hidden", border: "1px solid #e2e8f0" }}>
        <Table>
          <TableHead sx={styles.tableHeader}>
            <TableRow>
              <TableCell>Orden</TableCell>
              <TableCell>Producto</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Subtotal</TableCell>
              <TableCell align="right">Acciones</TableCell>
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              [...Array(5)].map((_, i) => (
<<<<<<< HEAD
                <TableRow key={i}><TableCell colSpan={5}><Skeleton height={45} /></TableCell></TableRow>
              ))
            ) : (
              items.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>#{item.pedidoId}</TableCell>
                  <TableCell>{item.producto?.nombre || "—"}</TableCell>
                  <TableCell color="text.secondary">{item.cantidad}</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#F55345" }}>
                    ${(Number(item.subtotal) || 0).toFixed(2)}
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <IconButton size="small" onClick={() => onEdit(item)} sx={{ color: "#4a5568" }}><EditIcon fontSize="small" /></IconButton>
                      <IconButton size="small" onClick={() => { setToDelete(item); setConfirmOpen(true); }} sx={{ color: "#e53e3e" }}><DeleteIcon fontSize="small" /></IconButton>
=======
                <TableRow key={i}><TableCell colSpan={5}><Skeleton height={50} variant="text" sx={{ mx: 2 }} /></TableCell></TableRow>
              ))
            ) : items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                    <Typography color="text.secondary" variant="body2">No se encontraron registros.</Typography>
                  </TableCell>
                </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id} sx={{ "&:hover": { bgcolor: "#f8fafc" }, transition: "background 0.2s" }}>
                  <TableCell>
                    <Box component="span" sx={styles.orderBadge}>#{item.pedidoId}</Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#334155" }}>{item.producto?.nombre || "—"}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: "#64748b" }}>{item.cantidad} unidades</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: 800, color: "#F55345", fontSize: "1rem" }}>
                      ${(Number(item.subtotal) || 0).toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Tooltip title="Editar">
                        <IconButton size="small" onClick={() => onEdit(item)} sx={{ color: "#94a3b8", "&:hover": { color: "#3b82f6", bgcolor: "#eff6ff" } }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton size="small" onClick={() => { setToDelete(item); setConfirmOpen(true); }} sx={{ color: "#94a3b8", "&:hover": { color: "#ef4444", bgcolor: "#fef2f2" } }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

<<<<<<< HEAD
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} shape="rounded" sx={{ '& .Mui-selected': { bgcolor: '#F55345 !important', color: 'white' } }} />
      </Box>

      <DetallePedidoFormDialog open={open} mode={mode} initial={current} productos={productos} pedidos={pedidos} onClose={() => setOpen(false)} onSubmit={onSubmit} />
      <ConfirmDialog open={confirmOpen} title="Eliminar registro" description={`¿Quitar este ítem de la orden?`} onCancel={() => setConfirmOpen(false)} onConfirm={confirmDelete} />
=======
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Pagination 
          count={totalPages} 
          page={page} 
          onChange={(_, v) => setPage(v)} 
          shape="rounded" 
          size="large"
          sx={{ 
            '& .MuiPaginationItem-root': { fontWeight: 600 },
            '& .Mui-selected': { bgcolor: '#F55345 !important', color: 'white', boxShadow: '0 4px 12px rgba(245, 83, 69, 0.2)' } 
          }} 
        />
      </Box>

      <DetallePedidoFormDialog open={open} mode={mode} initial={current} productos={productos} pedidos={pedidos} onClose={() => setOpen(false)} onSubmit={onSubmit} />
      <ConfirmDialog open={confirmOpen} title="Eliminar registro" description={`¿Estás seguro de quitar este producto de la orden?`} onCancel={() => setConfirmOpen(false)} onConfirm={confirmDelete} />
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
    </Box>
  );
}