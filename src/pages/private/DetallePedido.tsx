import {
  Button, IconButton, Pagination, Paper, Stack, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography, Breadcrumbs, Link, Card,
  CardContent, Box, Avatar, Grid, Tooltip
} from "@mui/material";
import { useEffect, useMemo, useState, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PaidIcon from '@mui/icons-material/Paid';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';

import {
  type DetallePedido,
  getDetallePedidos,
  deleteDetallePedido,
  createDetallePedido,
  updateDetallePedido
} from "../../services/detalle-pedido.service";
import { createFactura } from "../../services/factura.service";
import DetallePedidoFormDialog from "../../components/detalle-pedido/DetallePedidoFormDialog";
import FacturaFormDialog from "../../components/factura/FacturaFormDialog";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage.ts";
import { useUi } from "../../context/UiContext.tsx";
import { useProductosOptions } from "../../hooks/useProductosOptions";
import { usePedidosOptions } from "../../hooks/usePedidosOptions";

export default function DetallePedidoPage(): JSX.Element {
  const { notify } = useUi();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [items, setItems] = useState<DetallePedido[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const { options: productos } = useProductosOptions();
  const { options: pedidos } = usePedidosOptions();

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [current, setCurrent] = useState<DetallePedido | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<DetallePedido | null>(null);

  const [facturaOpen, setFacturaOpen] = useState(false);
  const [pedidoParaFacturar, setPedidoParaFacturar] = useState<any>(null);

  const totalVendido = useMemo(() =>
    items.reduce((acc, curr) => acc + (Number(curr.subtotal) || 0), 0),
  [items]);

  const load = async () => {
    try {
      setLoading(true);
      const res = await getDetallePedidos({ page, limit: 10 });
      const paginationData = res?.data;
      setItems(Array.isArray(paginationData?.items) ? paginationData.items : []);
      setTotalPages(paginationData?.meta?.totalPages || 1);
    } catch (e) {
      notify({ message: "Error al cargar los detalles.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [page]);

  const onSubmit = async (payload: any) => {
    try {
      if (mode === "create") {
        await createDetallePedido(payload);
        notify({ message: "Plato agregado", severity: "success" });
      } else if (current) {
        await updateDetallePedido(current.id, payload);
        notify({ message: "Línea actualizada", severity: "success" });
      }
      setOpen(false);
      load();
    } catch (e) {
      notify({ message: getApiErrorMessage(e), severity: "error" });
    }
  };

  const onEmitirFactura = async (payload: any) => {
    try {
      await createFactura(payload);
      notify({ message: "Factura generada con éxito", severity: "success" });
      setFacturaOpen(false);
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
      load();
    } catch (e) {
      notify({ message: getApiErrorMessage(e), severity: "error" });
    }
  };

  return (
    <Box sx={{ p: 4, bgcolor: "#f4f7fe", minHeight: "100vh" }}>
      <Breadcrumbs separator={<NavigateNextIcon sx={{ fontSize: 14 }} />} sx={{ mb: 2 }}>
        <Link underline="hover" color="inherit" onClick={() => navigate("/dashboard")} sx={{ cursor: 'pointer' }}>Dashboard</Link>
        <Typography color="text.primary">Facturación</Typography>
      </Breadcrumbs>

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>Detalles de Pedido</Typography>
            <Typography variant="body2" color="text.secondary">Gestiona los platos de la orden.</Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="success"
            startIcon={<PointOfSaleIcon />}
            disabled={items.length === 0}
            onClick={() => {
              const idReal = items[0].pedidoId || (items[0] as any).pedido?.id;
              setPedidoParaFacturar({ id: idReal, total: totalVendido.toFixed(2) });
              setFacturaOpen(true);
            }}
            sx={{ borderRadius: "12px", textTransform: "none", fontWeight: 700 }}
          >
            Facturar Pedido
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => { setMode("create"); setCurrent(null); setOpen(true); }}
            sx={{ bgcolor: "#F55345", borderRadius: "12px", textTransform: "none", fontWeight: 700, "&:hover": { bgcolor: "#d44538" } }}
          >
            Nueva Línea
          </Button>
        </Stack>
      </Stack>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: "16px" }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: "#fff1f0", color: "#F55345" }}><ReceiptLongIcon /></Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary">ITEMS</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>{items.length}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: "16px" }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: "#f0fdf4", color: "#4caf50" }}><PaidIcon /></Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary">TOTAL PÁGINA</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#2e7d32" }}>${totalVendido.toFixed(2)}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ borderRadius: "20px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
        <Table>
          <TableHead sx={{ bgcolor: "#f8fafc" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>ORDEN</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>PRODUCTO</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>CANTIDAD</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>SUBTOTAL</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>ACCIONES</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
                <TableRow><TableCell colSpan={5} align="center">Cargando...</TableCell></TableRow>
            ) : items.length === 0 ? (
                <TableRow><TableCell colSpan={5} align="center">No hay registros.</TableCell></TableRow>
            ) : (
                items.map((item: any) => (
                <TableRow key={item.id} hover>
                    <TableCell>
                    <Box sx={{ bgcolor: "#f1f5f9", px: 1, py: 0.5, borderRadius: "6px", display: "inline-block", fontSize: "0.75rem", fontWeight: "bold" }}>
                        #{ (item.pedidoId || item.pedido?.id || "N/A").substring(0,8) }
                    </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{item.producto?.nombre}</TableCell>
                    <TableCell>{item.cantidad} unidades</TableCell>
                    <TableCell sx={{ color: "#F55345", fontWeight: 700 }}>${Number(item.subtotal).toFixed(2)}</TableCell>
                    <TableCell align="right">
                        <Tooltip title="Editar"><IconButton onClick={() => { setMode("edit"); setCurrent(item); setOpen(true); }}><EditIcon fontSize="small" /></IconButton></Tooltip>
                        <Tooltip title="Eliminar"><IconButton onClick={() => { setToDelete(item); setConfirmOpen(true); }}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
                    </TableCell>
                </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} color="primary" />
      </Box>

      <DetallePedidoFormDialog open={open} mode={mode} initial={current} productos={productos} pedidos={pedidos} onClose={() => setOpen(false)} onSubmit={onSubmit} />
      {pedidoParaFacturar && (
        <FacturaFormDialog open={facturaOpen} pedido={pedidoParaFacturar} onClose={() => setFacturaOpen(false)} onSubmit={onEmitirFactura} />
      )}
      <ConfirmDialog open={confirmOpen} title="Eliminar" description="¿Seguro que deseas eliminar esta línea?" onCancel={() => setConfirmOpen(false)} onConfirm={confirmDelete} />
    </Box>
  );
}