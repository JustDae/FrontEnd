import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  useTheme,
  useMediaQuery,
  alpha,
  Tooltip,
} from "@mui/material";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, type JSX } from "react";
import { useAuth } from "../context/AuthContext";

import MenuIcon from "@mui/icons-material/Menu";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import FastfoodRoundedIcon from "@mui/icons-material/FastfoodRounded";
import ListAltRoundedIcon from "@mui/icons-material/ListAltRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import StoreRoundedIcon from "@mui/icons-material/StoreRounded";
import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";

const DRAWER_WIDTH = 280;
const BRAND_COLOR = "#F55345";

type NavItem = {
  label: string;
  to: string;
  icon: JSX.Element;
  roles?: string[];
};

const navItems: NavItem[] = [
  { label: "Panel Principal", to: "/dashboard", icon: <DashboardRoundedIcon /> },
  { label: "Categorías", to: "/dashboard/categories", icon: <CategoryRoundedIcon />, roles: ["ADMIN"] },
  { label: "Catálogo de Productos", to: "/dashboard/productos", icon: <FastfoodRoundedIcon /> },
  { label: "Gestión de Pedidos", to: "/dashboard/pedidos", icon: <ListAltRoundedIcon /> },
  { label: "Auditoría de Sistema", to: "/dashboard/audit-logs", icon: <HistoryRoundedIcon /> },
  { label: "Usuarios", to: "/dashboard/users", icon: <GroupRoundedIcon />, roles: ["ADMIN"] },
  { label: "Roles y Permisos", to: "/dashboard/roles", icon: <SecurityRoundedIcon />, roles: ["ADMIN"] },
  { label: "Mi Restaurante", to: "/dashboard/restaurante", icon: <StoreRoundedIcon />, roles: ["ADMIN"] },
  { label: "Promociones", to: "/dashboard/promociones", icon: <LocalOfferRoundedIcon />, roles: ["ADMIN"] },
  { label: "Facturación", to: "/dashboard/facturas", icon: <ReceiptLongRoundedIcon />, roles: ["ADMIN"] },
];

export default function PrivateLayout(): JSX.Element {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  const role = (user as any)?.rol?.nombre?.toUpperCase() || "USER";
  const visibleItems = navItems.filter((i) => !i.roles || i.roles.includes(role));

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const onLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const drawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", bgcolor: "white" }}>
      <Box sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar sx={{ bgcolor: BRAND_COLOR, width: 40, height: 40 }}>
          <FastfoodRoundedIcon />
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 800, color: "#1a1a1a", letterSpacing: "-0.5px" }}>
          Mix<Box component="span" sx={{ color: BRAND_COLOR }}>Bowls</Box>
        </Typography>
      </Box>

      <List sx={{ px: 2, flexGrow: 1 }}>
        <Typography variant="caption" sx={{ px: 2, mb: 1, display: "block", color: "text.secondary", fontWeight: 700, textTransform: "uppercase" }}>
          Menú de Gestión
        </Typography>
        {visibleItems.map((item) => {
          const active = location.pathname === item.to;
          return (
            <ListItemButton
              key={item.to}
              onClick={() => {
                navigate(item.to);
                if (isMobile) setMobileOpen(false);
              }}
              sx={{
                borderRadius: "12px",
                mb: 0.5,
                transition: "all 0.2s",
                bgcolor: active ? alpha(BRAND_COLOR, 0.08) : "transparent",
                color: active ? BRAND_COLOR : "text.secondary",
                "&:hover": { bgcolor: alpha(BRAND_COLOR, 0.04), color: BRAND_COLOR },
                "& .MuiListItemIcon-root": { color: active ? BRAND_COLOR : "text.secondary", minWidth: 40 },
                "& .MuiListItemText-primary": { fontWeight: active ? 700 : 500, fontSize: "0.9rem" },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>

      <Box sx={{ p: 2, m: 2, bgcolor: "#f8f9fa", borderRadius: "16px" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
          <Avatar sx={{ width: 40, height: 40, bgcolor: alpha(BRAND_COLOR, 0.2), color: BRAND_COLOR, fontWeight: 700 }}>
            {user?.username?.[0]?.toUpperCase() || "U"}
          </Avatar>
          <Box sx={{ overflow: "hidden" }}>
            <Typography variant="subtitle2" noWrap sx={{ fontWeight: 700 }}>
              {user?.username || "Usuario"}
            </Typography>
            <Typography variant="caption" sx={{ color: BRAND_COLOR, fontWeight: 600 }}>
              {role}
            </Typography>
          </Box>
        </Box>
        <Button
          fullWidth
          variant="contained"
          onClick={onLogout}
          startIcon={<LogoutRoundedIcon />}
          sx={{
            bgcolor: "white",
            color: "#d32f2f",
            boxShadow: "none",
            border: "1px solid #eee",
            "&:hover": { bgcolor: "#fff1f1", borderColor: "#ffcdd2", boxShadow: "none" },
            textTransform: "none",
            fontWeight: 700,
            borderRadius: "10px"
          }}
        >
          Cerrar Sesión
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f4f6f8" }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { lg: `${DRAWER_WIDTH}px` },
          bgcolor: alpha("#fff", 0.8),
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid",
          borderColor: "divider",
          color: "text.primary",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { lg: "none" }, color: BRAND_COLOR }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#1a1a1a" }}>
              Panel de Control
            </Typography>
          </Box>

          <Tooltip title="Ver sitio público">
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate("/")}
              startIcon={<LanguageRoundedIcon />}
              sx={{
                borderRadius: "20px",
                textTransform: "none",
                fontWeight: 700,
                color: BRAND_COLOR,
                borderColor: BRAND_COLOR,
                "&:hover": { borderColor: BRAND_COLOR, bgcolor: alpha(BRAND_COLOR, 0.05) }
              }}
            >
              Sitio Público
            </Button>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { lg: DRAWER_WIDTH }, flexShrink: { lg: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", lg: "none" },
            "& .MuiDrawer-paper": { width: DRAWER_WIDTH, border: "none" },
          }}
        >
          {drawerContent}
        </Drawer>
        
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", lg: "block" },
            "& .MuiDrawer-paper": { 
              width: DRAWER_WIDTH, 
              borderRight: "1px solid", 
              borderColor: "divider" 
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: "64px",
        }}
      >
        <Box sx={{ 
          maxWidth: "1600px", 
          mx: "auto",
          animation: "fadeIn 0.5s ease-in-out",
          "@keyframes fadeIn": { from: { opacity: 0, transform: "translateY(10px)" }, to: { opacity: 1, transform: "translateY(0)" } }
        }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}