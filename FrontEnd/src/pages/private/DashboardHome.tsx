import { useEffect, useState, type JSX } from "react";
import { Box, Grid, Paper, Typography, Stack, CircularProgress } from "@mui/material";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import { getPedidos } from "../../services/pedidos.service";
import { getDetallePedidos } from "../../services/detalle-pedido.service";

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
    </Box>
  );
}