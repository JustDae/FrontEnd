import { Alert, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.tsx";
import type { JSX } from "react";

type LocationState = { from?: string };

export default function Login(): JSX.Element {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state || {}) as LocationState;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      await login({ username, password });
      navigate(state.from || "/dashboard", { replace: true });
    } catch {
      setError("Credenciales inválidas o error de servidor.");
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 520, mx: "auto" }}>
      <Stack spacing={2} component="form" onSubmit={handleSubmit}>
        <Typography variant="h5">Login</Typography>

        {error ? <Alert severity="error">{error}</Alert> : null}

        <TextField
          label="Email (username)"
          type="email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button type="submit" variant="contained">Entrar</Button>
      </Stack>
    </Paper>
  );
}