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

import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CategoryIcon from "@mui/icons-material/Category";
import ArticleIcon from "@mui/icons-material/Article";
import GroupIcon from "@mui/icons-material/Group";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import FastfoodIcon from "@mui/icons-material/Fastfood"; 

const drawerWidth = 260;

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
  { label: "Posts", to: "/dashboard/posts", icon: <ArticleIcon /> },
  { label: "Detalle Pedido", to: "/dashboard/detalle-pedido", icon: <ReceiptLongIcon /> },
  { label: "Users", to: "/dashboard/users", icon: <GroupIcon />, roles: ["ADMIN"] },
];

export default function PrivateLayout(): JSX.Element {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const role = (user?.role || "USER").toUpperCase();
  const visibleItems = navItems.filter((i) => !i.roles || i.roles.map((x) => x.toUpperCase()).includes(role));

  const onGo = (to: string) => {
    navigate(to);
    setOpen(false);
  };

  const onLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const drawer = (
    <Box sx={{ width: drawerWidth }} role="presentation">
      <Box sx={{ px: 2, py: 2 }}>
        <Typography variant="h6" sx={{ color: "#F55345", fontWeight: "bold" }}>
          Restaurante Admin
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {user?.email || user?.username}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Rol: {role}
        </Typography>
      </Box>

      <Divider />

      <List>
        {visibleItems.map((item) => {
          const selected = location.pathname === item.to;
          return (
            <ListItemButton 
              key={item.to} 
              selected={selected} 
              onClick={() => onGo(item.to)}
              sx={{
                "&.Mui-selected": {
                  borderRight: "4px solid #F55345",
                  bgcolor: "rgba(245, 83, 69, 0.08)",
                  "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
                    color: "#F55345",
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: selected ? "#F55345" : "inherit" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>

      <Box sx={{ px: 2, py: 2, mt: "auto" }}>
        <Button 
          fullWidth 
          variant="outlined" 
          onClick={onLogout}
          sx={{ 
            color: "#F55345", 
            borderColor: "#F55345",
            "&:hover": { borderColor: "#d44538", bgcolor: "rgba(245, 83, 69, 0.04)" }
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f9f9f9", color: "text.primary" }}>
      <AppBar position="fixed" sx={{ bgcolor: "#F55345", elevation: 0 }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={() => setOpen(true)} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            Dashboard
          </Typography>

          <Button color="inherit" onClick={() => navigate("/")} sx={{ fontWeight: "bold" }}>
            Ir a público
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        {drawer}
      </Drawer>

      <Toolbar />

      <Box sx={{ p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
}