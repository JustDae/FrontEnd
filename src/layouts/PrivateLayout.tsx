import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, type JSX } from "react";
import { useAuth } from "../context/AuthContext";

// Iconos corregidos para mayor variedad
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CategoryIcon from "@mui/icons-material/Category";
import ArticleIcon from "@mui/icons-material/Article";
import GroupIcon from "@mui/icons-material/Group";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import ListAltIcon from "@mui/icons-material/ListAlt";
import HistoryIcon from "@mui/icons-material/History";
import NotificationsIcon from "@mui/icons-material/Notifications";
import StarIcon from "@mui/icons-material/Star";
import PaymentsIcon from "@mui/icons-material/Payments";
import TableBarIcon from "@mui/icons-material/TableBar";

const drawerWidth = 260;

interface RoleData {
  id: number;
  nombre: string;
}

interface UserWithRole {
  username?: string;
  email?: string;
  rol?: RoleData;
}

type NavItem = {
  label: string;
  to: string;
  icon: JSX.Element;
  roles?: string[];
};

const navItems: NavItem[] = [
  { label: "Inicio", to: "/dashboard", icon: <DashboardIcon /> },
  { label: "Categorías", to: "/dashboard/categories", icon: <CategoryIcon /> },
  { label: "Productos", to: "/dashboard/productos", icon: <FastfoodIcon /> },
  { label: "Pedidos", to: "/dashboard/pedidos", icon: <ListAltIcon /> },
  { label: "Detalle Pedido", to: "/dashboard/detalle-pedido", icon: <ReceiptLongIcon /> },
  { label: "Auditoría", to: "/dashboard/audit-logs", icon: <HistoryIcon /> },
  { label: "Posts", to: "/dashboard/posts", icon: <ArticleIcon /> },
  { label: "Users", to: "/dashboard/users", icon: <GroupIcon />, roles: ["ADMIN"] },
  { label: "Reseñas", to: "/dashboard/resenas", icon: <StarIcon /> },
  { label: "Notificaciones", to: "/dashboard/notificaciones", icon: <NotificationsIcon /> },
  { label: "Metodo Pago", to: "/dashboard/metodo-pago", icon: <PaymentsIcon /> },
  { label: "Mesa", to: "/dashboard/mesa", icon: <TableBarIcon /> }
];

export default function PrivateLayout(): JSX.Element {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Lógica de usuario y roles
  const typedUser = user as UserWithRole;
  const roleName = typedUser?.rol?.nombre || "GUEST";
  const role = roleName.toUpperCase();

  // Filtrado de items según el rol
  const visibleItems = navItems.filter((i) =>
    !i.roles || i.roles.some((r) => r.toUpperCase() === role)
  );

  const onGo = (to: string) => {
    navigate(to);
    setOpen(false);
  };

  const onLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const drawer = (
    <Box sx={{ width: drawerWidth, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ px: 3, py: 3, bgcolor: "#fcfcfc" }}>
        <Typography variant="h6" sx={{ color: "#F55345", fontWeight: "bold", lineHeight: 1.2 }}>
          Restaurante Admin
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary", overflow: "hidden", textOverflow: "ellipsis" }}>
            {typedUser?.username || "Usuario"}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
            {typedUser?.email}
          </Typography>
          <Typography 
            variant="caption" 
            sx={{ 
              mt: 0.5, 
              display: "inline-block", 
              bgcolor: "rgba(245, 83, 69, 0.1)", 
              color: "#F55345", 
              px: 1, 
              borderRadius: 1,
              fontWeight: "bold"
            }}
          >
            {role}
          </Typography>
        </Box>
      </Box>

      <Divider />

      <List sx={{ flexGrow: 1, px: 1, py: 2 }}>
        {visibleItems.map((item) => {
          const isSelected = location.pathname === item.to;
          return (
            <ListItemButton 
              key={item.to} 
              selected={isSelected} 
              onClick={() => onGo(item.to)}
              sx={{
                borderRadius: "8px",
                mb: 0.5,
                "&.Mui-selected": {
                  bgcolor: "rgba(245, 83, 69, 0.08)",
                  "& .MuiListItemIcon-root": { color: "#F55345" },
                  "& .MuiListItemText-primary": { color: "#F55345", fontWeight: "bold" },
                  "&:hover": { bgcolor: "rgba(245, 83, 69, 0.12)" }
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: isSelected ? "#F55345" : "text.secondary" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label} 
                primaryTypographyProps={{ variant: "body2", fontWeight: isSelected ? 600 : 500 }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Divider />
      
      <Box sx={{ p: 2 }}>
        <Button 
          fullWidth 
          variant="contained" 
          onClick={onLogout}
          disableElevation
          sx={{ 
            bgcolor: "#F55345",
            "&:hover": { bgcolor: "#d44538" },
            textTransform: "none",
            fontWeight: "bold"
          }}
        >
          Cerrar Sesión
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: "100vh", bgcolor: "#f4f6f8" }}>
      <AppBar position="fixed" sx={{ bgcolor: "#F55345", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={() => setOpen(true)} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            Dashboard
          </Typography>
          <Button color="inherit" onClick={() => navigate("/")} sx={{ textTransform: "none" }}>
            Sitio Público
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer 
        anchor="left" 
        open={open} 
        onClose={() => setOpen(false)}
        PaperProps={{ sx: { border: "none", boxShadow: 3 } }}
      >
        {drawer}
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, width: "100%" }}>
        <Toolbar /> {/* Espaciador para que el contenido no quede bajo el AppBar */}
        <Outlet />
      </Box>
    </Box>
  );
}