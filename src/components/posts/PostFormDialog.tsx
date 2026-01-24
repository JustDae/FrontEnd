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
import { useEffect, useState } from "react";
import type {CategoryDto} from "../../services/categories.service";
import type {PostDto} from "../../services/posts.service";

type Props = {
  open: boolean;
  mode: "create" | "edit";
  initial?: PostDto | null;
  categories: CategoryDto[];
  onClose: () => void;
  onSubmit: (payload: { title: string; content: string; categoryId?: string | null }) => void;
};

export default function PostFormDialog({
  open,
  mode,
  initial,
  categories,
  onClose,
  onSubmit,
}: Props): JSX.Element {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");

  useEffect(() => {
    if (open) {
      setTitle(initial?.title || "");
      setContent(initial?.content || "");
      setCategoryId(initial?.categoryId || initial?.category?.id || "");
    }
  }, [open, initial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: title.trim(),
      content: content.trim(),
      categoryId: categoryId ? categoryId : null,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{mode === "create" ? "Nuevo post" : "Editar post"}</DialogTitle>

      <DialogContent>
        <Stack spacing={2} component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            label="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
            autoFocus
          />

          <TextField
            label="Contenido"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            fullWidth
            required
            multiline
            minRows={6}
          />

          <FormControl fullWidth>
            <InputLabel id="category-label">Categoría (opcional)</InputLabel>
            <Select
              labelId="category-label"
              label="Categoría (opcional)"
              value={categoryId}
              onChange={(e) => setCategoryId(String(e.target.value))}
            >
              <MenuItem value="">Sin categoría</MenuItem>
              {categories.map((c) => (
                <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <DialogActions sx={{ px: 0 }}>
            <Button onClick={onClose}>Cancelar</Button>
            <Button type="submit" variant="contained" disabled={!title.trim() || !content.trim()}>
              Guardar
            </Button>
          </DialogActions>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}