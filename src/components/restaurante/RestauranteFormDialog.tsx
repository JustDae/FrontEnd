import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
  Stack, TextField, Avatar, Box
} from "@mui/material";
import { Store, PhotoCamera } from "@mui/icons-material";
import { useEffect, useState, type JSX } from "react";
import type { Restaurante } from "../../services/restaurante.service";

type Props = {
  open: boolean;
  initial?: Restaurante | null;
  onClose: () => void;
  onSubmit: (payload: any) => void;
};

export default function RestauranteFormDialog({ open, initial, onClose, onSubmit }: Props): JSX.Element {
  const [name, setName] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [ruc, setRuc] = useState("");
  const [slogan, setSlogan] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (open && initial) {
      setName(initial.name || "");
      setDireccion(initial.direccion || "");
      setTelefono(initial.telefono || "");
      setRuc(initial.ruc || "");
      setSlogan(initial.slogan || "");
      setPreview(initial.logo ? `http://localhost:3000/restaurante/${initial.logo}` : null);
    } else {
      setName(""); setDireccion(""); setTelefono(""); setRuc(""); setSlogan("");
      setPreview(null); setImageFile(null);
    }
  }, [open, initial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, direccion, telefono, ruc, slogan, logoFile: imageFile });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: "bold" }}>Configuración del Local</DialogTitle>
      <form id="rest-form" onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }} alignItems="center">
            <Box sx={{ position: 'relative' }}>
              <Avatar
                  src={preview || ""}
                  sx={{ width: 120, height: 120, borderRadius: "16px", bgcolor: '#f0f0f0' }}
              >
                <Store sx={{ fontSize: 60, color: '#ccc' }} />
              </Avatar>
              <Button
                variant="contained"
                component="label"
                sx={{ position: 'absolute', bottom: -10, right: -10, minWidth: 0, p: 1, borderRadius: '50%' }}
              >
                <PhotoCamera fontSize="small" />
                <input type="file" hidden accept="image/*" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setImageFile(file);
                    setPreview(URL.createObjectURL(file));
                  }
                }} />
              </Button>
            </Box>
            <TextField label="Nombre Comercial" fullWidth required value={name} onChange={(e) => setName(e.target.value)} />
            <TextField label="RUC" fullWidth required value={ruc} onChange={(e) => setRuc(e.target.value)} />
            <TextField label="Teléfono" fullWidth value={telefono} onChange={(e) => setTelefono(e.target.value)} />
            <TextField label="Dirección" fullWidth multiline rows={2} value={direccion} onChange={(e) => setDireccion(e.target.value)} />
            <TextField label="Slogan" fullWidth value={slogan} onChange={(e) => setSlogan(e.target.value)} />
          </Stack>
        </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button type="submit" form="rest-form" variant="contained" sx={{ bgcolor: "#F55345" }}>Guardar Cambios</Button>
      </DialogActions>
      </form>
    </Dialog>
  );
}