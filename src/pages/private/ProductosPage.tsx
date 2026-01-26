import { useState, useEffect, useMemo, type JSX } from "react";
import {
  Box, Typography, TextField, IconButton, Button,
  List, ListItem, ListItemText, ListItemSecondaryAction, Paper, Avatar,
  Breadcrumbs, Link, Stack, Card, CardContent, Divider, Tooltip, InputAdornment
} from "@mui/material";
import { 
  Search, Edit, Delete, Fastfood, NavigateNext, 
  Add, Inventory, LocalDining 
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
  categoria?: { id: number; name: string };
}

export default function ProductosPage(): JSX.Element {
  const { notify } = useUi();
  const navigate = useNavigate();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [filtro, setFiltro] = useState("");
  const [open, setOpen] = useState(false);
  const [editando, setEditando] = useState<Producto | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Producto | null>(null);

  const fetchProductos = (): void => {
    api.get(`/productos?t=${Date.now()}`)
      .then(res => {
        const result = res.data?.data?.items || res.data?.items || res.data?.data || [];
        setProductos(Array.isArray(result) ? result : []);
      })
      .catch(() => {
        setProductos([]);
      });
  }

  useEffect(fetchProductos, []);

  const totalProductos = useMemo(() => productos.length, [productos]);
  const precioPromedio = useMemo(() => {
    if (productos.length === 0) return 0;
    const suma = productos.reduce((acc, p) => acc + Number(p.precio), 0);
    return suma / productos.length;
  }, [productos]);

  const handleSave = async (payload: FormData) => {
    try {
      if (editando) {
        await api.put(`/productos/${editando.id}`, payload);
        notify({ message: "Producto actualizado", severity: "success" });
      } else {
        await api.post("/productos", payload);
        notify({ message: "Producto creado", severity: "success" });
      }
      setOpen(false);
      fetchProductos();
    } catch {
      notify({ message: "Error al procesar la solicitud", severity: "error" });
    }
  };

  const askDelete = (producto: Producto): void => {
    setItemToDelete(producto);
    setConfirmOpen(true);
  };

  const confirmDelete = async (): Promise<void> => {
    if (!itemToDelete) return;
    try {
      await api.delete(`/productos/${itemToDelete.id}`);
      notify({ message: "Producto eliminado", severity: "success" });
      fetchProductos();
    } catch {
      notify({ message: "Error al eliminar el producto", severity: "error" });
    } finally {
      setConfirmOpen(false);
      setItemToDelete(null);
    }
  };

  const filtrados = Array.isArray(productos)
    ? productos.filter(p => p.nombre.toLowerCase().includes(filtro.toLowerCase()))
    : [];

  return (
    <Box sx={{ p: 4, bgcolor: "#f9f9f9", minHeight: "100vh" }}>
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ mb: 1 }}>
          <Link underline="hover" color="inherit" onClick={() => navigate("/dashboard")} sx={{ cursor: "pointer" }}>
            Dashboard
          </Link>
          <Typography color="text.primary">Productos</Typography>
        </Breadcrumbs>
        
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" sx={{ fontWeight: 900, color: "#2d3436" }}>
            Gestión del Menú
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => { setEditando(null); setOpen(true); }}
            sx={{ bgcolor: "#F55345", "&:hover": { bgcolor: "#d44538" }, borderRadius: "12px", px: 3 }}
          >
            Nuevo Plato
          </Button>
        </Stack>
      </Box>

      <Box sx={{ display: "flex", gap: 3, mb: 4, flexWrap: "wrap" }}>
        <Card variant="outlined" sx={{ flex: "1 1 300px", borderRadius: "16px", borderLeft: "6px solid #F55345" }}>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: "rgba(245, 83, 69, 0.1)", color: "#F55345" }}>
                <Inventory />
              </Avatar>
              <Box>
                <Typography variant="caption" color="text.secondary">Total Platillos</Typography>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>{totalProductos}</Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ flex: "1 1 300px", borderRadius: "16px", borderLeft: "6px solid #4caf50" }}>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: "rgba(76, 175, 80, 0.1)", color: "#4caf50" }}>
                <LocalDining />
              </Avatar>
              <Box>
                <Typography variant="caption" color="text.secondary">Precio Promedio</Typography>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>${precioPromedio.toFixed(2)}</Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Box>

      <TextField
        placeholder="Buscar plato por nombre..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        fullWidth
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search color="action" />
            </InputAdornment>
          ),
          sx: { borderRadius: "14px", bgcolor: "white" }
        }}
      />

      <Paper variant="outlined" sx={{ borderRadius: "16px", overflow: "hidden" }}>
        <List sx={{ p: 0 }}>
          {filtrados.length === 0 ? (
            <Box sx={{ p: 5, textAlign: "center" }}>
              <Typography color="text.secondary">No se encontraron productos en el menú.</Typography>
            </Box>
          ) : (
            filtrados.map((prod, index) => (
              <Box key={prod.id}>
                <ListItem sx={{ py: 2, px: 3, "&:hover": { bgcolor: "#fcfcfc" } }}>
                  <Avatar
                    src={prod.imageUrl ? getProductImageUrl(prod.imageUrl) : undefined}
                    sx={{ bgcolor: "rgba(245, 83, 69, 0.1)", color: "#F55345", mr: 3, width: 64, height: 64, borderRadius: "12px" }}
                  >
                    {!prod.imageUrl && <Fastfood />}
                  </Avatar>

                  <ListItemText 
                    primary={<Typography sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>{prod.nombre}</Typography>} 
                    secondary={
                      <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          {prod.categoria?.name || "Sin categoría"}
                        </Typography>
                        <Typography variant="body2" color="primary" sx={{ fontWeight: "bold" }}>
                          — ${Number(prod.precio).toFixed(2)}
                        </Typography>
                      </Stack>
                    } 
                  />
                  
                  <ListItemSecondaryAction sx={{ right: 24 }}>
                    <Tooltip title="Editar">
                      <IconButton onClick={() => { setEditando(prod); setOpen(true); }} sx={{ color: "#F55345", mr: 1 }}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton onClick={() => askDelete(prod)} color="error">
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < filtrados.length - 1 && <Divider component="li" />}
              </Box>
            ))
          )}
        </List>
      </Paper>

      <ProductoFormDialog 
        open={open}
        mode={editando ? "edit" : "create"}
        initial={editando}
        onClose={() => setOpen(false)}
        onSubmit={handleSave}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Confirmar eliminación"
        description={`¿Eliminar el producto "${itemToDelete?.nombre || ""}" del menú?`}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
      />
    </Box>
  );
}