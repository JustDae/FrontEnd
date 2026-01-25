import { useState, useEffect, type JSX } from "react";
import {
  Box, Typography, TextField, IconButton, Button,
  List, ListItem, ListItemText, ListItemSecondaryAction, Paper, Avatar
} from "@mui/material";
import { Search, Edit, Delete, Fastfood } from "@mui/icons-material";
import api from "../../services/api";
import { useUi } from "../../context/UiContext";
import ProductoFormDialog from "../../components/productos/ProductoFormDialog";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { getProductImageUrl } from "../../services/productos.service";

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  imageUrl?: string;
  categoria?: { id: number; name: string };
}

export default function ProductosPage(): JSX.Element {
  const { notify } = useUi();
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
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
        Gestión del Menú (Productos)
      </Typography>

      <Box display="flex" gap={2} alignItems="center" mb={3}>
        <TextField
          placeholder="Buscar plato..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          fullWidth
          InputProps={{ endAdornment: <Search /> }}
        />
        <Button
          variant="contained"
          onClick={() => { setEditando(null); setOpen(true); }}
          sx={{ bgcolor: "#F55345", "&:hover": { bgcolor: "#d44538" }, minWidth: "150px" }}
        >
          Nuevo Plato
        </Button>
      </Box>

      <Paper variant="outlined">
        <List>
          {filtrados.map((prod) => (
            <ListItem key={prod.id} divider>
              <Avatar
                src={prod.imageUrl ? getProductImageUrl(prod.imageUrl) : undefined}
                sx={{ bgcolor: "rgba(245, 83, 69, 0.1)", color: "#F55345", mr: 2, width: 56, height: 56 }}
              >
                {!prod.imageUrl && <Fastfood />}
              </Avatar>

              <ListItemText 
                primary={prod.nombre} 
                secondary={`${prod.categoria?.name || "Sin categoría"} — Precio: $${prod.precio}`} 
              />
              <ListItemSecondaryAction>
                <IconButton onClick={() => { setEditando(prod); setOpen(true); }} sx={{ color: "#F55345" }}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => askDelete(prod)} color="error">
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
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