import { useState, useEffect, useMemo, useCallback, type JSX } from "react";
import {
  Box, Typography, TextField, IconButton, Button, Breadcrumbs,
  Link, Stack, Card, CardContent, InputAdornment, Skeleton, Container,
  Grid, Zoom, Divider, Tooltip
} from "@mui/material";
import { Search, Edit, Delete, NavigateNext, Add, TableBar, Clear } from "@mui/icons-material";
import api from "../services/api";
import { useUi } from "../context/UiContext";
import MesaFormDialog from "../components/mesa/MesaFormDialog";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { useNavigate } from "react-router-dom";

interface Mesa {
  id: number;
  numeroMesa: string;
  capacidad: number;
  ubicacion?: string;
}

export default function MesaPage(): JSX.Element {
  const { notify } = useUi();
  const navigate = useNavigate();

  const [items, setItems] = useState<Mesa[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("");
  const [open, setOpen] = useState(false);
  const [editando, setEditando] = useState<Mesa | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Mesa | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/mesas");
      setItems(res.data || []);
    } catch {
      notify({ message: "Error de conexión", severity: "error" });
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const filtrados = useMemo(
    () => items.filter(m => m.numeroMesa.toLowerCase().includes(filtro.toLowerCase())),
    [items, filtro]
  );

  const handleSave = async (payload: any) => {
    try {
      editando
        ? await api.put(`/mesas/${editando.id}`, payload)
        : await api.post("/mesas", payload);

      notify({ message: "Mesa guardada", severity: "success" });
      setOpen(false);
      fetchItems();
    } catch {
      notify({ message: "Error al guardar", severity: "error" });
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    await api.delete(`/mesas/${itemToDelete.id}`);
    notify({ message: "Mesa eliminada", severity: "success" });
    setConfirmOpen(false);
    fetchItems();
  };

  return (
    <Container sx={{ py: 4 }}>
      <Breadcrumbs separator={<NavigateNext fontSize="small" />}>
        <Link onClick={() => navigate("/dashboard")} sx={{ cursor: "pointer" }}>Admin</Link>
        <Typography>Mesas</Typography>
      </Breadcrumbs>

      <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={800}>Gestión de Mesas</Typography>
        <Button startIcon={<Add />} variant="contained" onClick={() => { setEditando(null); setOpen(true); }}>
          Nueva Mesa
        </Button>
      </Stack>

      <TextField
        placeholder="Buscar mesa..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        fullWidth
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
          endAdornment: filtro && (
            <IconButton onClick={() => setFiltro("")}><Clear /></IconButton>
          )
        }}
      />

      <Grid container spacing={3}>
        {loading ? <Skeleton height={120} /> : filtrados.map(mesa => (
          <Grid item xs={12} md={4} key={mesa.id}>
            <Zoom in>
              <Card>
                <CardContent>
                  <Typography fontWeight={700}>Mesa {mesa.numeroMesa}</Typography>
                  <Typography color="text.secondary">Capacidad: {mesa.capacidad}</Typography>
                  <Typography color="text.secondary">Ubicación: {mesa.ubicacion || "-"}</Typography>

                  <Divider sx={{ my: 1 }} />

                  <Stack direction="row" justifyContent="flex-end">
                    <Tooltip title="Editar">
                      <IconButton onClick={() => { setEditando(mesa); setOpen(true); }}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton color="error" onClick={() => { setItemToDelete(mesa); setConfirmOpen(true); }}>
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
        ))}
      </Grid>

      <MesaFormDialog open={open} mode={editando ? "edit" : "create"} initial={editando} onClose={() => setOpen(false)} onSubmit={handleSave} />
      <ConfirmDialog open={confirmOpen} title="¿Eliminar mesa?" description="Esta acción no se puede deshacer" onConfirm={confirmDelete} onCancel={() => setConfirmOpen(false)} />
    </Container>
  );
}
