import { AppBar, Toolbar, Typography, Box, Button, Container, IconButton } from "@mui/material";
import type { JSX } from "react";
import { Link as RouterLink } from "react-router-dom";

import RestaurantIcon from '@mui/icons-material/Restaurant';
import DashboardIcon from '@mui/icons-material/Dashboard';

export function PublicHeader(): JSX.Element {
  
  const brandColor = '#F55345';

  return (
    <AppBar
      position="fixed"
      elevation={0} 
      sx={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
        backdropFilter: 'blur(10px)', 
        borderBottom: '1px solid #f0f0f0',
        color: '#333'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ height: 70, px: { xs: 1, md: 0 } }}>
          
          <Box 
            component={RouterLink} 
            to="/"
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              textDecoration: 'none', 
              color: 'inherit',
              flexGrow: 1 
            }}
          >
            <RestaurantIcon sx={{ color: brandColor, fontSize: 28, mr: 1.5 }} />
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700, 
                fontSize: '1.3rem',
                letterSpacing: '-0.3px' 
              }}
            >
              Restaurante
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            
            <Button 
              component={RouterLink} 
              to="/" 
              sx={{ 
                textTransform: 'none', 
                color: '#444',
                fontWeight: 500,
                fontSize: '0.95rem',
                px: 2,
                '&:hover': { color: brandColor, backgroundColor: 'transparent' } 
              }}
            >
              Inicio
            </Button>

            <Button 
              component={RouterLink} 
              to="/contacto" 
              sx={{ 
                textTransform: 'none', 
                color: '#444',
                fontWeight: 500,
                fontSize: '0.95rem',
                px: 2,
                display: { xs: 'none', sm: 'block' },
                '&:hover': { color: brandColor, backgroundColor: 'transparent' }
              }}
            >
              Contacto
            </Button>

            <IconButton 
              component={RouterLink} 
              to="/dashboard/posts"
              sx={{ 
                color: '#666', 
                ml: 1,
                '&:hover': { color: brandColor }
              }}
            >
              <DashboardIcon fontSize="small" />
            </IconButton>

            <Button 
              variant="contained" 
              sx={{ 
                ml: 2,
                bgcolor: brandColor,
                borderRadius: '6px', 
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                boxShadow: 'none', 
                '&:hover': {
                  bgcolor: '#d44336',
                  boxShadow: '0 4px 12px rgba(245, 83, 69, 0.2)',
                }
              }}
            >
              Reservar Mesa
            </Button>

          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}