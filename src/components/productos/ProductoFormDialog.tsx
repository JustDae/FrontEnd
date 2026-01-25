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
  Box,
  Typography,
} from "@mui/material";
import { useEffect, useState, type JSX, useRef } from "react";
import { useCategoriesOptions } from "../../hooks/useCategoriesOptions";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

type Props = {
  open: boolean;
  mode: "create" | "edit";
  initial?: any | null;
  onClose: () => void;
  onSubmit: (payload: FormData) => void;
};

export default function ProductoFormDialog({
  open,
  mode,
  initial,
  onClose,
  onSubmit,
}: Props): JSX.Element {
  const { options: categories } = useCategoriesOptions();
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState<number | string>("");
  const [categoryId, setCategoryId] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setNombre(initial?.nombre || "");
      setPrecio(initial?.precio || "");
      setCategoryId(initial?.categoryId || initial?.categoria?.id || "");
      setPreview(initial?.imageUrl ? `http://localhost:3000/public/productos/${initial.imageUrl}` : null);
      setImageFile(null);
    }
  }, [open, initial]);

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
    formData.append("nombre", nombre.trim());
    formData.append("precio", String(precio));
    
    if (categoryId) {
      formData.append("categoryId", String(categoryId));
    }

    if (imageFile) {
      formData.append("image", imageFile);
    }

    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: "bold" }}>
        {mode === "create" ? "Nuevo Producto" : "Editar Producto"}
      </DialogTitle>
      <DialogContent>
        <Stack
          spacing={3}
          component="form"
          id="producto-form"
          onSubmit={handleSubmit}
          sx={{ mt: 2 }}
        >
          <Box
            onClick={() => fileInputRef.current?.click()}
            sx={{
              width: "100%",
              height: 160,
              border: "2px dashed #ccc",
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              overflow: "hidden",
              bgcolor: "#f9f9f9",
              transition: "0.2s",
              "&:hover": { borderColor: "#F55345", bgcolor: "#fff1f0" },
            }}
          >
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <Stack alignItems="center" spacing={1}>
                <CloudUploadIcon sx={{ fontSize: 40, color: "#ccc" }} />
                <Typography variant="caption" color="text.secondary">
                  Subir imagen del plato
                </Typography>
              </Stack>
            )}
          </Box>
          <input
            type="file"
            hidden
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
          />

          <TextField
            label="Nombre del plato"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            fullWidth
            required
            autoFocus
          />
          <TextField
            label="Precio ($)"
            type="number"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            fullWidth
            required
          />
          <FormControl fullWidth>
            <InputLabel>Categoría</InputLabel>
            <Select
              label="Categoría"
              value={categoryId}
              onChange={(e) => setCategoryId(String(e.target.value))}
            >
              <MenuItem value="">Sin categoría</MenuItem>
              {categories.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
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
          form="producto-form"
          variant="contained"
          sx={{ bgcolor: "#F55345", "&:hover": { bgcolor: "#d44538" } }}
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}