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

export default function MesaFormDialog({
  open,
  mode,
  initial,
  onClose,
  onSubmit,
}: Props): JSX.Element {
  const [numeroMesa, setNumeroMesa] = useState("");
  const [capacidad, setCapacidad] = useState<number | string>("");
  const [ubicacion, setUbicacion] = useState("");

  useEffect(() => {
    if (open) {
      setNumeroMesa(initial?.numeroMesa || "");
      setCapacidad(initial?.capacidad || "");
      setUbicacion(initial?.ubicacion || "");
    }
  }, [open, initial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ numeroMesa, capacidad, ubicacion });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>
        {mode === "create" ? "Nueva Mesa" : "Editar Mesa"}
      </DialogTitle>

      <DialogContent>
        <Stack
          spacing={3}
          component="form"
          id="mesa-form"
          onSubmit={handleSubmit}
          sx={{ mt: 2 }}
        >
          <TextField
            label="Número de mesa"
            value={numeroMesa}
            onChange={(e) => setNumeroMesa(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Capacidad"
            type="number"
            value={capacidad}
            onChange={(e) => setCapacidad(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Ubicación"
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
            fullWidth
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button type="submit" form="mesa-form" variant="contained">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
