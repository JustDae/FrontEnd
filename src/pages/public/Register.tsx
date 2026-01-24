import { Alert, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { useState, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.tsx";

export default function Register(): JSX.Element {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      await register({ username, email, password });
      navigate("/dashboard", { replace: true });
    } catch {
      setError("No se pudo registrar. Revisa los datos o intenta más tarde.");
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 520, mx: "auto" }}>
      <Stack spacing={2} component="form" onSubmit={handleSubmit}>
        <Typography variant="h5">Registro</Typography>

        {error ? <Alert severity="error">{error}</Alert> : null}

        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button type="submit" variant="contained">Registrar</Button>
      </Stack>
    </Paper>
  );
}