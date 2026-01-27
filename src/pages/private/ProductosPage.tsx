import { useState, useEffect, useMemo, useCallback, type JSX } from "react";
import {
  Box, Typography, TextField, IconButton, Button, Avatar, Breadcrumbs, 
  Link, Stack, Card, CardContent, InputAdornment, Skeleton, Container, 
  Grid as Grid, Zoom, Divider, Chip, Tooltip
} from "@mui/material";
import { 
  Search, Edit, Delete, Fastfood, NavigateNext, Add, Inventory, 
  LocalDining, RestaurantMenu, Clear 
} from "@mui/icons-material";
import api from "../../services/api";
import { useUi } from "../../context/UiContext";
import ProductoFormDialog from "../../components/productos/ProductoFormDialog";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { getProductImageUrl } from "../../services/productos.service";
import { useNavigate } from "react-router-dom";

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  imageUrl?: string;
  categoria?: { id: number; nombre?: string; name?: string };
}

const styles = {
  container: { minHeight: "100vh", bgcolor: "#f8fafc", pb: 6, pt: 4 },
  headerSection: { display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 },
  statCard: {
    borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "none",
    background: "white", height: "100%", display: "flex", alignItems: "center",
    transition: "all 0.2s ease", "&:hover": { borderColor: "#cbd5e1" }
  },
  actionButton: {
    bgcolor: "#F55345", color: "white", px: 3, py: 1, borderRadius: "12px",
    textTransform: "none", fontWeight: 700, fontSize: "0.875rem",
    boxShadow: "0 4px 12px rgba(245, 83, 69, 0.2)",
    "&:hover": { bgcolor: "#d44538" }
  },
  searchWrapper: {
    "& .MuiOutlinedInput-root": {
      bgcolor: "white", borderRadius: "14px", height: "48px", fontSize: "0.9rem",
      "& fieldset": { borderColor: "#e2e8f0" },
      "&:hover fieldset": { borderColor: "#F55345" },
    }
  },
  productCard: {
    borderRadius: "20px", border: "1px solid #e2e8f0",
    background: "white", transition: "all 0.3s ease", overflow: "hidden",
    "&:hover": { boxShadow: "0 12px 24px rgba(0,0,0,0.05)", transform: "translateY(-4px)" }
  },
  imageBox: {
    width: "100%", height: 160, borderRadius: "14px", overflow: "hidden",
    mb: 1.5, bgcolor: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center"
  }
};

