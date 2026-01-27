import { useState, useEffect, useCallback, type JSX } from "react";
import {
  Box, Typography, Container, Card, CardContent, Stack,
  IconButton, Tooltip, Skeleton
} from "@mui/material";
import { Done } from "@mui/icons-material";
import api from "../services/api";
import { useUi } from "../context/UiContext";

interface Notificacion {
  id: number;
  titulo: string;
  mensaje: string;
  leida: boolean;
}

export default function NotificacionesPage(): JSX.Element {
  const { notify } = useUi();
  const [items, setItems] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/notificaciones");
      setItems(res.data || []);
    } catch {
      notify({ message: "Error de conexión", severity: "error" });
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const marcarLeida = async (id: number) => {
    await api.put(`/notificaciones/${id}/leer`);
    fetchItems();
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={800} mb={3}>Notificaciones</Typography>

      {loading ? <Skeleton height={120} /> : items.map(n => (
        <Card key={n.id} sx={{ mb: 2, opacity: n.leida ? 0.6 : 1 }}>
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography fontWeight={700}>{n.titulo}</Typography>
                <Typography color="text.secondary">{n.mensaje}</Typography>
              </Box>

              {!n.leida && (
                <Tooltip title="Marcar como leída">
                  <IconButton onClick={() => marcarLeida(n.id)}>
                    <Done />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
}
