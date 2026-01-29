<<<<<<< HEAD
import { useEffect, useState, type JSX } from "react";
import { Box, Grid, Paper, Typography, Stack, CircularProgress } from "@mui/material";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import { getPedidos } from "../../services/pedidos.service";
import { getDetallePedidos } from "../../services/detalle-pedido.service";

=======
import { useEffect, useState, useMemo, type JSX } from "react";
import { 
  Box, Grid as Grid, Paper, Typography, Stack, 
  Avatar, Container, Skeleton, Fade, Divider, Tooltip 
} from "@mui/material";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import DnsIcon from '@mui/icons-material/Dns';
import SpeedIcon from '@mui/icons-material/Speed';
import { getPedidos } from "../../services/pedidos.service";
import { getDetallePedidos } from "../../services/detalle-pedido.service";

const styles = {
  mainWrapper: {
    width: "100%",
    minHeight: "100vh",
    bgcolor: "#f8fafc",
    display: "flex",
    flexDirection: "column"
  },
  container: { 
    py: { xs: 3, md: 5 }, 
    px: { xs: 2, md: 4 },
    width: "100% !important",
    flexGrow: 1
  },
  gradientText: {
    background: "linear-gradient(45deg, #0f172a 30%, #334155 90%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: 800,
    letterSpacing: "-0.02em",
    fontSize: { xs: "1.75rem", md: "2.5rem" },
    lineHeight: 1.2
  },
  glassCard: {
    p: 3,
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    gap: 2,
    background: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
    transition: "all 0.3s ease",
    height: "100%",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 12px 30px rgba(0, 0, 0, 0.08)",
    }
  },
  avatarBase: {
    width: 56,
    height: 56,
    borderRadius: "12px",
    "& .MuiSvgIcon-root": { 
      fontSize: "1.75rem"
    }
  },
  statusBoxDark: {
    mt: 4,
    p: 3,
    borderRadius: "24px",
    background: "#1e293b",
    color: "#f8fafc",
    display: "flex",
    flexDirection: { xs: "column", md: "row" },
    alignItems: "center",
    gap: 3,
    position: "relative",
    overflow: "hidden",
    "&::before": {
        content: '""',
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: "3px",
        background: "#F55345"
    }
  }
};

>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
export default function DashboardHome(): JSX.Element {
  const [stats, setStats] = useState({ totalVentas: 0, pedidosActivos: 0, platosServidos: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [pedidosRes, detallesRes] = await Promise.all([
          getPedidos({ limit: 100 }),
          getDetallePedidos({ limit: 100 })
        ]);

<<<<<<< HEAD
        const total = pedidosRes.items.reduce((acc: number, p: any) => acc + Number(p.total), 0);
        
        setStats({
          totalVentas: total,
          pedidosActivos: pedidosRes.items.length,
          platosServidos: detallesRes.items.length
        });
=======
        const total = pedidosRes.items?.reduce((acc: number, p: any) => acc + Number(p.total), 0) || 0;
        
        setStats({
          totalVentas: total,
          pedidosActivos: pedidosRes.items?.length || 0,
          platosServidos: detallesRes.items?.length || 0
        });
      } catch (error) {
        console.error(error);
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
      } finally {
        setLoading(false);
      }
    })();
  }, []);

