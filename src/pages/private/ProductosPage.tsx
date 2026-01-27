import { useState, useEffect, useMemo, useCallback, type JSX } from "react";
import {
  Box, Typography, TextField, IconButton, Button,
  Avatar, Breadcrumbs, Link, Stack, Card, CardContent, 
  InputAdornment, Skeleton, Container, Grid as Grid, Zoom,
  Divider
} from "@mui/material";
import { 
  Search, Edit, Delete, Fastfood, NavigateNext, 
  Add, Inventory, LocalDining, RestaurantMenu
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
  container: { minHeight: "100vh", bgcolor: "#f4f7fe", pb: 10, pt: 6 },
  headerSection: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", mb: 6 },
  statCard: {
    borderRadius: "24px", border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
    background: "white", height: "100%", display: "flex", alignItems: "center",
    transition: "transform 0.3s ease", "&:hover": { transform: "translateY(-5px)" }
  },
  actionButton: {
    bgcolor: "#F55345", color: "white", px: 4, py: 1.8, borderRadius: "18px",
    textTransform: "none", fontWeight: 800, fontSize: "1rem",
    boxShadow: "0 15px 25px rgba(245, 83, 69, 0.25)",
    "&:hover": { bgcolor: "#d44538", boxShadow: "0 18px 30px rgba(245, 83, 69, 0.35)" }
  },
  searchWrapper: {
    "& .MuiOutlinedInput-root": {
      bgcolor: "white", borderRadius: "22px", height: "64px", fontSize: "1.1rem",
      boxShadow: "0 10px 25px rgba(0,0,0,0.03)", "& fieldset": { border: "none" },
      "&:hover": { boxShadow: "0 15px 30px rgba(0,0,0,0.06)" },
      "&.Mui-focused": { boxShadow: "0 15px 35px rgba(0,0,0,0.08)" }
    }
  },
  productCard: {
    borderRadius: "28px", border: "1px solid rgba(255,255,255,0.8)",
    background: "rgba(255,255,255,0.9)", backdropFilter: "blur(10px)",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)", overflow: "hidden",
    "&:hover": { transform: "translateY(-10px)", boxShadow: "0 30px 60px rgba(0,0,0,0.12)" }
  },
  imageBox: {
    width: "100%", height: 200, borderRadius: "24px", overflow: "hidden",
    mb: 2, bgcolor: "#f0f2f5", display: "flex", alignItems: "center", justifyContent: "center"
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
        notify({ message: "Actualizado correctamente", severity: "success" });
      } else {
        await api.post("/productos", payload);
        notify({ message: "Creado correctamente", severity: "success" });
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
            <Breadcrumbs separator={<NavigateNext sx={{ fontSize: 18 }} />} sx={{ mb: 1, opacity: 0.5 }}>
              <Link underline="hover" color="inherit" onClick={() => navigate("/dashboard")} sx={{ cursor: "pointer", fontWeight: 600 }}>Admin</Link>
              <Typography color="text.primary" sx={{ fontWeight: 600 }}>Menú</Typography>
            </Breadcrumbs>
            <Typography variant="h2" sx={{ fontWeight: 900, color: "#1a202c", letterSpacing: "-2px" }}>
              Catálogo <Box component="span" sx={{ color: "#F55345" }}>Digital</Box>
            </Typography>
          </Box>
          <Button variant="contained" startIcon={<Add sx={{ fontSize: 28 }} />} onClick={() => { setEditando(null); setOpen(true); }} sx={styles.actionButton}>
            Nuevo Plato
          </Button>
        </Box>

        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={styles.statCard}>
              <CardContent sx={{ display: "flex", alignItems: "center", gap: 3, p: "24px !important" }}>
                <Avatar sx={{ bgcolor: "#fef2f2", color: "#F55345", width: 64, height: 64 }}><Inventory fontSize="large" /></Avatar>
                <Box>
                  <Typography color="text.secondary" variant="button" sx={{ fontWeight: 700, opacity: 0.6 }}>Productos</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 900 }}>{loading ? <Skeleton width={50} /> : stats.total}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={styles.statCard}>
              <CardContent sx={{ display: "flex", alignItems: "center", gap: 3, p: "24px !important" }}>
                <Avatar sx={{ bgcolor: "#f0fdf4", color: "#22c55e", width: 64, height: 64 }}><LocalDining fontSize="large" /></Avatar>
                <Box>
                  <Typography color="text.secondary" variant="button" sx={{ fontWeight: 700, opacity: 0.6 }}>Promedio</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 900 }}>{loading ? <Skeleton width={50} /> : `$${stats.avg.toFixed(2)}`}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <TextField
          placeholder="Busca un platillo..." value={filtro} onChange={(e) => setFiltro(e.target.value)} fullWidth sx={{ ...styles.searchWrapper, mb: 6 }}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ color: "#F55345", fontSize: 30, ml: 1, mr: 1 }} /></InputAdornment> }}
        />

        <Grid container spacing={4}>
          {loading ? [1, 2, 3].map(i => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}><Skeleton variant="rounded" height={350} sx={{ borderRadius: "28px" }} /></Grid>
          )) : filtrados.length === 0 ? (
            <Grid size={{ xs: 12 }}>
              <Stack alignItems="center" sx={{ py: 10, opacity: 0.3 }}><RestaurantMenu sx={{ fontSize: 100, mb: 2 }} /><Typography variant="h5" fontWeight={700}>No hay platos</Typography></Stack>
            </Grid>
          ) : filtrados.map((prod) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={prod.id}>
              <Zoom in style={{ transitionDelay: '100ms' }}>
                <Card sx={styles.productCard} elevation={0}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={styles.imageBox}>
                      <Avatar src={prod.imageUrl ? getProductImageUrl(prod.imageUrl) : undefined} variant="rounded" sx={{ width: "100%", height: "100%", borderRadius: "24px" }}>
                        <Fastfood sx={{ fontSize: 50, color: "#cbd5e1" }} />
                      </Avatar>
                    </Box>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
                      <Typography variant="h5" sx={{ fontWeight: 900, color: "#1e293b" }}>{prod.nombre}</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 900, color: "#F55345" }}>${Number(prod.precio).toFixed(2)}</Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 600, mb: 3 }}>
                      {prod.categoria?.nombre || prod.categoria?.name || "Categoría general"}
                    </Typography>
                    <Divider sx={{ mb: 2, opacity: 0.5 }} />
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <IconButton onClick={() => { setEditando(prod); setOpen(true); }} sx={{ bgcolor: "#f1f5f9" }}><Edit fontSize="small" /></IconButton>
                      <IconButton onClick={() => { setItemToDelete(prod); setConfirmOpen(true); }} sx={{ bgcolor: "#fef2f2", color: "#ef4444" }}><Delete fontSize="small" /></IconButton>
                    </Stack>
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>
          ))}
        </Grid>
      </Container>

      <ProductoFormDialog open={open} mode={editando ? "edit" : "create"} initial={editando} onClose={() => setOpen(false)} onSubmit={handleSave} />
      <ConfirmDialog open={confirmOpen} title="Confirmar" description={`¿Quitar "${itemToDelete?.nombre}"?`} onCancel={() => setConfirmOpen(false)} onConfirm={confirmDelete} />
    </Box>
  );
}