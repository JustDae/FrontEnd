import { useState, useEffect, useMemo, useCallback, type JSX } from "react";
import {
  Typography, TextField, IconButton, Button, Breadcrumbs,
  Link, Stack, Card, CardContent, InputAdornment, Skeleton, Container,
  Grid, Zoom, Divider, Chip
} from "@mui/material";
import { Search, Edit, Delete, NavigateNext, Add, Clear } from "@mui/icons-material";
import api from "../services/api";
import { useUi } from "../context/UiContext";
import MetodoPagoFormDialog from "../components/metodoPago/MetodoPagoFormDialog";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { useNavigate } from "react-router-dom";

interface MetodoPago {
  id: number;
  nombre: string;
  descripcion?: string;
  activo: boolean;
}

export default function MetodoPagoPage(): JSX.Element {
  const { notify } = useUi();
  const navigate = useNavigate();

  const [items, setItems] = useState<MetodoPago[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("");
  const [open, setOpen] = useState(false);
  const [editando, setEditando] = useState<MetodoPago | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MetodoPago | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/metodos-pago");
      setItems(res.data || []);
    } catch {
      notify({ message: "Error de conexión", severity: "error" });
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const filtrados = useMemo(
    () => items.filter(i => i.nombre.toLowerCase().includes(filtro.toLowerCase())),
    [items, filtro]
  );

  const handleSave = async (payload: any) => {
    try {
      editando
        ? await api.put(`/metodos-pago/${editando.id}`, payload)
        : await api.post("/metodos-pago", payload);

      notify({ message: "Método de pago guardado", severity: "success" });
      setOpen(false);
      fetchItems();
    } catch {
      notify({ message: "Error al guardar", severity: "error" });
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    await api.delete(`/metodos-pago/${itemToDelete.id}`);
    notify({ message: "Eliminado", severity: "success" });
    setConfirmOpen(false);
    fetchItems();
  };

  return (
    <Container sx={{ py: 4 }}>
      <Breadcrumbs separator={<NavigateNext fontSize="small" />}>
        <Link onClick={() => navigate("/dashboard")} sx={{ cursor: "pointer" }}>Admin</Link>
        <Typography>Métodos de Pago</Typography>
      </Breadcrumbs>

      <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={800}>Métodos de Pago</Typography>
        <Button startIcon={<Add />} variant="contained" onClick={() => { setEditando(null); setOpen(true); }}>
          Nuevo Método
        </Button>
      </Stack>

      <TextField
        placeholder="Buscar método..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        fullWidth
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
          endAdornment: filtro && <IconButton onClick={() => setFiltro("")}><Clear /></IconButton>
        }}
      />

      <Grid container spacing={3}>
        {loading ? <Skeleton height={120} /> : filtrados.map(item => (
          <Grid item xs={12} md={4} key={item.id}>
            <Zoom in>
              <Card>
                <CardContent>
                  <Typography fontWeight={700}>{item.nombre}</Typography>
                  <Typography color="text.secondary">{item.descripcion || "Sin descripción"}</Typography>

                  <Chip
                    label={item.activo ? "Activo" : "Inactivo"}
                    color={item.activo ? "success" : "default"}
                    size="small"
                    sx={{ mt: 1 }}
                  />

                  <Divider sx={{ my: 1 }} />

                  <Stack direction="row" justifyContent="flex-end">
                    <IconButton onClick={() => { setEditando(item); setOpen(true); }}><Edit /></IconButton>
                    <IconButton color="error" onClick={() => { setItemToDelete(item); setConfirmOpen(true); }}><Delete /></IconButton>
                  </Stack>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
        ))}
      </Grid>

      <MetodoPagoFormDialog open={open} mode={editando ? "edit" : "create"} initial={editando} onClose={() => setOpen(false)} onSubmit={handleSave} />
      <ConfirmDialog open={confirmOpen} title="¿Eliminar método?" description="Esta acción no se puede deshacer" onConfirm={confirmDelete} onCancel={() => setConfirmOpen(false)} />
    </Container>
  );
}
    