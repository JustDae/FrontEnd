import {
  Alert,
  Button,
  Chip,
  IconButton,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  InputAdornment,
  Tooltip,
  Breadcrumbs,
  Link,
  Card,
  CardContent,
  Divider,
  Skeleton,
  Box,
  Avatar,
} from "@mui/material";
import { useEffect, useMemo, useState, type JSX } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PaidIcon from '@mui/icons-material/Paid';
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";

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
      setError("No se pudieron cargar los detalles.");
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
        notify({ message: "Plato agregado con éxito", severity: "success" });
        setPage(1);
      } else if (current) {
        await updateDetallePedido(current.id, payload);
        notify({ message: "Línea actualizada con éxito", severity: "success" });
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
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#f4f6f8", minHeight: "100vh" }}>
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 1.5 }}>
          <Link underline="hover" color="inherit" onClick={() => navigate("/dashboard")} sx={{ cursor: 'pointer', fontSize: 14 }}>
            Dashboard
          </Link>
          <Typography color="text.primary" sx={{ fontWeight: 600, fontSize: 14 }}>Gestión de Pedidos</Typography>
        </Breadcrumbs>
        
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#1c252e", letterSpacing: -0.5 }}>
              Líneas de Facturación
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Detalle individual de productos por comanda
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => { setMode("create"); setCurrent(null); setOpen(true); }}
            sx={{ 
              bgcolor: "#F55345", 
              "&:hover": { bgcolor: "#d44538" }, 
              borderRadius: "10px", 
              px: 3,
              py: 1.2,
              textTransform: "none",
              fontWeight: 700,
              boxShadow: "0 8px 16px 0 rgba(245, 83, 69, 0.24)"
            }}
          >
            Nuevo Registro
          </Button>
        </Stack>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3, mb: 4 }}>
        <Card sx={{ borderRadius: "16px", boxShadow: "0 0 2px 0 rgba(145, 158, 171, 0.2), 0 12px 24px -4px rgba(145, 158, 171, 0.12)" }}>
          <CardContent sx={{ p: 3 }}>
            <Stack direction="row" spacing={2.5} alignItems="center">
              <Avatar sx={{ bgcolor: "rgba(245, 83, 69, 0.12)", color: "#F55345", width: 54, height: 54 }}>
                <ReceiptLongIcon />
              </Avatar>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, mb: 0.5 }}>TOTAL REGISTROS</Typography>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>{items.length}</Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
        
        <Card sx={{ borderRadius: "16px", boxShadow: "0 0 2px 0 rgba(145, 158, 171, 0.2), 0 12px 24px -4px rgba(145, 158, 171, 0.12)" }}>
          <CardContent sx={{ p: 3 }}>
            <Stack direction="row" spacing={2.5} alignItems="center">
              <Avatar sx={{ bgcolor: "rgba(34, 197, 94, 0.12)", color: "#22c55e", width: 54, height: 54 }}>
                <PaidIcon />
              </Avatar>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, mb: 0.5 }}>VENTA ACUMULADA</Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: "#1b5e20" }}>${totalVendido.toFixed(2)}</Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Box>

      <Paper sx={{ p: 0.5, mb: 3, borderRadius: "12px", border: "1px solid rgba(145, 158, 171, 0.2)", display: "flex", alignItems: "center", bgcolor: "white" }}>
        <InputAdornment position="start" sx={{ ml: 2 }}>
          <SearchIcon sx={{ color: "text.disabled" }} />
        </InputAdornment>
        <TextField
          placeholder="Escribe ID de pedido o nombre de plato..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          variant="standard"
          InputProps={{ disableUnderline: true, sx: { py: 1.5, px: 1, fontSize: 15 } }}
        />
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: "12px" }}>{error}</Alert>}

      <TableContainer component={Paper} sx={{ borderRadius: "16px", border: "1px solid rgba(145, 158, 171, 0.2)", overflow: "hidden", boxShadow: "none" }}>
        <Table>
          <TableHead sx={{ bgcolor: "#f4f6f8" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: "#637381", py: 2 }}>ORDEN</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#637381" }}>PRODUCTO</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#637381" }}>CANTIDAD</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#637381" }}>SUBTOTAL</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: "#637381" }}>ACCIONES</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5} sx={{ py: 2.5 }}><Skeleton variant="text" height={30} /></TableCell>
                </TableRow>
              ))
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                  <Box sx={{ opacity: 0.4 }}>
                    <ShoppingBasketIcon sx={{ fontSize: 64, mb: 1.5 }} />
                    <Typography variant="h6">Sin registros encontrados</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>
                    <Chip 
                      label={`#${item.pedidoId}`} 
                      size="small" 
                      sx={{ fontWeight: 700, bgcolor: "#f4f6f8", color: "#1c252e", borderRadius: "6px" }} 
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#1c252e" }}>
                      {item.producto?.nombre || "N/A"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">unid. {item.cantidad}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#F55345" }}>
                      ${(Number(item.subtotal) || 0).toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                      <Tooltip title="Ver Orden"><IconButton size="small" onClick={() => navigate(`/dashboard/detalle-pedido/${item.pedidoId}`)} sx={{ color: "#637381" }}><VisibilityIcon fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="Editar"><IconButton size="small" onClick={() => onEdit(item)} sx={{ color: "#2065D1" }}><EditIcon fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="Eliminar"><IconButton size="small" onClick={() => { setToDelete(item); setConfirmOpen(true); }} sx={{ color: "#FF5630" }}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Pagination 
          count={totalPages} 
          page={page} 
          onChange={(_, v) => setPage(v)} 
          color="primary" 
          size="large" 
          sx={{
            '& .MuiPaginationItem-root': { borderRadius: '8px', fontWeight: 700 },
            '& .Mui-selected': { bgcolor: '#F55345 !important', color: 'white' }
          }}
        />
      </Box>

      <DetallePedidoFormDialog open={open} mode={mode} initial={current} productos={productos} pedidos={pedidos} onClose={() => setOpen(false)} onSubmit={onSubmit} />
      <ConfirmDialog open={confirmOpen} title="¿Quitar producto del pedido?" description={`Se eliminará "${toDelete?.producto?.nombre}" de la orden #${toDelete?.pedidoId}. Esta acción no se puede deshacer.`} onCancel={() => { setConfirmOpen(false); setToDelete(null); }} onConfirm={confirmDelete} />
    </Box>
  );
}