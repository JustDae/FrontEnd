import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  MenuItem,
} from "@mui/material";
import { useEffect, useState, type JSX } from "react";

type Props = {
  open: boolean;
  mode: "create" | "edit";
  initial?: any | null;
  onClose: () => void;
  onSubmit: (payload: any) => void;
};

export default function ResenaFormDialog({
  open,
  mode,
  initial,
  onClose,
  onSubmit,
}: Props): JSX.Element {
  const [comentario, setComentario] = useState("");
  const [calificacion, setCalificacion] = useState(5);

  useEffect(() => {
    if (open) {
      setComentario(initial?.comentario || "");
      setCalificacion(initial?.calificacion || 5);
    }
  }, [open, initial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ comentario, calificacion });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>
        {mode === "create" ? "Nueva Reseña" : "Editar Reseña"}
      </DialogTitle>

      <DialogContent>
        <Stack
          spacing={3}
          component="form"
          id="resena-form"
          onSubmit={handleSubmit}
          sx={{ mt: 2 }}
        >
          <TextField
            label="Comentario"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            fullWidth
            multiline
            rows={3}
          />
          <TextField
            select
            label="Calificación"
            value={calificacion}
            onChange={(e) => setCalificacion(Number(e.target.value))}
            fullWidth
          >
            {[5, 4, 3, 2, 1].map((v) => (
              <MenuItem key={v} value={v}>
                {"⭐".repeat(v)}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button type="submit" form="resena-form" variant="contained">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
