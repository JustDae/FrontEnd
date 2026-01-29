import { useState, useEffect, useCallback, type JSX } from "react";
import {
  Typography, Container, Card, CardContent, Stack,
  IconButton, Divider, Skeleton
} from "@mui/material";
import { Edit, Delete, Star } from "@mui/icons-material";
import api from "../services/api";
import { useUi } from "../context/UiContext";
import ResenaFormDialog from "../components/resena/ResenaFormDialog";
import ConfirmDialog from "../components/common/ConfirmDialog";

interface Resena {
  id: number;
  comentario: string;
  calificacion: number;
}

export default function ResenasPage(): JSX.Element {
  const { notify } = useUi();
  const [items, setItems] = useState<Resena[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editando, setEditando] = useState<Resena | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Resena | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/resenas");
      setItems(res.data || []);
    } catch {
      notify({ message: "Error de conexión", severity: "error" });
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleSave = async (payload: any) => {
    try {
      editando
        ? await api.put(`/resenas/${editando.id}`, payload)
        : await api.post("/resenas", payload);

      notify({ message: "Reseña guardada", severity: "success" });
      setOpen(false);
      fetchItems();
    } catch {
      notify({ message: "Error al guardar", severity: "error" });
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    await api.delete(`/resenas/${itemToDelete.id}`);
    notify({ message: "Reseña eliminada", severity: "success" });
    setConfirmOpen(false);
    fetchItems();
  };

  return (
    <Container sx={{ py: 4 }}>
      <Stack direction="row" justifyContent="space-between" mb={3}>
        <Typography variant="h4" fontWeight={800}>Reseñas</Typography>
        <IconButton color="primary" onClick={() => { setEditando(null); setOpen(true); }}>
          <Star />
        </IconButton>
      </Stack>

      {loading ? <Skeleton height={120} /> : items.map(r => (
        <Card key={r.id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography fontWeight={700}>{"⭐".repeat(r.calificacion)}</Typography>
            <Typography color="text.secondary">{r.comentario}</Typography>

            <Divider sx={{ my: 1 }} />

            <Stack direction="row" justifyContent="flex-end">
              <IconButton onClick={() => { setEditando(r); setOpen(true); }}><Edit /></IconButton>
              <IconButton color="error" onClick={() => { setItemToDelete(r); setConfirmOpen(true); }}><Delete /></IconButton>
            </Stack>
          </CardContent>
        </Card>
      ))}

      <ResenaFormDialog open={open} mode={editando ? "edit" : "create"} initial={editando} onClose={() => setOpen(false)} onSubmit={handleSave} />
      <ConfirmDialog open={confirmOpen} title="¿Eliminar reseña?" description="Esta acción no se puede deshacer" onConfirm={confirmDelete} onCancel={() => setConfirmOpen(false)} />
    </Container>
  );
}
