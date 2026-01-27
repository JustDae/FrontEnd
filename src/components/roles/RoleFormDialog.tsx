import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
  Stack, TextField, FormControlLabel, Switch
} from "@mui/material";
import { useEffect, useState, type JSX } from "react";
import type { Rol } from "../../services/roles.service";

type Props = {
  open: boolean;
  mode: "create" | "edit";
  initial?: Rol | null;
  onClose: () => void;
  onSubmit: (payload: any) => void;
};

export default function RoleFormDialog({
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
      if (initial && mode === "edit") {
        setNombre(initial.nombre || "");
        setDescripcion(initial.descripcion || "");
        setActivo(initial.activo !== undefined ? initial.activo : true);
      } else {
        setNombre("");
        setDescripcion("");
        setActivo(true);
      }
    }
  }, [open, initial, mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ nombre, descripcion, activo });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: "bold" }}>
        {mode === "create" ? "Nuevo Rol" : "Editar Rol"}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} component="form" id="rol-form" onSubmit={handleSubmit} sx={{ mt: 2 }}>

          <TextField
            label="Nombre del Rol"
            placeholder="Ej: CAJERO"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            fullWidth
            required
            autoFocus
          />

          <TextField
            label="Descripción"
            placeholder="Breve descripción de funciones..."
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            fullWidth
            multiline
            rows={3}
          />

          <FormControlLabel
            control={
              <Switch
                checked={activo}
                onChange={(e) => setActivo(e.target.checked)}
                color="success"
              />
            }
            label={activo ? "Rol Activo" : "Rol Inactivo"}
          />

        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>
        <Button
          type="submit"
          form="rol-form"
          variant="contained"
          sx={{ bgcolor: "#F55345", "&:hover": { bgcolor: "#d44538" } }}
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}