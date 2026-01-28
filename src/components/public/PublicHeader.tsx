import { 
  AppBar, Box, Button, Toolbar, Typography, Container, alpha, styled, Stack, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, type ButtonProps 
} from "@mui/material";
import { useState } from "react";
import type { JSX } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';

interface NavButtonProps extends ButtonProps {
  active?: boolean;
  to?: string;
  component?: any;
}

interface ActionButtonProps extends ButtonProps {
  to?: string;
  component?: any;
}

const StyledAppBar = styled(AppBar)(() => ({
  backgroundColor: alpha("#fff", 0.8),
  backdropFilter: "blur(12px)",
  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.05)",
  borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
  color: "#1a1a1b",
}));

const NavButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'active',
})<NavButtonProps>(({ active }) => ({
  borderRadius: 20,
  padding: "6px 16px",
  textTransform: "none",
  fontWeight: 600,
  fontSize: "0.9rem",
  transition: "all 0.3s ease",
  color: active ? "#ff6d4d" : "#555",
  backgroundColor: active ? alpha("#ff6d4d", 0.08) : "transparent",
  "&:hover": {
    backgroundColor: alpha("#ff6d4d", 0.1),
    color: "#ff6d4d",
  },
}));

const ActionButton = styled(Button)<ActionButtonProps>({
  borderRadius: 80,
  padding: "8px 24px",
  textTransform: "none",
  fontWeight: 700,
  backgroundColor: "#1a1a1b",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#333",
    transform: "translateY(-1px)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  },
  transition: "all 0.2s ease",
});

export default function PublicHeader(): JSX.Element {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: 'Inicio', path: '/#home' },
    { label: 'Menú', path: '/#menu' },
    { label: 'Nosotros', path: '/about' },
  ];

  const handleNavClick = (e: React.MouseEvent, path: string) => {
    if (path.includes('#')) {
      const id = path.split('#')[1];
      if (location.pathname === '/') {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
      setMobileOpen(false);
    }
  };

  return (
    <StyledAppBar position="fixed" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: "space-between", px: { xs: 0 } }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setMobileOpen(true)}
              sx={{ mr: 1, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>

            <Box 
              component={RouterLink} 
              to="/" 
              sx={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 1.5, 
                textDecoration: "none", 
                color: "inherit" 
              }}
            >
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 10,
                  background: "linear-gradient(135deg, #ff6d4d 0%, #ff8e73 100%)",
                }}
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/1996/1996055.png"
                  alt="logo"
                  width="22"
                  height="22"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: -0.5 }}>
                MixBowls
              </Typography>
            </Box>
          </Stack>

          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
            {navItems.map((item) => (
              <NavButton 
                key={item.path}
                component={RouterLink} 
                to={item.path}
                active={location.pathname === '/' && (location.hash === '' || item.path.includes(location.hash))}
                onClick={(e) => handleNavClick(e, item.path)}
              >
                {item.label}
              </NavButton>
            ))}
          </Box>

          <Stack direction="row" spacing={1.5} alignItems="center">
            <NavButton 
              component={RouterLink} 
              to="/auth/login"
              active={location.pathname === "/auth/login"}
              sx={{ display: { xs: "none", sm: "inline-flex" } }}
            >
              Login
            </NavButton>
            <ActionButton 
              variant="contained" 
              component={RouterLink} 
              to="/auth/register"
              disableElevation
            >
              Registro
            </ActionButton>
          </Stack>
        </Toolbar>
      </Container>

      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{ sx: { width: 280, borderRadius: '0 24px 24px 0' } }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 900, mb: 4, px: 2 }}>MixBowls</Typography>
          <List>
            {navItems.map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton 
                  component={RouterLink} 
                  to={item.path}
                  onClick={(e) => handleNavClick(e, item.path)}
                  selected={location.pathname === '/' && (location.hash === '' || item.path.includes(location.hash))}
                  sx={{ 
                    borderRadius: 3, 
                    mb: 1,
                    '&.Mui-selected': { bgcolor: alpha("#ff6d4d", 0.1), color: "#ff6d4d" }
                  }}
                >
                  <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 600 }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </StyledAppBar>
  );
}