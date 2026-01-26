import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
  FormControl, InputLabel, MenuItem, Select, Stack, TextField,
  Box, Avatar, Typography
} from "@mui/material";
import { useEffect, useState, type JSX, useRef } from "react";
import { Person } from "@mui/icons-material";
import { getRoles, getUserImageUrl, type Rol } from "../../services/users.service";

type Props = {
  open: boolean;
  mode: "create" | "edit";
  initial?: any | null;
  onClose: () => void;
  onSubmit: (payload: FormData) => void;
};

export default function UserFormDialog({
  open,
  mode,
  initial,
  onClose,
  onSubmit,
}: Props): JSX.Element {
  const [roles, setRoles] = useState<Rol[]>([]);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [rolId, setRolId] = useState<number | string>("");
  const [password, setPassword] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getRoles().then(setRoles).catch(console.error);
  }, []);

  useEffect(() => {
    if (open && initial) {
      setUsername(initial.username || "");
      setEmail(initial.email || "");
      setRolId(initial.rol?.id || initial.rolId || "");
      setPreview(initial.profile ? (getUserImageUrl(initial.profile)  || null) : null);
    } else if (open && mode === "create") {
      setUsername("");
      setEmail("");
      setRolId(4);
      setPassword("");
      setPreview(null);
    }
    setImageFile(null);
  }, [open, initial, mode]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", username);
    formData.append("rolId", String(rolId));

    if (mode === "create") {
      formData.append("email", email);
      formData.append("password", password);
    }

    if (imageFile) {
      formData.append("file", imageFile);
    }

    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: "bold" }}>
        {mode === "create" ? "Nuevo Usuario" : "Editar Usuario"}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} component="form" id="user-form" onSubmit={handleSubmit} sx={{ mt: 2 }}>

          <Box
            onClick={() => fileInputRef.current?.click()}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
              "&:hover": { opacity: 0.8 }
            }}
          >
             <Avatar
                src={preview || undefined}
                sx={{ width: 100, height: 100, bgcolor: "#E0E0E0", border: "4px solid white", boxShadow: 2 }}
             >
                {!preview && <Person sx={{ fontSize: 60, color: "gray" }} />}
             </Avatar>
             <Typography variant="caption" color="primary" sx={{ fontWeight: "bold" }}>
                {preview ? "Cambiar foto" : "Subir foto"}
             </Typography>

             <input
               type="file"
               hidden
               ref={fileInputRef}
               onChange={handleFileChange}
               accept="image/*"
             />
          </Box>

          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            required
          />

          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            disabled={mode === "edit"}
          />

          {mode === "create" && (
             <TextField
               label="Contraseña"
               type="password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               fullWidth
               required
             />
          )}

          <FormControl fullWidth>
            <InputLabel>Rol del Usuario</InputLabel>
            <Select
              label="Rol del Usuario"
              value={rolId}
              onChange={(e) => setRolId(e.target.value)}
            >
              {Array.isArray(roles) && roles.map((rol) => (
                <MenuItem key={rol.id} value={rol.id}>
                  {rol.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>
        <Button
          type="submit"
          form="user-form"
          variant="contained"
          sx={{ bgcolor: "#F55345", "&:hover": { bgcolor: "#d44538" } }}
        >
          Guardar Cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
}