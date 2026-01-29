import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useEffect, useState } from "react";

type Props = {
  open: boolean;
  mode: "create" | "edit";
  initial?: any;
  onClose: () => void;
  onSubmit: (data: any) => void;
};

export default function MetodoPagoFormDialog({
  open,
  mode,
  initial,
  onClose,
  onSubmit,
}: Props) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [activo, setActivo] = useState(true);

  useEffect(() => {
    if (open) {
      setNombre(initial?.nombre || "");
      setDescripcion(initial?.descripcion || "");
      setActivo(initial?.activo ?? true);
    }
  }, [open, initial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      activo,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>
        {mode === "create"
          ? "Nuevo Método de Pago"
          : "Editar Método de Pago"}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            label="Nombre *"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            fullWidth
          />

          <TextField
            label="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            fullWidth
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={activo}
                onChange={(e) => setActivo(e.target.checked)}
              />
            }
            label="Activo"
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>
        <Button type="submit" variant="contained">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
