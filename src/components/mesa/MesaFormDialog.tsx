import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Stack } from "@mui/material";
import { useEffect, useState } from "react";

export default function MesaFormDialog({ open, onClose, onSave, mesaSeleccionada }: any) {
  const [formData, setFormData] = useState({ numero: "", capacidad: 2, estado: "libre" });

  useEffect(() => {
    if (mesaSeleccionada) setFormData(mesaSeleccionada);
    else setFormData({ numero: "", capacidad: 2, estado: "libre" });
  }, [mesaSeleccionada, open]);

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: 900 }}>
        {mesaSeleccionada ? "Editar Mesa" : "Nueva Mesa"}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField
            label="Número de Mesa"
            fullWidth
            value={formData.numero}
            onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
          />
          <TextField
            label="Capacidad"
            type="number"
            fullWidth
            value={formData.capacidad}
            onChange={(e) => setFormData({ ...formData, capacidad: parseInt(e.target.value) })}
          />
          <TextField
            select
            label="Estado"
            fullWidth
            value={formData.estado}
            onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
          >
            <MenuItem value="libre">Libre</MenuItem>
            <MenuItem value="ocupada">Ocupada</MenuItem>
            <MenuItem value="reservada">Reservada</MenuItem>
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} color="inherit">Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" sx={{ fontWeight: 700 }}>
          Guardar Mesa
        </Button>
      </DialogActions>
    </Dialog>
  );
}