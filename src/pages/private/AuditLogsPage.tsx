import { useState, useEffect, type JSX } from "react";
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Chip, TextField, LinearProgress 
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { getAuditLogs, type AuditLog } from "../../services/audit-logs.service";

export default function AuditLogsPage(): JSX.Element {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [filtro, setFiltro] = useState("");

  const cargarLogs = async () => {
    setLoading(true);
    try {
      const res = await getAuditLogs();
      const lista = res.data?.items || res.data || [];
      setLogs(Array.isArray(lista) ? lista : []);
    } catch {
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarLogs();
  }, []);

  const logsFiltrados = logs.filter(log => 
    log.action.toLowerCase().includes(filtro.toLowerCase()) ||
    log.entity.toLowerCase().includes(filtro.toLowerCase()) ||
    log.userId?.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
        Registros de Auditoría
      </Typography>

      <TextField
        fullWidth
        placeholder="Buscar por acción, entidad o usuario..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        sx={{ mb: 3, bgcolor: "white" }}
        InputProps={{ endAdornment: <Search /> }}
      />

      {loading && <LinearProgress sx={{ mb: 2, color: "#F55345" }} />}

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead sx={{ bgcolor: "#f5f5f5" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Fecha</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Acción</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Entidad</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Usuario ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Descripción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logsFiltrados.map((log) => (
              <TableRow key={log._id}>
                <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
                <TableCell>
                  <Chip 
                    label={log.action} 
                    size="small" 
                    sx={{ 
                      fontWeight: "bold",
                      bgcolor: log.action.includes('DELETE') ? '#ffebee' : '#e8f5e9',
                      color: log.action.includes('DELETE') ? '#c62828' : '#2e7d32'
                    }} 
                  />
                </TableCell>
                <TableCell>{log.entity}</TableCell>
                <TableCell color="text.secondary">{log.userId || "N/A"}</TableCell>
                <TableCell>{log.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}