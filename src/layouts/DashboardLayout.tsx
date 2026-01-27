import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  ListItemButton,
} from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import { useState, type JSX } from "react";

interface MenuItemType {
  text: string;
  path: string;
}

const menuItems: MenuItemType[] = [
  { text: "Inicio", path: "/dashboard" },
  { text: "Productos", path: "/dashboard/productos" },
  { text: "Categorías", path: "/dashboard/categories" },
  { text: "Detalle Pedido", path: "/dashboard/detalle-pedido" },
  { text: "Usuarios", path: "/dashboard/users" },
  { text: "Roles", path: "/dashboard/roles" },
  { text: "Restaurante", path: "/dashboard/restaurante"},
  { text: "Posts", path: "/dashboard/posts" },
  { text: "Promociones", path: "/dashboard/promociones" },
];

export default function DashboardLayout(): JSX.Element {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleUserClick = (e: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const handleLogout = (): void => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <Box display="flex">
      <Drawer
        variant="permanent"
        sx={{ width: 220, [`& .MuiDrawer-paper`]: { width: 220, borderRight: "1px solid #eee" } }}
      >
        <Toolbar>
           <Typography variant="h6" sx={{ fontWeight: "bold", color: "#F55345" }}>
            Panel
          </Typography>
        </Toolbar>
        <List>
          {menuItems.map((item) => (
            <ListItem disablePadding key={item.text}>
              <ListItemButton 
                onClick={() => navigate(item.path)}
                sx={{
                  "&:hover": { bgcolor: "rgba(245, 83, 69, 0.08)" }
                }}
              >
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box flexGrow={1}>
        <AppBar position="static" sx={{ bgcolor: "#F55345", elevation: 0 }}>
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Restaurante Admin
            </Typography>

            <Box
              display="flex"
              alignItems="center"
              gap={1}
              onClick={handleUserClick}
              sx={{ cursor: "pointer" }}
            >
              <Box sx={{ textAlign: "right", mr: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>Dae</Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>Rol: Admin</Typography>
              </Box>
              <Avatar sx={{ bgcolor: "white", color: "#F55345" }}>D</Avatar>
            </Box>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleLogout}>Salir</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        <Box p={3} sx={{ bgcolor: "#f9f9f9", minHeight: "calc(100vh - 64px)" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}