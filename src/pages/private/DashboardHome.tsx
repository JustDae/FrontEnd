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
    bgcolor: "#f1f5f9",
    display: "flex",
    flexDirection: "column"
  },
  container: { 
    py: { xs: 4, md: 8 }, 
    px: { xs: 2, sm: 4, md: 8 },
    width: "100% !important",
    flexGrow: 1
  },
  gradientText: {
    background: "linear-gradient(45deg, #0f172a 30%, #334155 90%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: 950,
    letterSpacing: "-0.04em",
    fontSize: { xs: "2.5rem", md: "4rem", xl: "5rem" },
    lineHeight: 1.1
  },
  glassCard: {
    p: { xs: 3, md: 6 },
    borderRadius: "40px",
    display: "flex",
    flexDirection: { xs: "column", xl: "row" },
    alignItems: "center",
    justifyContent: "center",
    gap: { xs: 2, md: 4 },
    background: "rgba(255, 255, 255, 0.75)",
    backdropFilter: "blur(20px) saturate(160%)",
    border: "1px solid rgba(255, 255, 255, 0.5)",
    boxShadow: `
      0 30px 60px rgba(0, 0, 0, 0.06),
      inset 0 0 0 1px rgba(255,255,255,0.4)
    `,
    transition: "all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)",
    height: "100%",
    width: "100%",
    "&:hover": {
      transform: "scale(1.02) translateY(-10px)",
      boxShadow: "0 50px 80px rgba(0, 0, 0, 0.12)",
      "& .card-avatar": {
        transform: "scale(1.15) rotate(8deg)",
        filter: "brightness(1.1)"
      }
    }
  },
  avatarBase: {
    width: { xs: 80, md: 100, xl: 120 },
    height: { xs: 80, md: 100, xl: 120 },
    borderRadius: "28px",
    transition: "all 0.5s ease",
    "& .MuiSvgIcon-root": { 
      fontSize: { xs: "2.5rem", md: "3.5rem" }, 
      filter: "drop-shadow(0 8px 12px rgba(0,0,0,0.15))" 
    }
  },
  statusBoxDark: {
    mt: { xs: 6, md: 10 },
    p: { xs: 4, md: 6 },
    borderRadius: "48px",
    background: "linear-gradient(145deg, #0f172a 0%, #1e293b 100%)",
    color: "#f8fafc",
    display: "flex",
    flexDirection: { xs: "column", md: "row" },
    alignItems: "center",
    gap: { xs: 4, md: 6 },
    boxShadow: "0 40px 100px -20px rgba(0, 0, 0, 0.6)",
    position: "relative",
    overflow: "hidden",
    "&::before": {
        content: '""',
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: "4px",
        background: "linear-gradient(90deg, transparent, #F55345, #ff8a65, transparent)",
        boxShadow: "0 0 25px #F55345"
    }
  }
};

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

        const total = pedidosRes.items.reduce((acc: number, p: any) => acc + Number(p.total), 0);
        
        setStats({
          totalVentas: total,
          pedidosActivos: pedidosRes.items.length,
          platosServidos: detallesRes.items.length
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const cards = useMemo(() => [
    { 
      title: "Ventas Netas", 
      value: `$${stats.totalVentas.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, 
      icon: <AttachMoneyIcon />, 
      color: "#10b981",
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      shadow: "rgba(16, 185, 129, 0.4)"
    },
    { 
      title: "Órdenes de Hoy", 
      value: stats.pedidosActivos, 
      icon: <ReceiptIcon />, 
      color: "#F55345",
      gradient: "linear-gradient(135deg, #F55345 0%, #dc2626 100%)",
      shadow: "rgba(245, 83, 69, 0.4)"
    },
    { 
      title: "Items Despachados", 
      value: stats.platosServidos, 
      icon: <RestaurantMenuIcon />, 
      color: "#3b82f6",
      gradient: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
      shadow: "rgba(59, 130, 246, 0.4)"
    },
  ], [stats]);

  return (
    <Box sx={styles.mainWrapper}>
      <Container maxWidth={false} disableGutters sx={styles.container}>
        <Box sx={{ mb: { xs: 6, md: 10 }, textAlign: { xs: "center", md: "left" } }}>
          <Typography variant="h2" sx={styles.gradientText}>
            Dashboard Maestro
          </Typography>
          <Typography variant="h6" sx={{ color: "#64748b", mt: 2, fontWeight: 500, opacity: 0.8, fontSize: { xs: "1.1rem", md: "1.5rem" } }}>
            Control total de operaciones y rendimiento financiero.
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 3, md: 5 }}>
          {loading ? (
            [1, 2, 3].map((i) => (
              <Grid key={i} size={{ xs: 12, sm: 6, lg: 4 }}>
                <Skeleton variant="rounded" height={220} sx={{ borderRadius: "40px", bgcolor: "white" }} />
              </Grid>
            ))
          ) : (
            cards.map((card, index) => (
              <Grid key={index} size={{ xs: 12, sm: 6, lg: 4 }}>
                <Fade in={!loading} timeout={400 + index * 200}>
                  <Paper elevation={0} sx={{ ...styles.glassCard, color: card.color }}>
                    <Avatar 
                      className="card-avatar"
                      sx={{ 
                        ...styles.avatarBase,
                        background: card.gradient,
                        color: "white",
                        boxShadow: `0 20px 40px ${card.shadow}`
                      }}
                    >
                      {card.icon}
                    </Avatar>
                    <Box sx={{ zIndex: 2, textAlign: { xs: "center", xl: "left" } }}>
                      <Typography variant="overline" sx={{ color: "#94a3b8", fontWeight: 800, letterSpacing: "3px", display: "block", mb: 1 }}>
                        {card.title}
                      </Typography>
                      <Typography variant="h1" sx={{ fontWeight: 950, color: "#1e293b", letterSpacing: "-3px", lineHeight: 0.9, fontSize: { xs: "2.5rem", md: "3.5rem", xl: "4.5rem" } }}>
                        {card.value}
                      </Typography>
                    </Box>
                  </Paper>
                </Fade>
              </Grid>
            ))
          )}
        </Grid>

        <Fade in={!loading} timeout={1200}>
          <Box sx={styles.statusBoxDark}>
            <Avatar sx={{ background: "linear-gradient(135deg, #F55345 0%, #ff8a65 100%)", color: "white", width: { xs: 70, md: 90 }, height: { xs: 70, md: 90 }, boxShadow: "0 0 50px rgba(245, 83, 69, 0.5)" }}>
              <DnsIcon sx={{ fontSize: "3rem" }} />
            </Avatar>
            
            <Box sx={{ flex: 1, textAlign: { xs: "center", md: "left" } }}>
              <Stack direction="row" alignItems="center" justifyContent={{ xs: "center", md: "flex-start" }} spacing={2} sx={{ mb: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 900, color: "white", letterSpacing: "0.5px" }}>
                  Infraestructura
                </Typography>
                <Box sx={{ position: 'relative', width: 16, height: 16 }}>
                  <Box sx={{ width: 16, height: 16, bgcolor: "#10b981", borderRadius: "50%", position: 'absolute' }} />
                  <Box sx={{ 
                    width: 16, height: 16, bgcolor: "#10b981", borderRadius: "50%", position: 'absolute',
                    animation: 'pulse 2s infinite',
                    '@keyframes pulse': {
                      '0%': { transform: 'scale(1)', opacity: 0.8 },
                      '70%': { transform: 'scale(3)', opacity: 0 },
                      '100%': { transform: 'scale(1)', opacity: 0 }
                    }
                  }} />
                </Box>
                <Typography variant="button" sx={{ color: "#10b981", fontWeight: 900, letterSpacing: "2px" }}>ESTABLE</Typography>
              </Stack>
              <Typography variant="h6" sx={{ opacity: 0.7, fontFamily: 'monospace', color: "#94a3b8" }}>
                API: v10.0.2 • Latencia Media: <span style={{ color: "white" }}>24ms</span> • DB: PostgreSQL Cluster
              </Typography>
            </Box>
            
            <Divider orientation="vertical" flexItem sx={{ bgcolor: "rgba(255,255,255,0.1)", mx: 3, display: { xs: "none", md: "block" } }} />
            
            <Box sx={{ textAlign: { xs: "center", md: "right" } }}>
              <Stack alignItems={{ xs: "center", md: "flex-end" }} spacing={1}>
                <Tooltip title="Rendimiento del servidor en tiempo real">
                  <Stack direction="row" alignItems="center" spacing={1.5} sx={{ color: "#F55345" }}>
                    <SpeedIcon sx={{ fontSize: "2rem" }} />
                    <Typography variant="h6" sx={{ fontWeight: 950, letterSpacing: "2px" }}>ENGINE</Typography>
                  </Stack>
                </Tooltip>
                <Typography variant="h3" sx={{ color: "white", fontWeight: 900, textShadow: "0 0 30px rgba(245, 83, 69, 0.6)" }}>
                  24ms
                </Typography>
              </Stack>
            </Box>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
}