<<<<<<< HEAD
  if (loading) return (
    <Stack alignItems="center" justifyContent="center" sx={{ height: "60vh" }}>
      <CircularProgress sx={{ color: "#F55345" }} />
    </Stack>
  );

  const cards = [
    { 
        title: "Ventas Totales", 
        value: `$${stats.totalVentas.toFixed(2)}`, 
        icon: <AttachMoneyIcon fontSize="large" />, 
        color: "#4caf50" 
    },
    { 
        title: "Pedidos del Día", 
        value: stats.pedidosActivos, 
        icon: <ReceiptIcon fontSize="large" />, 
        color: "#F55345" 
    },
    { 
        title: "Comandas Enviadas", 
        value: stats.platosServidos, 
        icon: <RestaurantMenuIcon fontSize="large" />, 
        color: "#2196f3" 
    },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4 }}>
        Resumen de Operaciones
      </Typography>

      <Grid container spacing={3}>
        {cards.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 4 }}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                display: "flex", 
                alignItems: "center", 
                gap: 2, 
                borderRadius: 2, 
                border: "1px solid #eee",
                borderLeft: `6px solid ${card.color}` 
              }}
            >
              <Box sx={{ color: card.color }}>{card.icon}</Box>
              <Box>
                <Typography variant="body2" color="text.secondary">{card.title}</Typography>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>{card.value}</Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box 
        sx={{ 
          mt: 5, 
          p: 4, 
          bgcolor: "rgba(245, 83, 69, 0.05)", 
          borderRadius: 2, 
          border: "1px dashed #F55345",
          textAlign: "center"
        }}
      >
        <Typography variant="h6" color="#F55345" gutterBottom sx={{ fontWeight: "bold" }}>
          Estado del Servidor
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Conexión activa con NestJS y PostgreSQL. Las comandas se están sincronizando con la base de datos de notificaciones.
        </Typography>
      </Box>
=======
  const cards = useMemo(() => [
    { 
      title: "Ventas Netas", 
      value: `$${stats.totalVentas.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, 
      icon: <AttachMoneyIcon />, 
      color: "#10b981",
      bg: "rgba(16, 185, 129, 0.1)"
    },
    { 
      title: "Órdenes Hoy", 
      value: stats.pedidosActivos, 
      icon: <ReceiptIcon />, 
      color: "#F55345",
      bg: "rgba(245, 83, 69, 0.1)"
    },
    { 
      title: "Items Despachados", 
      value: stats.platosServidos, 
      icon: <RestaurantMenuIcon />, 
      color: "#3b82f6",
      bg: "rgba(59, 130, 246, 0.1)"
    },
  ], [stats]);

  return (
    <Box sx={styles.mainWrapper}>
      <Container maxWidth={false} disableGutters sx={styles.container}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h2" sx={styles.gradientText}>
            Dashboard Maestro
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 500 }}>
            Resumen operativo y financiero del día.
          </Typography>
        </Box>

        <Grid container spacing={2}>
          {loading ? (
            [1, 2, 3].map((i) => (
              <Grid key={i} size={{ xs: 12, sm: 4 }}>
                <Skeleton variant="rounded" height={100} sx={{ borderRadius: "20px" }} />
              </Grid>
            ))
          ) : (
            cards.map((card, index) => (
              <Grid key={index} size={{ xs: 12, sm: 4 }}>
                <Fade in={!loading}>
                  <Paper elevation={0} sx={styles.glassCard}>
                    <Avatar sx={{ ...styles.avatarBase, bgcolor: card.bg, color: card.color }}>
                      {card.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 700, display: "block" }}>
                        {card.title}
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: "#1e293b" }}>
                        {card.value}
                      </Typography>
                    </Box>
                  </Paper>
                </Fade>
              </Grid>
            ))
          )}
        </Grid>

        <Fade in={!loading}>
          <Box sx={styles.statusBoxDark}>
            <Avatar sx={{ bgcolor: "rgba(255,255,255,0.1)", color: "#F55345", width: 48, height: 48 }}>
              <DnsIcon fontSize="small" />
            </Avatar>
            
            <Box sx={{ flex: 1 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "white" }}>
                  Infraestructura
                </Typography>
                <Box sx={{ width: 8, height: 8, bgcolor: "#10b981", borderRadius: "50%" }} />
              </Stack>
              <Typography variant="caption" sx={{ opacity: 0.7, color: "#94a3b8" }}>
                API v10 • Latencia: 24ms • PostgreSQL Cluster
              </Typography>
            </Box>
            
            <Divider orientation="vertical" flexItem sx={{ bgcolor: "rgba(255,255,255,0.1)", mx: 1, display: { xs: "none", md: "block" } }} />
            
            <Box sx={{ textAlign: "right" }}>
              <Tooltip title="Latencia del servidor">
                <Stack direction="row" alignItems="center" spacing={1} sx={{ color: "#F55345" }}>
                  <SpeedIcon sx={{ fontSize: "1rem" }} />
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>24ms</Typography>
                </Stack>
              </Tooltip>
            </Box>
          </Box>
        </Fade>
      </Container>
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
    </Box>
  );
}