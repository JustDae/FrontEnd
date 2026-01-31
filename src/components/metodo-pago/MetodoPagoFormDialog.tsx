import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack } from "@mui/material";
import { useEffect, useState } from "react";

export default function MetodoPagoFormDialog({ open, onClose, onSave, seleccionado }: any) {
  const [formData, setFormData] = useState({ nombre: "", descripcion: "" });

  useEffect(() => {
    if (seleccionado) setFormData(seleccionado);
    else setFormData({ nombre: "", descripcion: "" });
  }, [seleccionado, open]);

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: 900 }}>
        {seleccionado ? "Editar Método" : "Nuevo Método de Pago"}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField
            label="Nombre del Método"
            fullWidth
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          />
          <TextField
            label="Descripción (Opcional)"
            fullWidth
            multiline
            rows={2}
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} color="inherit">Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" sx={{ fontWeight: 700 }}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}