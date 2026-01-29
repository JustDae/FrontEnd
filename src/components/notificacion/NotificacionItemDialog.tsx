import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect, useState, type JSX } from "react";

type Props = {
  open: boolean;
  mode: "create" | "edit";
  initial?: any | null;
  onClose: () => void;
  onSubmit: (payload: any) => void;
};

export default function NotificacionFormDialog({
  open,
  mode,
  initial,
  onClose,
  onSubmit,
}: Props): JSX.Element {
  const [titulo, setTitulo] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (open) {
      setTitulo(initial?.titulo || "");
      setMensaje(initial?.mensaje || "");
    }
  }, [open, initial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ titulo, mensaje });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>
        {mode === "create" ? "Nueva Notificación" : "Editar Notificación"}
      </DialogTitle>

      <DialogContent>
        <Stack
          spacing={3}
          component="form"
          id="notificacion-form"
          onSubmit={handleSubmit}
          sx={{ mt: 2 }}
        >
          <TextField
            label="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Mensaje"
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            fullWidth
            multiline
            rows={3}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button type="submit" form="notificacion-form" variant="contained">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
