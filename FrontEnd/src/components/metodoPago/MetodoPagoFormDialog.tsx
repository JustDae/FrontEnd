import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useEffect, useState, type JSX } from "react";

type Props = {
  open: boolean;
  mode: "create" | "edit";
  initial?: any | null;
  onClose: () => void;
  onSubmit: (payload: any) => void;
};

export default function MetodoPagoFormDialog({
  open,
  mode,
  initial,
  onClose,
  onSubmit,
}: Props): JSX.Element {
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
    onSubmit({ nombre, descripcion, activo });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>
        {mode === "create" ? "Nuevo Método de Pago" : "Editar Método de Pago"}
      </DialogTitle>

      <DialogContent>
        <Stack
          spacing={3}
          component="form"
          id="metodo-pago-form"
          onSubmit={handleSubmit}
          sx={{ mt: 2 }}
        >
          <TextField
            label="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            fullWidth
            required
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
        <Button onClick={onClose}>Cancelar</Button>
        <Button type="submit" form="metodo-pago-form" variant="contained">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
