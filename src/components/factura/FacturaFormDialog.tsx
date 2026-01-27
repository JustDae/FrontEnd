import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";

export default function FacturaFormDialog({ open, pedido, onClose, onSubmit }: any) {
  const [razonSocial, setRazonSocial] = useState("");
  const [identificacion, setIdentificacion] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      razonSocial,
      ruc_cedula: identificacion,
      pedidoId: pedido.id
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: 'bold' }}>Emitir Factura</DialogTitle>
      <form id="factura-form" onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={3}>
            <Typography variant="subtitle2" color="primary">
              Facturando Pedido: #{pedido?.id?.substring(0,8)}...
            </Typography>
            <Typography variant="h6">Total a Pagar: ${pedido?.total}</Typography>
            <TextField label="Nombre / Razón Social" fullWidth required value={razonSocial} onChange={(e) => setRazonSocial(e.target.value)} />
            <TextField label="RUC / Cédula" fullWidth required value={identificacion} onChange={(e) => setIdentificacion(e.target.value)} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" sx={{ bgcolor: "#F55345" }}>Generar Factura</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}