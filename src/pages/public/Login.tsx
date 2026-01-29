import {
  Button,
  Stack,
  TextField,
  Typography,
  Box,
  IconButton,
  InputAdornment,
  Alert,
  alpha,
  Fade,
  Grow
} from "@mui/material";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.tsx";
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import type { JSX } from "react";

type LocationState = { from?: string };

const brandColor = '#F55345';

const backgroundImages = [
  "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1920",
  "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1920",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1920",
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1920",
  "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?q=80&w=1920",
  "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1920"
];

export default function Login(): JSX.Element {
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentImg, setCurrentImg] = useState(0);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state || {}) as LocationState;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % backgroundImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleProcess = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (step === 0) {
      if (username.trim() !== "") {
        setStep(1);
      } else {
        setError("Por favor, introduce tu correo.");
      }
    } else {
      try {
        await login({ username, password });
        navigate(state.from || "/dashboard", { replace: true });
      } catch {
        setError("Credenciales incorrectas.");
      }
    }
  };

  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '16px',
      bgcolor: '#f8fafc',
      border: '1px solid #e2e8f0',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': { 
        borderColor: brandColor,
        bgcolor: '#f1f5f9'
      },
      '&.Mui-focused': {
        borderColor: brandColor,
        bgcolor: '#fff',
        boxShadow: `0 0 0 4px ${alpha(brandColor, 0.1)}`,
        '& fieldset': { border: 'none' },
      },
      '& fieldset': { border: 'none' },
    },
    '& .MuiInputBase-input': { 
      py: { xs: 1.5, md: 2 }, 
      px: 2.5,
      fontWeight: 500,
      fontSize: { xs: '0.9rem', md: '1rem' }
    }
  };

  return (
    <Box sx={{ 
      height: "100vh", 
      display: "flex", 
      bgcolor: 'white',
      overflow: 'hidden'
    }}>
      <Box sx={{
        flex: 1,
        display: { xs: 'none', md: 'none', lg: 'block' },
        position: 'relative',
        m: { lg: 2 },
        borderRadius: '24px',
        overflow: 'hidden',
      }}>
        {backgroundImages.map((img, index) => (
          <Fade key={img} in={currentImg === index} timeout={2500}>
            <Box
              component="img"
              src={img}
              alt={`Mood ${index}`}
              sx={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: currentImg === index ? 'block' : 'none',
                animation: currentImg === index ? 'ken-burns 20s infinite alternate' : 'none',
                '@keyframes ken-burns': {
                  '0%': { transform: 'scale(1.1)' },
                  '100%': { transform: 'scale(1.25) translate(-1%, -1%)' }
                }
              }}
            />
          </Fade>
        ))}
        <Box sx={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(225deg, ${alpha('#000', 0.1)} 0%, ${alpha('#000', 0.5)} 100%)`,
        }} />

        <Box sx={{ position: 'absolute', bottom: { lg: 60, xl: 80 }, left: { lg: 60, xl: 80 }, color: 'white', maxWidth: 550, p: 2 }}>
          <Typography variant="h2" sx={{ fontWeight: 900, lineHeight: 1.1, mb: 2, textShadow: '0 4px 20px rgba(0,0,0,0.3)', fontSize: { lg: '3.5rem', xl: '4.5rem' } }}>
            Donde cada ingrediente cuenta.
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400, letterSpacing: 0.5, fontSize: { lg: '1.1rem', xl: '1.3rem' } }}>
            Inicia sesión para gestionar tus pedidos y disfrutar de la mejor gastronomía.
          </Typography>
        </Box>
      </Box>

      <Box sx={{
        flex: { xs: 1, md: 1, lg: '0 0 500px', xl: '0 0 650px' },
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        p: { xs: 3, sm: 6, md: 8, lg: 10 },
        bgcolor: "white",
        position: "relative",
        height: '100%',
        overflowY: 'auto'
      }}>
        <Box sx={{ 
          position: "absolute", 
          top: { xs: 20, md: 40 }, 
          left: { xs: 20, md: 40 }, 
          right: { xs: 20, md: 40 }, 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {step === 1 ? (
            <IconButton
              onClick={() => { setStep(0); setError(null); }}
              sx={{ border: '1px solid #f1f5f9', borderRadius: '12px' }}
            >
              <ArrowBackIcon fontSize="small" />
            </IconButton>
          ) : <Box />}

          <IconButton
            onClick={() => navigate('/')}
            sx={{ border: '1px solid #f1f5f9', borderRadius: '12px' }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Stack spacing={{ xs: 4, md: 5 }} component="form" onSubmit={handleProcess} sx={{ width: '100%', maxWidth: 400 }}>
          <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
            <Typography variant="h3" sx={{ 
              fontWeight: 950, 
              mb: 1.5, 
              letterSpacing: '-2px', 
              color: '#0f172a', 
              fontSize: { xs: '2.3rem', sm: '2.8rem', md: '3.5rem' } 
            }}>
              {step === 0 ? "Bienvenido" : "Acceso"}
            </Typography>
            <Typography variant="body1" sx={{ color: "#64748b", fontWeight: 500, lineHeight: 1.6, fontSize: { xs: '0.95rem', md: '1.05rem' } }}>
              {step === 0 ? "Disfruta de la mejor experiencia culinaria desde tu panel personal." : "Ingresa tu contraseña para confirmar tu reservación."}
            </Typography>
          </Box>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                borderRadius: '16px',
                bgcolor: alpha('#ef4444', 0.05),
                color: '#b91c1c',
                fontWeight: 600,
                border: `1px solid ${alpha('#ef4444', 0.1)}`
              }}
            >
              {error}
            </Alert>
          )}

          <Stack spacing={3}>
            <Grow in={step === 0} unmountOnExit timeout={400}>
              <Box>
                <Typography variant="caption" sx={{ ml: 1.5, mb: 1, display: 'block', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1.5 }}>
                  Tu Email
                </Typography>
                <TextField
                  placeholder="ejemplo@correo.com"
                  fullWidth
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  type="email"
                  variant="outlined"
                  sx={inputStyles}
                />
              </Box>
            </Grow>

            <Grow in={step === 1} unmountOnExit timeout={400}>
              <Box>
                <Typography variant="caption" sx={{ ml: 1.5, mb: 1, display: 'block', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1.5 }}>
                  Tu Contraseña
                </Typography>
                <TextField
                  placeholder="••••••••"
                  fullWidth
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoFocus
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end" sx={{ mr: 1 }}>
                        <IconButton 
                          onClick={() => setShowPassword(!showPassword)} 
                          edge="end"
                          sx={{ color: '#cbd5e1' }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={inputStyles}
                />
              </Box>
            </Grow>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                bgcolor: brandColor,
                borderRadius: '16px',
                py: { xs: 1.8, md: 2.2 },
                fontWeight: 900,
                textTransform: "none",
                fontSize: '1.1rem',
                boxShadow: `0 12px 30px -6px ${alpha(brandColor, 0.4)}`,
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': { 
                  bgcolor: "#e0483a",
                  boxShadow: `0 20px 40px -8px ${alpha(brandColor, 0.5)}`,
                  transform: 'translateY(-3px)'
                },
                '&:active': { transform: 'scale(0.97)' }
              }}
            >
              {step === 0 ? "Continuar" : "Acceder al Restaurante"}
            </Button>
          </Stack>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: "#94a3b8", fontWeight: 600 }}>
              ¿Aún no eres miembro? <Box component="span" sx={{ color: brandColor, fontWeight: 800, cursor: 'pointer' }} onClick={() => navigate('/auth/register')}>Crea tu cuenta aquí</Box>
            </Typography>
          </Box>
        </Stack>

        <Typography variant="caption" sx={{ 
          position: { xs: 'relative', sm: 'absolute' }, 
          bottom: { xs: 0, sm: 30 }, 
          mt: { xs: 4, sm: 0 },
          color: '#cbd5e1', 
          fontWeight: 500, 
          letterSpacing: 1 
        }}>
          © 2026 MIX BOWLS RESTAURANTE
        </Typography>
      </Box>
    </Box>
  );
}