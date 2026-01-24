import {
  Alert,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState, type JSX } from "react";
import { useSearchParams } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import { type PostDto, createPost, deletePost, getPosts, updatePost } from "../../services/posts.service";
import PostFormDialog from "../../components/posts/PostFormDialog";
import { useCategoriesOptions } from "../../hooks/useCategoriesOptions";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import {type CategoryDto, deleteCategory} from "../../services/categories.service.ts";
import {getApiErrorMessage} from "../../utils/getApiErrorMessage.ts";
import {useUi} from "../../context/UiContext.tsx";


function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}

export default function PostsPage(): JSX.Element {
  const { notify } = useUi();
  const [sp, setSp] = useSearchParams();


  const pageParam = Number(sp.get("page") || "1");
  const searchParam = sp.get("search") || "";

  const [page, setPage] = useState(Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1);
  const [limit] = useState(10);

  const [search, setSearch] = useState(searchParam);
  const debouncedSearch = useDebouncedValue(search, 450);

  const [items, setItems] = useState<PostDto[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { options: categories, loading: loadingCategories } = useCategoriesOptions();


  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [current, setCurrent] = useState<PostDto | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<PostDto | null>(null);

  const queryKey = useMemo(
    () => ({
      page,
      limit,
      search: debouncedSearch.trim() || undefined,
      searchField: debouncedSearch.trim() ? "title" : undefined,
    }),
    [page, limit, debouncedSearch]
  );


  useEffect(() => {
    setSp((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", String(page));
      if (search) next.set("search", search);
      else next.delete("search");
      return next;
    }, { replace: true });
  }, [page, search, setSp]);


  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getPosts(queryKey);
      setItems(res.items);
      setTotalPages(res.meta.totalPages || 1);
    } catch {
      setError("No se pudieron cargar los posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [queryKey]);


  const onCreate = () => {
    setMode("create");
    setCurrent(null);
    setOpen(true);
  };

  const onEdit = (p: PostDto) => {
    setMode("edit");
    setCurrent(p);
    setOpen(true);
  };

  const onSubmit = async (payload: { title: string; content: string; categoryId?: string | null }) => {
    try {
      if (mode === "create") {
        await createPost(payload);
        setPage(1);
      } else if (current) {
        await updatePost(current.id, payload);
      }
      setOpen(false);
      await load();
    } catch {
      setError("No se pudo guardar el post.");
    }
  };

  const askDelete = (c: CategoryDto) => {
    setToDelete(c);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await deletePost(toDelete.id);
      notify({ message: "Post eliminado.", severity: "success" });
      setConfirmOpen(false);
      setToDelete(null);
      await load();
    } catch (e) {
      notify({ message: getApiErrorMessage(e), severity: "error" });
    }
  };

  const getCategoryName = (p: PostDto) => {
    const id = p.categoryId || p.category?.id;
    if (!id) return "Sin categoría";
    const found = categories.find((c) => c.id === id);
    return found?.name || p.category?.name || "Categoría";
  };

  return (
    <Stack spacing={2} sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Posts</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onCreate}
          disabled={loadingCategories}
        >
          Nuevo Post
        </Button>
      </Stack>

      {error && <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>}

      <TextField
        label="Buscar por título..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
      />

      {loading ? (
        <Stack alignItems="center"><CircularProgress /></Stack>
      ) : items.length === 0 ? (
        <Alert severity="info">No hay posts para mostrar.</Alert>
      ) : (
        <>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Título</TableCell>
                  <TableCell>Categoría</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.title}</TableCell>
                    <TableCell>
                      <Chip size="small" label={getCategoryName(p)} color="primary" variant="outlined" />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => onEdit(p)} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => askDelete(p)} aria-label="eliminar">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Stack direction="row" justifyContent="center">
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, v) => setPage(v)}
              color="primary"
            />
          </Stack>
        </>
      )}



      <PostFormDialog
        open={open}
        mode={mode}
        initial={current}
        onClose={() => setOpen(false)}
        onSubmit={onSubmit} categories={[]}      />

      <ConfirmDialog
        open={confirmOpen}
        title="Confirmar eliminación"
        description={`¿Estás seguro de que deseas eliminar el post "${toDelete?.title || ""}"?`}
        onCancel={() => { setConfirmOpen(false); setToDelete(null); }}
        onConfirm={confirmDelete}
      />
    </Stack>
  );
}