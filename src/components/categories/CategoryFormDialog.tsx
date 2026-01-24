import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import type {CategoryDto} from "../../services/categories.service";

type Props = {
  open: boolean;
  mode: "create" | "edit";
  initial?: CategoryDto | null;
  onClose: () => void;
  onSubmit: (payload: { name: string }) => void;
};

export default function CategoryFormDialog({ open, mode, initial, onClose, onSubmit }: Props): JSX.Element {
  const [name, setName] = useState("");

  useEffect(() => {
    if (open) setName(initial?.name || "");
  }, [open, initial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name: name.trim() });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{mode === "create" ? "Nueva categoría" : "Editar categoría"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            label="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
            autoFocus
          />

          <DialogActions sx={{ px: 0 }}>
            <Button onClick={onClose}>Cancelar</Button>
            <Button type="submit" variant="contained" disabled={!name.trim()}>
              Guardar
            </Button>
          </DialogActions>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}