export default function ProductosPage(): JSX.Element {
  const { notify } = useUi();
  const navigate = useNavigate();
  
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("");
  const [open, setOpen] = useState(false);
  const [editando, setEditando] = useState<Producto | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Producto | null>(null);

  const fetchProductos = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/productos?t=${Date.now()}`);
      const result = res.data?.data?.items || res.data?.items || res.data?.data || [];
      setProductos(Array.isArray(result) ? result : []);
    } catch {
      notify({ message: "Error de conexión", severity: "error" });
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => { fetchProductos(); }, [fetchProductos]);

  const stats = useMemo(() => ({
    total: productos.length,
    avg: productos.length > 0 ? productos.reduce((acc, p) => acc + Number(p.precio), 0) / productos.length : 0
  }), [productos]);

  const filtrados = useMemo(() => 
    productos.filter(p => p.nombre.toLowerCase().includes(filtro.toLowerCase())), 
  [productos, filtro]);

  const handleSave = async (payload: FormData) => {
    try {
      if (editando) {
        await api.put(`/productos/${editando.id}`, payload);
        notify({ message: "Plato actualizado", severity: "success" });
      } else {
        await api.post("/productos", payload);
        notify({ message: "Plato creado", severity: "success" });
      }
      setOpen(false);
      fetchProductos();
    } catch {
      notify({ message: "Error en el servidor", severity: "error" });
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await api.delete(`/productos/${itemToDelete.id}`);
      notify({ message: "Eliminado", severity: "success" });
      fetchProductos();
    } catch {
      notify({ message: "Error al borrar", severity: "error" });
    } finally {
      setConfirmOpen(false);
      setItemToDelete(null);
    }
  };

  return (
    <Box sx={styles.container}>
      <Container maxWidth="lg">
        <Box sx={styles.headerSection}>
          <Box>
            <Breadcrumbs separator={<NavigateNext sx={{ fontSize: 14 }} />} sx={{ mb: 0.5 }}>
              <Link underline="hover" color="inherit" onClick={() => navigate("/dashboard")} sx={{ cursor: "pointer", fontSize: "0.75rem" }}>Admin</Link>
              <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>Menú</Typography>
            </Breadcrumbs>
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#1e293b", letterSpacing: "-0.5px" }}>
              Gestión de <Box component="span" sx={{ color: "#F55345" }}>Platos</Box>
            </Typography>
          </Box>
          <Button variant="contained" startIcon={<Add />} onClick={() => { setEditando(null); setOpen(true); }} sx={styles.actionButton}>
            Nuevo Plato
          </Button>
        </Box>

        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={styles.statCard}>
              <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, py: "12px !important" }}>
                <Avatar sx={{ bgcolor: "#fff1f0", color: "#F55345", width: 40, height: 40 }}><Inventory fontSize="small" /></Avatar>
                <Box>
                  <Typography color="text.secondary" sx={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase" }}>Total</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>{loading ? <Skeleton width={30} /> : stats.total}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={styles.statCard}>
              <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, py: "12px !important" }}>
                <Avatar sx={{ bgcolor: "#f0fdf4", color: "#22c55e", width: 40, height: 40 }}><LocalDining fontSize="small" /></Avatar>
                <Box>
                  <Typography color="text.secondary" sx={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase" }}>Precio Promedio</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>{loading ? <Skeleton width={50} /> : `$${stats.avg.toFixed(2)}`}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <TextField
          placeholder="Buscar plato por nombre..." value={filtro} onChange={(e) => setFiltro(e.target.value)} fullWidth sx={{ ...styles.searchWrapper, mb: 4 }}
          InputProps={{ 
            startAdornment: <InputAdornment position="start"><Search sx={{ color: "#94a3b8", fontSize: 20 }} /></InputAdornment>,
            endAdornment: filtro && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setFiltro("")}><Clear fontSize="small" /></IconButton>
              </InputAdornment>
            )
          }}
        />

        <Grid container spacing={3}>
          {loading ? Array.from({ length: 6 }).map((_, i) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}><Skeleton variant="rounded" height={280} sx={{ borderRadius: "20px" }} /></Grid>
          )) : filtrados.length === 0 ? (
            <Grid size={{ xs: 12 }}>
              <Stack alignItems="center" sx={{ py: 8, opacity: 0.4 }}><RestaurantMenu sx={{ fontSize: 60, mb: 1 }} /><Typography variant="body2">No se encontraron platillos</Typography></Stack>
            </Grid>
          ) : filtrados.map((prod) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={prod.id}>
              <Zoom in style={{ transitionDelay: '50ms' }}>
                <Card sx={styles.productCard} elevation={0}>
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={styles.imageBox}>
                      <Avatar src={prod.imageUrl ? getProductImageUrl(prod.imageUrl) : undefined} variant="rounded" sx={{ width: "100%", height: "100%", borderRadius: "12px" }}>
                        <Fastfood sx={{ fontSize: 40, color: "#cbd5e1" }} />
                      </Avatar>
                    </Box>

                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {prod.nombre}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#F55345" }}>
                        ${Number(prod.precio).toFixed(2)}
                      </Typography>
                    </Stack>

                    <Chip 
                      label={prod.categoria?.nombre || prod.categoria?.name || "General"} 
                      size="small" 
                      sx={{ fontSize: "0.65rem", fontWeight: 700, height: 20, bgcolor: "#f1f5f9", mb: 2 }} 
                    />

                    <Divider sx={{ mb: 1.5, opacity: 0.6 }} />

                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Tooltip title="Editar">
                        <IconButton size="small" onClick={() => { setEditando(prod); setOpen(true); }} sx={{ color: "#64748b", bgcolor: "#f8fafc" }}>
                          <Edit fontSize="inherit" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton size="small" onClick={() => { setItemToDelete(prod); setConfirmOpen(true); }} sx={{ color: "#ef4444", bgcolor: "#fff1f0" }}>
                          <Delete fontSize="inherit" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>
          ))}
        </Grid>
      </Container>

      <ProductoFormDialog open={open} mode={editando ? "edit" : "create"} initial={editando} onClose={() => setOpen(false)} onSubmit={handleSave} />
      <ConfirmDialog open={confirmOpen} title="¿Eliminar plato?" description={`Esta acción no se puede deshacer.`} onCancel={() => setConfirmOpen(false)} onConfirm={confirmDelete} />
    </Box>
  );
}