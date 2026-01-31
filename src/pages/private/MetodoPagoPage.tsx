import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Stack } from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { getMetodosPago, createMetodoPago, updateMetodoPago, deleteMetodoPago, type MetodoPago } from "../../services/metodo-pago.service";
import MetodoPagoFormDialog from "../../components/metodo-pago/MetodoPagoFormDialog";
import { useUi } from "../../context/UiContext";

export default function MetodoPagoPage() {
  const [metodos, setMetodos] = useState<MetodoPago[]>([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<MetodoPago | null>(null);
  const { notify } = useUi();

  const cargarDatos = async () => {
    try {
      const res = await getMetodosPago();
      setMetodos(res.data || []);
    } catch (err) {
      notify({ message: "Error al cargar métodos", severity: "error" });
    }
  };

  useEffect(() => { cargarDatos(); }, []);

  const handleSave = async (data: any) => {
    try {
      if (selected) await updateMetodoPago(selected.id, data);
      else await createMetodoPago(data);
      notify({ message: "Operación exitosa", severity: "success" });
      cargarDatos();
    } catch (err) {
      notify({ message: "Error al procesar", severity: "error" });
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Eliminar este método de pago?")) {
      try {
        await deleteMetodoPago(id);
        notify({ message: "Eliminado", severity: "warning" });
        cargarDatos();
      } catch (err) {
        notify({ message: "Error al eliminar", severity: "error" });
      }
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Stack direction="row" justifyContent="space-between" sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 900 }}>Métodos de Pago</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => { setSelected(null); setOpen(true); }}>
          Nuevo Método
        </Button>
      </Stack>

      <TableContainer component={Paper} sx={{ borderRadius: "15px" }}>
        <Table>
          <TableHead sx={{ bgcolor: "#2d3436" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: 700 }}>Nombre</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 700 }}>Descripción</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 700 }} align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {metodos.map((m) => (
              <TableRow key={m.id} hover>
                <TableCell sx={{ fontWeight: 800 }}>{m.nombre}</TableCell>
                <TableCell>{m.descripcion || "Sin descripción"}</TableCell>
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => { setSelected(m); setOpen(true); }}><Edit /></IconButton>
                  <IconButton color="error" onClick={() => handleDelete(m.id)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <MetodoPagoFormDialog open={open} onClose={() => setOpen(false)} onSave={handleSave} seleccionado={selected} />
    </Box>
  );
}