import { Alert, Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { JSX } from "react/jsx-runtime";

export default function Forbidden(): JSX.Element {
  const navigate = useNavigate();

  return (
    <Stack spacing={2}>
      <Typography variant="h4">403 — No autorizado</Typography>
      <Alert severity="error">
        No tienes permisos para acceder a este módulo.
      </Alert>
      <Button variant="outlined" onClick={() => navigate("/dashboard")}>
        Volver al Dashboard
      </Button>
    </Stack>
  );
}