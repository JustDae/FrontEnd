import { 
  Button, 
  Paper, 
  Stack, 
  TextField, 
  Typography, 
  Box, 
  IconButton,
  InputAdornment,
  Alert,
  styled} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.tsx";
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import type { JSX } from "react";

const StyledField = styled(TextField)({
  '& .MuiOutlinedInput-root': { 
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    '& fieldset': { border: 'none' },
    '&.Mui-focused': { 
      backgroundColor: '#fff', 
      boxShadow: '0 0 0 2px rgba(255, 109, 77, 0.15)' 
    }
  } 
});

export default function Register(): JSX.Element {
  const [step, setStep] = useState(0); 
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register } = useAuth();
  const navigate = useNavigate();

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

  return (
    <Box sx={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      position: "relative",
      p: 2,
      '&::before': {
        content: '""',
        position: 'absolute',
        inset: 0,
        backgroundImage: "url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2000')",
        backgroundSize: 'cover',
        filter: 'blur(10px) brightness(0.8)',
        zIndex: -1
      }
    }}>
      <Paper 
        elevation={0} 
        sx={{ 
          display: "flex", 
          width: "100%", 
          maxWidth: 800, 
          height: { xs: 'auto', md: 520 }, 
          borderRadius: 8, 
          overflow: "hidden",
          boxShadow: "0 25px 50px rgba(0,0,0,0.4)",
        }}
      >
        <Box sx={{ 
          flex: 1, 
          display: { xs: 'none', md: 'block' },
          backgroundImage: "url('https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=1000')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }} />

        <Box sx={{ 
          flex: 1, 
          p: { xs: 5, md: 7 }, 
          bgcolor: "white", 
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}>
          {step === 1 && (
            <IconButton 
              onClick={() => { setStep(0); setError(null); }}
              sx={{ position: "absolute", top: 20, left: 20 }}
            >
              <ArrowBackIcon />
            </IconButton>
          )}
          
          <IconButton sx={{ position: "absolute", top: 20, right: 20 }} onClick={() => navigate("/")}>
            <CloseIcon />
          </IconButton>

          <Stack spacing={4} component="form" onSubmit={handleProcess}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, letterSpacing: -1 }}>
                Registro
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                {step === 0 ? "Crea tu perfil en MixBowls." : "Ahora elige una contraseña segura."}
              </Typography>
            </Box>

            {error && <Alert severity="error" sx={{ borderRadius: 3 }}>{error}</Alert>}

            <Stack spacing={2}>
              {step === 0 ? (
                <>
                  <StyledField
                    placeholder="Nombre de usuario"
                    fullWidth
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <StyledField
                    placeholder="Correo electrónico"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    type="email"
                  />
                </>
              ) : (
                <StyledField
                  placeholder="Contraseña"
                  fullWidth
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoFocus
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  bgcolor: "#ff6d4d",
                  borderRadius: 80,
                  py: 1.8,
                  fontWeight: 800,
                  textTransform: "none",
                  boxShadow: "0 8px 20px rgba(255, 109, 77, 0.2)",
                  '&:hover': { bgcolor: "#e85a3d" }
                }}
              >
                {step === 0 ? "Siguiente" : "Crear Cuenta"}
              </Button>
            </Stack>

            <Typography 
              variant="caption" 
              textAlign="center" 
              sx={{ color: "text.disabled", cursor: 'pointer', '&:hover': { color: '#ff6d4d' } }}
              onClick={() => navigate("/login")}
            >
              ¿Ya tienes cuenta? Inicia sesión aquí
            </Typography>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}