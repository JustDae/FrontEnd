import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect, useState, type JSX } from "react";
import type { DetallePedido } from "../../services/detalle-pedido.service";

type Props = {
  open: boolean;
  mode: "create" | "edit";
  initial?: DetallePedido | null;
  productos: any[]; 
  pedidos: any[];
  onClose: () => void;
  onSubmit: (payload: { 
    pedidoId: number; 
    productoId: number; 
    cantidad: number; 
    observaciones?: string 
  }) => void;
};

export default function DetallePedidoFormDialog({
  open,
  mode,
  initial,
  productos,
  pedidos,
  onClose,
  onSubmit,
}: Props): JSX.Element {
  const [pedidoId, setPedidoId] = useState<string>("");
  const [productoId, setProductoId] = useState<string>("");
  const [cantidad, setCantidad] = useState<number>(1);
  const [observaciones, setObservaciones] = useState("");

  useEffect(() => {
    if (open) {
      setPedidoId(initial?.pedidoId?.toString() || "");
      setProductoId(initial?.productoId?.toString() || "");
      setCantidad(initial?.cantidad || 1);
      setObservaciones(initial?.observaciones || "");
    }
  }, [open, initial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      pedidoId: Number(pedidoId),
      productoId: Number(productoId),
      cantidad: Number(cantidad),
      observaciones: observaciones.trim() || undefined,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: "bold" }}>
        {mode === "create" ? "Agregar plato al pedido" : "Editar detalle"}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          
          <FormControl fullWidth required>
            <InputLabel>Pedido</InputLabel>
            <Select
              label="Pedido"
              value={pedidoId}
              onChange={(e) => setPedidoId(e.target.value)}
            >
              {pedidos.map((p) => (
                <MenuItem key={p.id} value={p.id}>Pedido #{p.id} - {p.nombre_cliente}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth required>
            <InputLabel>Producto / Plato</InputLabel>
            <Select
              label="Producto / Plato"
              value={productoId}
              onChange={(e) => setProductoId(e.target.value)}
            >
              {productos.map((prod) => (
                <MenuItem key={prod.id} value={prod.id}>{prod.nombre} (${prod.precio})</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Cantidad"
            type="number"
            value={cantidad}
            onChange={(e) => setCantidad(Number(e.target.value))}
            fullWidth
            required
            slotProps={{ htmlInput: { min: 1 } }}
          />

          <TextField
            label="Observaciones (opcional)"
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            fullWidth
            multiline
            minRows={3}
            placeholder="Ej: Sin cebolla, término medio, etc."
          />

          <DialogActions sx={{ px: 0, pt: 2 }}>
            <Button onClick={onClose} sx={{ color: "text.secondary" }}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={!pedidoId || !productoId || cantidad < 1}
              sx={{ 
                bgcolor: "#F55345", 
                "&:hover": { bgcolor: "#d44538" } 
              }}
            >
              {mode === "create" ? "Enviar a cocina" : "Actualizar"}
            </Button>
          </DialogActions>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}