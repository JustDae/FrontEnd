import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField
} from "@mui/material";
import { useState } from "react";

export default function PromocionFormDialog({ open, onClose, onSubmit }: any) {
  const [nombre, setNombre] = useState("");
  const [codigo, setCodigo] = useState("");
  const [descuento, setDescuento] = useState(0);
  const [inicio, setInicio] = useState("");
  const [fin, setFin] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      nombre,
      codigo,
      descuentoPorcentaje: Number(descuento),
      fechaInicio: inicio,
      fechaFin: fin
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Nueva Promoción</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2}>
            <TextField label="Nombre" fullWidth required value={nombre} onChange={(e) => setNombre(e.target.value)} />
            <TextField label="Código Único" fullWidth required value={codigo} onChange={(e) => setCodigo(e.target.value)} />
            <TextField label="% Descuento" type="number" fullWidth required value={descuento} onChange={(e) => setDescuento(Number(e.target.value))} />
            <TextField label="Fecha Inicio" type="date" fullWidth InputLabelProps={{ shrink: true }} value={inicio} onChange={(e) => setInicio(e.target.value)} />
            <TextField label="Fecha Fin" type="date" fullWidth InputLabelProps={{ shrink: true }} value={fin} onChange={(e) => setFin(e.target.value)} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" sx={{ bgcolor: "#F55345" }}>Crear Promo</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}