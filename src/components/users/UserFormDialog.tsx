import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import {JSX, useEffect, useState} from "react";
import type {UserDto} from "../../services/users.service";

type Props = {
  open: boolean;
  mode: "create" | "edit";
  initial?: UserDto | null;
  onClose: () => void;
  onSubmit: (payload: { username: string; email: string; password?: string; role?: string }) => void;
};

export default function UserFormDialog({ open, mode, initial, onClose, onSubmit }: Props): JSX.Element {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");

  useEffect(() => {
    if (open) {
      setUsername(initial?.username || "");
      setEmail(initial?.email || "");
      setRole((initial?.role as string) || "USER");
      setPassword("");
    }
  }, [open, initial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      username: username.trim(),
      email: email.trim(),
      password: mode === "create" ? password : undefined,
      role: role || undefined,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{mode === "create" ? "Nuevo usuario" : "Editar usuario"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            required
            autoFocus
          />

          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
          />

          {mode === "create" ? (
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
            />
          ) : null}

          <FormControl fullWidth>
            <InputLabel id="role-label">Rol</InputLabel>
            <Select
              labelId="role-label"
              label="Rol"
              value={role}
              onChange={(e) => setRole(String(e.target.value))}
            >
              <MenuItem value="USER">USER</MenuItem>
              <MenuItem value="ADMIN">ADMIN</MenuItem>
            </Select>
          </FormControl>

          <DialogActions sx={{ px: 0 }}>
            <Button onClick={onClose}>Cancelar</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!username.trim() || !email.trim() || (mode === "create" && !password)}
            >
              Guardar
            </Button>
          </DialogActions>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}