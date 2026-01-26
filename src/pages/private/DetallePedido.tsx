import {
  Alert, Button, Chip, IconButton, Pagination, Paper, Stack, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, TextField,
  Typography, InputAdornment, Tooltip, Breadcrumbs, Link, Card, 
  CardContent, Divider, Skeleton, Box, Grid, Avatar,
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
    items.reduce((acc, curr) => acc + Number(curr.subtotal || 0), 0), 
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
        notify({ message: "Detalle agregado", severity: "success" });
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
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#f8f9fa", minHeight: "100vh" }}>
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 1 }}>
          <Link underline="hover" color="inherit" onClick={() => navigate("/dashboard")} sx={{ cursor: 'pointer', fontSize: 13 }}>
            Dashboard
          </Link>
          <Typography color="text.primary" sx={{ fontWeight: 600, fontSize: 13 }}>Facturación</Typography>
        </Breadcrumbs>
        
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#1c252e" }}>Líneas de Pedido</Typography>
            <Typography variant="body2" color="text.secondary">Gestión de productos por comanda</Typography>
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
              textTransform: "none",
              fontWeight: 700
            }}
          >
            Nuevo Registro
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined" sx={{ borderRadius: "16px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: "rgba(245, 83, 69, 0.1)", color: "#F55345", width: 56, height: 56 }}>
                  <ReceiptLongIcon />
                </Avatar>
                <Box>
                  <Typography variant="overline" sx={{ fontWeight: 700, color: "text.secondary" }}>Registros</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800 }}>{items.length}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined" sx={{ borderRadius: "16px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: "rgba(76, 175, 80, 0.1)", color: "#4caf50", width: 56, height: 56 }}>
                  <PaidIcon />
                </Avatar>
                <Box>
                  <Typography variant="overline" sx={{ fontWeight: 700, color: "text.secondary" }}>Venta Página</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: "#2e7d32" }}>${totalVendido.toFixed(2)}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <TextField
        placeholder="Buscar por ID o nombre..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
        sx={{ 
          mt: 3,
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            bgcolor: "white"
          }
        }}
        InputProps={{
          startAdornment: (<InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>)
        }}
      />

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: "16px", border: "1px solid #edf2f7", mt: 3, overflow: "hidden" }}>
        <Table>
          <TableHead sx={{ bgcolor: "#f8f9fa" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: "#718096" }}>ORDEN</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#718096" }}>PRODUCTO</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#718096" }}>CANT.</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#718096" }}>SUBTOTAL</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: "#718096" }}>ACCIONES</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              [...Array(5)].map((_, i) => (
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
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Pagination 
          count={totalPages} 
          page={page} 
          onChange={(_, v) => setPage(v)} 
          shape="rounded"
          sx={{ '& .Mui-selected': { bgcolor: '#F55345 !important', color: 'white' } }}
        />
      </Box>

      <DetallePedidoFormDialog open={open} mode={mode} initial={current} productos={productos} pedidos={pedidos} onClose={() => setOpen(false)} onSubmit={onSubmit} />
      <ConfirmDialog open={confirmOpen} title="Quitar producto" description={`¿Eliminar "${toDelete?.producto?.nombre}" de la orden?`} onCancel={() => setConfirmOpen(false)} onConfirm={confirmDelete} />
    </Box>
  );
}