import { 
  Button, 
  Paper, 
  Stack, 
  TextField, 
  Typography, 
  Box, 
  IconButton,
  InputAdornment,
  Alert
} from "@mui/material";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.tsx";
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import type { JSX } from "react";

type LocationState = { from?: string };

export default function Login(): JSX.Element {
  const [step, setStep] = useState(0); 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state || {}) as LocationState;

  const handleProcess = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (step === 0) {
      if (username.trim() !== "") {
        setStep(1);
      } else {
        setError("Por favor, introduce un correo.");
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
          height: { xs: 'auto', md: 480 }, 
          borderRadius: 8, 
          overflow: "hidden",
          boxShadow: "0 25px 50px rgba(0,0,0,0.4)",
        }}
      >
        <Box sx={{ 
          flex: 1, 
          display: { xs: 'none', md: 'block' },
          backgroundImage: "url('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000')",
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
          
          <IconButton sx={{ position: "absolute", top: 20, right: 20 }}>
            <CloseIcon />
          </IconButton>

          <Stack spacing={4} component="form" onSubmit={handleProcess}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, letterSpacing: -1 }}>
                Login
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                {step === 0 ? "Enter your email to log in." : "Now enter your password."}
              </Typography>
            </Box>

            {error && <Alert severity="error" sx={{ borderRadius: 3 }}>{error}</Alert>}

            <Stack spacing={2}>
              {step === 0 ? (
                <TextField
                  placeholder="Enter your email"
                  fullWidth
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  type="email"
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: 3,
                      bgcolor: '#f5f5f5',
                      '& fieldset': { border: 'none' },
                    } 
                  }}
                />
              ) : (
                <TextField
                  placeholder="Password"
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
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: 3,
                      bgcolor: '#f5f5f5',
                      '& fieldset': { border: 'none' },
                    } 
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
                  '&:hover': { bgcolor: "#e85a3d" }
                }}
              >
                {step === 0 ? "Continue" : "Login"}
              </Button>
            </Stack>

            <Typography variant="caption" textAlign="center" sx={{ color: "text.disabled" }}>
              By continuing, you agree to the Terms of Service.
            </Typography>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}