import {
  Alert,
  Button,
  Chip,
  CircularProgress,
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
} from "@mui/material";
import { useEffect, useMemo, useState, type JSX } from "react";
import { useSearchParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { 
  type DetallePedido, 
  getDetallePedidos, 
  deleteDetallePedido 
} from "../../services/detalle-pedido.service";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage.ts";
import { useUi } from "../../context/UiContext.tsx";
import { useNavigate } from "react-router-dom";

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

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<DetallePedido | null>(null);

  const queryKey = useMemo(
    () => ({
      page,
      limit,
      search: debouncedSearch.trim() || undefined,
    }),
    [page, limit, debouncedSearch]
  );

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
      setItems(res.items);
      setTotalPages(res.meta.totalPages || 1);
    } catch {
      setError("No se pudieron cargar los detalles de pedidos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [queryKey]);

  const askDelete = (item: DetallePedido) => {
    setToDelete(item);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await deleteDetallePedido(toDelete.id);
      notify({ message: "Detalle eliminado.", severity: "success" });
      setConfirmOpen(false);
      setToDelete(null);
      await load();
    } catch (e) {
      notify({ message: getApiErrorMessage(e), severity: "error" });
    }
  };

  return (
    <Stack spacing={2} sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Detalles de Pedidos</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/dashboard/pedidos/nuevo")}
        >
          Nuevo Pedido
        </Button>
      </Stack>

      {error && <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>}

      <TextField
        label="Buscar por cliente..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
      />

      {loading ? (
        <Stack alignItems="center"><CircularProgress /></Stack>
      ) : items.length === 0 ? (
        <Alert severity="info">No hay detalles de pedidos para mostrar.</Alert>
      ) : (
        <>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID Pedido</TableCell>
                  <TableCell>Producto</TableCell>
                  <TableCell>Cantidad</TableCell>
                  <TableCell>Subtotal</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>#{item.pedidoId}</TableCell>
                    <TableCell>{item.producto?.nombre || "N/A"}</TableCell>
                    <TableCell>{item.cantidad}</TableCell>
                    <TableCell>
                      <Chip 
                        size="small" 
                        label={`$${item.subtotal}`} 
                        color="primary" 
                        variant="outlined" 
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton 
                        onClick={() => navigate(`/order-detail/${item.id}`)} 
                        color="primary"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton onClick={() => askDelete(item)} aria-label="eliminar">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Stack direction="row" justifyContent="center">
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, v) => setPage(v)}
              color="primary"
            />
          </Stack>
        </>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Confirmar eliminación"
        description={`¿Estás seguro de eliminar el producto "${toDelete?.producto?.nombre || ""}" de este pedido?`}
        onCancel={() => { setConfirmOpen(false); setToDelete(null); }}
        onConfirm={confirmDelete}
      />
    </Stack>
  );
}