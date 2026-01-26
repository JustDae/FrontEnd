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
  Grid,
  Card,
  CardContent,
  Divider,
  Skeleton,
  Box,
} from "@mui/material";
import { useEffect, useMemo, useState, type JSX } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PaymentsIcon from "@mui/icons-material/Payments";

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
    items.reduce((acc, curr) => acc + Number(curr.subtotal), 0), 
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
        notify({ message: "Detalle creado", severity: "success" });
        setPage(1);
      } else if (current) {
        await updateDetallePedido(current.id, payload);
        notify({ message: "Detalle actualizado", severity: "success" });
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

  return (
    <Stack spacing={3} sx={{ p: 3 }}>
      <Box>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 1 }}>
          <Link underline="hover" color="inherit" onClick={() => navigate("/dashboard")} sx={{ cursor: 'pointer' }}>
            Dashboard
          </Link>
          <Typography color="text.primary">Líneas de Pedido</Typography>
        </Breadcrumbs>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" sx={{ fontWeight: 900, color: "#1a1a1a" }}>Líneas de Pedido</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => { setMode("create"); setCurrent(null); setOpen(true); }}
            sx={{ bgcolor: "#F55345", "&:hover": { bgcolor: "#d44538" }, borderRadius: 2, px: 3 }}
          >
            Agregar Producto
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={2}>
        <Grid size={{xs:12, md: 6}}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <ShoppingCartIcon sx={{ color: "#F55345", fontSize: 40 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">Total Registros en Página</Typography>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>{items.length}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <PaymentsIcon sx={{ color: "#4caf50", fontSize: 40 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">Venta Acumulada (Pág)</Typography>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>${totalVendido.toFixed(2)}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Divider />

      <TextField
        placeholder="Búsqueda rápida..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
        InputProps={{
          startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>),
          sx: { borderRadius: 3, bgcolor: "white" }
        }}
      />

      {error && <Alert severity="error">{error}</Alert>}

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Table>
          <TableHead sx={{ bgcolor: "#fcfcfc" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Orden</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Producto</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Cant.</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Precio Final</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5}><Skeleton variant="text" height={40} /></TableCell>
                </TableRow>
              ))
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                  <Typography color="text.secondary">Sin resultados encontrados</Typography>
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell sx={{ fontWeight: "bold", color: "#F55345" }}>#{item.pedidoId.toString().substring(0,6)}</TableCell>
                  <TableCell>{item.producto?.nombre}</TableCell>
                  <TableCell>{item.cantidad}</TableCell>
                  <TableCell>
                    <Chip label={`$${Number(item.subtotal).toFixed(2)}`} size="small" variant="outlined" color="success" />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Tooltip title="Ver Pedido Completo">
                        <IconButton size="small" onClick={() => navigate(`/dashboard/detalle-pedido/${item.pedidoId}`)}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar Línea">
                        <IconButton size="small" color="primary" onClick={() => { setMode("edit"); setCurrent(item); setOpen(true); }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton size="small" color="error" onClick={() => { setToDelete(item); setConfirmOpen(true); }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack direction="row" justifyContent="center">
        <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} color="primary" shape="rounded" size="large" />
      </Stack>

      <DetallePedidoFormDialog open={open} mode={mode} initial={current} productos={productos} pedidos={pedidos} onClose={() => setOpen(false)} onSubmit={onSubmit} />
      <ConfirmDialog open={confirmOpen} title="Eliminar registro" description={`¿Quitar "${toDelete?.producto?.nombre}" de la orden?`} onCancel={() => setConfirmOpen(false)} onConfirm={confirmDelete} />
    </Stack>
  );
}