import {
  Box, Typography, Button, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Stack, Tooltip
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useEffect, useState } from "react";
import { getMesas, createMesa, updateMesa, deleteMesa, type Mesa } from "../../services/mesa.service";
import MesaFormDialog from "../../components/mesa/MesaFormDialog";
import { useUi } from "../../context/UiContext";
import { useNavigate } from "react-router-dom";

export default function MesasPage() {
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedMesa, setSelectedMesa] = useState<Mesa | null>(null);
  const { notify } = useUi();
  const navigate = useNavigate();

  const handleVincularPedido = (m: Mesa) => {
    try {
      if (m.estado !== 'libre') {
        notify({
          message: `La mesa ${m.numero} no está disponible para nuevos pedidos`,
          severity: "warning"
        });
        return;
      }
      navigate(`/dashboard/pedidos?mesaId=${m.id}&numero=${m.numero}`);
    } catch (error) {
      console.error("Error en navegación:", error);
      notify({ message: "Error interno al intentar vincular la mesa", severity: "error" });
    }
  };

  const cargarMesas = async () => {
    try {
      const res = await getMesas();
      const lista = res.data?.items || res.data || [];
      setMesas(Array.isArray(lista) ? lista : []);
    } catch (err) {
      notify({ message: "Error al cargar mesas", severity: "error" });
    }
  };

  useEffect(() => { cargarMesas(); }, []);

  const handleSave = async (data: any) => {
    try {
      if (selectedMesa) {
        await updateMesa(selectedMesa.id, data);
        notify({ message: "Mesa actualizada correctamente", severity: "success" });
      } else {
        await createMesa(data);
        notify({ message: "Mesa creada exitosamente", severity: "success" });
      }
      setOpen(false);
      cargarMesas();
    } catch (err) {
      notify({ message: "Error al guardar los datos", severity: "error" });
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Estás seguro de eliminar esta mesa?")) {
      try {
        await deleteMesa(id);
        notify({ message: "Mesa eliminada", severity: "warning" });
        cargarMesas();
      } catch (err) {
        notify({ message: "No se pudo eliminar la mesa", severity: "error" });
      }
    }
  };

  return (
    <Box sx={{ p: 4, bgcolor: "#f4f7fe", minHeight: "100vh" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: "#1e293b" }}>Gestión de Mesas</Typography>
          <Typography variant="body2" color="text.secondary">Administra el estado y capacidad de las mesas.</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => { setSelectedMesa(null); setOpen(true); }}
          sx={{ borderRadius: "12px", fontWeight: 700, bgcolor: "#F55345", "&:hover": { bgcolor: "#d44538" } }}
        >
          Nueva Mesa
        </Button>
      </Stack>

      <TableContainer component={Paper} sx={{ borderRadius: "20px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
        <Table>
          <TableHead sx={{ bgcolor: "#f8fafc" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 800, color: "#64748b" }}>NÚMERO</TableCell>
              <TableCell sx={{ fontWeight: 800, color: "#64748b" }}>CAPACIDAD</TableCell>
              <TableCell sx={{ fontWeight: 800, color: "#64748b" }}>ESTADO</TableCell>
              <TableCell sx={{ fontWeight: 800, color: "#64748b" }} align="center">ACCIONES</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mesas.map((m) => (
              <TableRow key={m.id} hover>
                <TableCell sx={{ fontWeight: 900, fontSize: "1.1rem" }}>Mesa {m.numero}</TableCell>
                <TableCell>{m.capacidad} personas</TableCell>
                <TableCell>
                  <Box sx={{
                    display: 'inline-block', px: 2, py: 0.5, borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800,
                    bgcolor: m.estado === 'libre' ? '#f0fdf4' : '#fef2f2',
                    color: m.estado === 'libre' ? '#16a34a' : '#ef4444',
                    textTransform: 'uppercase'
                  }}>
                    {m.estado}
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <Tooltip title="Vincular Pedido">
                      <IconButton
                        size="small"
                        onClick={() => handleVincularPedido(m)}
                        sx={{ color: "#6366f1", "&:hover": { bgcolor: "#eef2ff" } }}
                      >
                        <ReceiptLongIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Editar">
                      <IconButton
                        size="small"
                        onClick={() => { setSelectedMesa(m); setOpen(true); }}
                        sx={{ color: "#94a3b8", "&:hover": { color: "#3b82f6" } }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Eliminar">
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(m.id)}
                        sx={{ color: "#94a3b8", "&:hover": { color: "#ef4444" } }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <MesaFormDialog
        open={open}
        onClose={() => setOpen(false)}
        onSave={handleSave}
        mesaSeleccionada={selectedMesa}
      />
    </Box>
  );
}