<<<<<<< HEAD
import { useState, useEffect, type JSX } from "react";
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Chip, TextField, LinearProgress 
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { getAuditLogs, type AuditLog } from "../../services/audit-logs.service";

export default function AuditLogsPage(): JSX.Element {
=======
import { useState, useEffect, useMemo, useCallback, type JSX } from "react";
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Chip, TextField, 
  LinearProgress, Breadcrumbs, Link, Stack, InputAdornment, Container, 
  Fade, Avatar, Tooltip} from "@mui/material";
import { Search, NavigateNext, History, Storage, Person, Description } from "@mui/icons-material";
import { getAuditLogs, type AuditLog } from "../../services/audit-logs.service";
import { useNavigate } from "react-router-dom";

const styles = {
  container: { minHeight: "100vh", bgcolor: "#f1f5f9", pb: 8, pt: 4 },
  headerBox: {
    mb: 5,
    p: 4,
    borderRadius: "24px",
    background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
    boxShadow: "0 10px 40px rgba(0,0,0,0.03)",
    border: "1px solid rgba(255,255,255,0.8)"
  },
  searchField: {
    "& .MuiOutlinedInput-root": {
      bgcolor: "white",
      borderRadius: "18px",
      height: "56px",
      transition: "all 0.3s ease",
      "& fieldset": { border: "1px solid #e2e8f0" },
      "&:hover fieldset": { borderColor: "#F55345" },
      "&.Mui-focused": {
        boxShadow: "0 12px 20px rgba(0,0,0,0.05)",
        "& fieldset": { borderColor: "#F55345", borderWidth: "2px" }
      }
    }
  },
  tablePaper: {
    borderRadius: "24px",
    border: "none",
    boxShadow: "0 20px 50px rgba(0,0,0,0.04)",
    overflow: "hidden",
    bgcolor: "white"
  },
  headerCell: {
    fontWeight: 900,
    color: "#475569",
    fontSize: "0.75rem",
    textTransform: "uppercase",
    letterSpacing: "1.2px",
    py: 2.5,
    borderBottom: "2px solid #f1f5f9"
  },
  rowStyle: {
    "&:hover": { bgcolor: "#f8fafc" },
    transition: "all 0.2s ease"
  }
};

export default function AuditLogsPage(): JSX.Element {
  const navigate = useNavigate();
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [filtro, setFiltro] = useState("");

<<<<<<< HEAD
  const cargarLogs = async () => {
=======
  const cargarLogs = useCallback(async () => {
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
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
<<<<<<< HEAD
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
=======
  }, []);

  useEffect(() => {
    cargarLogs();
  }, [cargarLogs]);

  const logsFiltrados = useMemo(() => {
    const term = filtro.toLowerCase();
    return logs.filter(log => 
      (log.action?.toLowerCase().includes(term) ?? false) ||
      (log.entity?.toLowerCase().includes(term) ?? false) ||
      (log.userId?.toLowerCase().includes(term) ?? false) ||
      (log.description?.toLowerCase().includes(term) ?? false)
    );
  }, [logs, filtro]);

  const getActionTheme = (action: string) => {
    const act = action.toUpperCase();
    if (act.includes('DELETE')) return { bg: "#fef2f2", text: "#ef4444", border: "#fee2e2" };
    if (act.includes('CREATE')) return { bg: "#f0fdf4", text: "#22c55e", border: "#dcfce7" };
    if (act.includes('UPDATE')) return { bg: "#fff7ed", text: "#f97316", border: "#ffedd5" };
    return { bg: "#f8fafc", text: "#64748b", border: "#e2e8f0" };
  };

  return (
    <Box sx={styles.container}>
      <Container maxWidth="xl">
        <Box sx={styles.headerBox}>
          <Breadcrumbs separator={<NavigateNext sx={{ fontSize: 16, opacity: 0.5 }} />} sx={{ mb: 2 }}>
            <Link underline="hover" color="inherit" onClick={() => navigate("/dashboard")} sx={{ cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}>
              Panel Control
            </Link>
            <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: "#F55345" }}>Seguridad</Typography>
          </Breadcrumbs>
          
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={2.5} alignItems="center">
              <Avatar sx={{ bgcolor: "#F55345", width: 56, height: 56, boxShadow: "0 10px 20px rgba(245, 83, 69, 0.3)" }}>
                <History fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 950, color: "#0f172a", letterSpacing: "-1.5px" }}>
                  Auditoría
                </Typography>
                <Typography variant="body1" sx={{ color: "#64748b", fontWeight: 500 }}>
                  Monitoreo de integridad y cambios en el sistema
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Box>

        <TextField
          fullWidth
          placeholder="Filtrar eventos por acción, tabla o responsable..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          sx={{ ...styles.searchField, mb: 4 }}
          InputProps={{ 
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: "#F55345", ml: 1 }} />
              </InputAdornment>
            )
          }}
        />

        <Box sx={{ height: 6, mb: 1 }}>
          {loading && <LinearProgress sx={{ borderRadius: 3, bgcolor: "#e2e8f0", "& .MuiLinearProgress-bar": { bgcolor: "#F55345" } }} />}
        </Box>

        <Fade in={!loading}>
          <TableContainer component={Paper} sx={styles.tablePaper}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={styles.headerCell}>Timestamp</TableCell>
                  <TableCell sx={styles.headerCell}>Operación</TableCell>
                  <TableCell sx={styles.headerCell}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Storage sx={{ fontSize: 16 }} />
                      <span>Entidad</span>
                    </Stack>
                  </TableCell>
                  <TableCell sx={styles.headerCell}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Person sx={{ fontSize: 16 }} />
                      <span>Responsable</span>
                    </Stack>
                  </TableCell>
                  <TableCell sx={styles.headerCell}>Detalles de Acción</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logsFiltrados.length === 0 && !loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 12 }}>
                      <Description sx={{ fontSize: 48, color: "#e2e8f0", mb: 2 }} />
                      <Typography variant="h6" color="text.secondary">No se encontraron rastros</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  logsFiltrados.map((log) => {
                    const theme = getActionTheme(log.action);
                    return (
                      <TableRow key={log._id} sx={styles.rowStyle}>
                        <TableCell sx={{ color: "#94a3b8", fontSize: "0.8rem", fontWeight: 600 }}>
                          {new Date(log.createdAt).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={log.action} 
                            size="small" 
                            sx={{ 
                              fontWeight: 800,
                              fontSize: "0.65rem",
                              bgcolor: theme.bg,
                              color: theme.text,
                              border: `1px solid ${theme.border}`,
                              borderRadius: "6px"
                            }} 
                          />
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, color: "#334155" }}>
                          {log.entity}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 800, color: "#64748b" }}>
                            {log.userId || "SYSTEM_DAEMON"}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ color: "#475569", fontSize: "0.85rem", maxWidth: 400 }}>
                          <Tooltip title={log.description || ""} arrow>
                            <Typography variant="body2" noWrap sx={{ fontWeight: 500 }}>
                              {log.description}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Fade>
      </Container>
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
    </Box>
  );
}