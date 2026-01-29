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
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.tsx";
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import type { JSX } from "react";

const brandColor = '#F55345';

const backgroundImages = [
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1920",
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1920",
  "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?q=80&w=1920",
  "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1920",
  "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1920",
  "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1920"
];

export default function Register(): JSX.Element {
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentImg, setCurrentImg] = useState(0);

  const { register } = useAuth();
  const navigate = useNavigate();

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
      if (username.trim() !== "" && email.trim() !== "") {
        setStep(1);
      } else {
        setError("Por favor, completa todos los campos.");
      }
    } else {
      try {
        await register({ username, email, password, rolId: 0 });
        navigate("/dashboard", { replace: true });
      } catch {
        setError("Error al crear la cuenta. Inténtalo de nuevo.");
      }
    }
  };

  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '14px',
      bgcolor: '#f8fafc',
      border: '1px solid #e2e8f0',
      transition: 'all 0.3s ease',
      '&:hover': { 
        borderColor: brandColor,
        bgcolor: '#f1f5f9'
      },
      '&.Mui-focused': {
        borderColor: brandColor,
        bgcolor: '#fff',
        boxShadow: `0 0 0 3px ${alpha(brandColor, 0.1)}`,
        '& fieldset': { border: 'none' },
      },
      '& fieldset': { border: 'none' },
    },
    '& .MuiInputBase-input': { 
      py: { xs: 1.4, md: 1.6 }, 
      px: 2,
      fontWeight: 500,
      fontSize: { xs: '0.85rem', md: '0.9rem' }
    }
  };

  return (
    <Box sx={{ 
      height: "100vh", 
      display: "flex", 
      bgcolor: 'white',
      overflow: 'hidden',
      flexDirection: { xs: 'column', lg: 'row' }
    }}>
      <Box sx={{
        flex: { lg: 1.2, xl: 1.5 },
        display: { xs: 'none', lg: 'block' },
        position: 'relative',
        m: 2,
        borderRadius: '20px',
        overflow: 'hidden',
      }}>
        {backgroundImages.map((img, index) => (
          <Fade key={img} in={currentImg === index} timeout={2500}>
            <Box
              component="img"
              src={img}
              alt={`Restaurant ${index}`}
              sx={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: currentImg === index ? 'block' : 'none',
                animation: currentImg === index ? 'ken-burns 20s infinite alternate' : 'none',
                '@keyframes ken-burns': {
                  '0%': { transform: 'scale(1.1)' },
                  '100%': { transform: 'scale(1.2) translate(-1%, -1%)' }
                }
              }}
            />
          </Fade>
        ))}
        <Box sx={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(225deg, ${alpha('#000', 0.15)} 0%, ${alpha('#000', 0.55)} 100%)`,
        }} />

        <Box sx={{ position: 'absolute', bottom: { lg: 50, xl: 70 }, left: { lg: 50, xl: 70 }, color: 'white', maxWidth: 500, p: 2 }}>
          <Typography variant="h2" sx={{ fontWeight: 900, lineHeight: 1.1, mb: 1.5, textShadow: '0 4px 15px rgba(0,0,0,0.2)', fontSize: { lg: '2.5rem', xl: '3.2rem' } }}>
            Únete a nuestra mesa.
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.85, fontWeight: 400, letterSpacing: 0.3, fontSize: { lg: '1rem', xl: '1.1rem' }, lineHeight: 1.5 }}>
            Crea tu cuenta para disfrutar de beneficios exclusivos y una experiencia gastronómica personalizada.
          </Typography>
        </Box>
      </Box>

      <Box sx={{
        flex: { xs: 1, lg: '0 0 450px', xl: '0 0 550px' },
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        p: { xs: 3, sm: 6, md: 8, lg: 6, xl: 10 },
        bgcolor: "white",
        position: "relative",
        height: '100%',
        overflowY: 'auto'
      }}>
        <Box sx={{ 
          position: "absolute", 
          top: { xs: 20, md: 30 }, 
          left: { xs: 20, md: 30 }, 
          right: { xs: 20, md: 30 }, 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {step === 1 ? (
            <IconButton
              onClick={() => { setStep(0); setError(null); }}
              sx={{ border: '1px solid #f1f5f9', borderRadius: '10px', p: 0.8 }}
            >
              <ArrowBackIcon sx={{ fontSize: '1.1rem' }} />
            </IconButton>
          ) : <Box />}

          <IconButton
            onClick={() => navigate('/')}
            sx={{ border: '1px solid #f1f5f9', borderRadius: '10px', p: 0.8 }}
          >
            <CloseIcon sx={{ fontSize: '1.1rem' }} />
          </IconButton>
        </Box>

        <Stack spacing={{ xs: 3, md: 4 }} component="form" onSubmit={handleProcess} sx={{ width: '100%', maxWidth: 360 }}>
          <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
            <Typography variant="h3" sx={{ 
              fontWeight: 900, 
              mb: 1, 
              letterSpacing: '-1.5px', 
              color: '#0f172a', 
              fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' } 
            }}>
              {step === 0 ? "Registro" : "Seguridad"}
            </Typography>
            <Typography variant="body1" sx={{ color: "#64748b", fontWeight: 500, lineHeight: 1.5, fontSize: { xs: '0.85rem', md: '0.95rem' } }}>
              {step === 0 ? "Comienza tu viaje gastronómico con nosotros creando tu perfil." : "Protege tu cuenta con una contraseña segura."}
            </Typography>
          </Box>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                borderRadius: '12px',
                bgcolor: alpha('#ef4444', 0.05),
                color: '#b91c1c',
                fontWeight: 600,
                fontSize: '0.8rem',
                border: `1px solid ${alpha('#ef4444', 0.1)}`
              }}
            >
              {error}
            </Alert>
          )}

          <Stack spacing={2.5}>
            <Grow in={step === 0} unmountOnExit timeout={400}>
              <Stack spacing={2.5}>
                <Box>
                  <Typography variant="caption" sx={{ ml: 1, mb: 0.8, display: 'block', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.65rem' }}>
                    Nombre de Usuario
                  </Typography>
                  <TextField
                    placeholder="Tu nombre"
                    fullWidth
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    variant="outlined"
                    sx={inputStyles}
                  />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ ml: 1, mb: 0.8, display: 'block', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.65rem' }}>
                    Correo Electrónico
                  </Typography>
                  <TextField
                    placeholder="ejemplo@correo.com"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    type="email"
                    variant="outlined"
                    sx={inputStyles}
                  />
                </Box>
              </Stack>
            </Grow>

            <Grow in={step === 1} unmountOnExit timeout={400}>
              <Box>
                <Typography variant="caption" sx={{ ml: 1, mb: 0.8, display: 'block', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.65rem' }}>
                  Contraseña
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
                      <InputAdornment position="end" sx={{ mr: 0.5 }}>
                        <IconButton 
                          onClick={() => setShowPassword(!showPassword)} 
                          edge="end"
                          sx={{ color: '#cbd5e1' }}
                        >
                          {showPassword ? <VisibilityOff sx={{ fontSize: '1.2rem' }} /> : <Visibility sx={{ fontSize: '1.2rem' }} />}
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
                borderRadius: '14px',
                py: { xs: 1.6, md: 1.8 },
                fontWeight: 900,
                textTransform: "none",
                fontSize: '0.95rem',
                boxShadow: `0 10px 25px -5px ${alpha(brandColor, 0.4)}`,
                transition: 'all 0.3s ease',
                '&:hover': { 
                  bgcolor: "#e0483a",
                  boxShadow: `0 15px 30px -8px ${alpha(brandColor, 0.5)}`,
                  transform: 'translateY(-2px)'
                },
                '&:active': { transform: 'scale(0.98)' }
              }}
            >
              {step === 0 ? "Siguiente Paso" : "Finalizar Registro"}
            </Button>
          </Stack>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: "#94a3b8", fontWeight: 600, fontSize: '0.8rem' }}>
              ¿Ya tienes cuenta? <Box component="span" sx={{ color: brandColor, fontWeight: 800, cursor: 'pointer', ml: 0.5 }} onClick={() => navigate('/auth/login')}>Inicia sesión</Box>
            </Typography>
          </Box>
        </Stack>

        <Typography variant="caption" sx={{ 
          position: { xs: 'relative', sm: 'absolute' }, 
          bottom: { xs: 0, sm: 25 }, 
          mt: { xs: 4, sm: 0 },
          color: '#cbd5e1', 
          fontWeight: 600, 
          letterSpacing: 1.5,
          fontSize: '0.6rem'
        }}>
          © 2026 MIX BOWLS RESTAURANTE
        </Typography>
      </Box>
    </Box>
  );
}