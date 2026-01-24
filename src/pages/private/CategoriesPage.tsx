import { Alert, Button, CircularProgress, IconButton, Pagination, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import {JSX, useEffect, useMemo, useState} from "react";
import { useSearchParams } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import CategoryFormDialog from "../../components/categories/CategoryFormDialog";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { useUi } from "../../context/UiContext";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";
import {type CategoryDto, createCategory, deleteCategory, getCategories, updateCategory } from "../../services/categories.service";

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}

export default function CategoriesPage(): JSX.Element {
  const { notify } = useUi();
  const [sp, setSp] = useSearchParams();

  const pageParam = Number(sp.get("page") || "1");
  const limitParam = Number(sp.get("limit") || "10");
  const searchParam = sp.get("search") || "";

  const [page, setPage] = useState(Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1);
  const [limit] = useState(Number.isFinite(limitParam) && limitParam > 0 ? limitParam : 10);

  const [search, setSearch] = useState(searchParam);
  const debouncedSearch = useDebouncedValue(search, 450);

  const [items, setItems] = useState<CategoryDto[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [current, setCurrent] = useState<CategoryDto | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<CategoryDto | null>(null);

  const queryKey = useMemo(
    () => ({
      page,
      limit,
      search: debouncedSearch.trim() || undefined,
      searchField: debouncedSearch.trim() ? "name" : undefined,
      sort: "name",
      order: "ASC" as const,
    }),
    [page, limit, debouncedSearch]
  );

  useEffect(() => {
    setSp((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", String(page));
      next.set("limit", String(limit));
      if (search) next.set("search", search);
      else next.delete("search");
      return next;
    });
  }, [page, limit, search, setSp]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getCategories(queryKey);
      setItems(res.items);
      setTotalPages(res.meta.totalPages || 1);
    } catch (e) {
      setError(getApiErrorMessage(e));
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

  const onEdit = (c: CategoryDto) => {
    setMode("edit");
    setCurrent(c);
    setOpen(true);
  };

  const onSubmit = async (payload: { name: string }) => {
    try {
      setError(null);
      if (mode === "create") {
        await createCategory(payload);
        setOpen(false);
        setPage(1);
        notify({ message: "Categoría creada.", severity: "success" });
        await load();
        return;
      }
      if (!current) return;
      await updateCategory(current.id, payload);
      setOpen(false);
      notify({ message: "Categoría actualizada.", severity: "success" });
      await load();
    } catch (e) {
      notify({ message: getApiErrorMessage(e), severity: "error" });
    }
  };

  const askDelete = (c: CategoryDto) => {
    setToDelete(c);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await deleteCategory(toDelete.id);
      notify({ message: "Categoría eliminada.", severity: "success" });
      setConfirmOpen(false);
      setToDelete(null);
      await load();
    } catch (e) {
      notify({ message: getApiErrorMessage(e), severity: "error" });
    }
  };

  return (
    <Stack spacing={2}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Categorías
        </Typography>

        <Button variant="contained" startIcon={<AddIcon />} onClick={onCreate}>
          Nueva
        </Button>
      </Stack>

      {error ? <Alert severity="error">{error}</Alert> : null}

      <TextField label="Buscar (por nombre)" value={search} onChange={(e) => setSearch(e.target.value)} fullWidth />

      {loading ? (
        <CircularProgress />
      ) : items.length === 0 ? (
        <Alert severity="info">No hay categorías para mostrar.</Alert>
      ) : (
        <>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>{c.name}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => onEdit(c)} aria-label="editar"><EditIcon /></IconButton>
                      <IconButton onClick={() => askDelete(c)} aria-label="eliminar"><DeleteIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Stack direction="row" justifyContent="center" sx={{ py: 1 }}>
            <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} />
          </Stack>
        </>
      )}

      <CategoryFormDialog open={open} mode={mode} initial={current} onClose={() => setOpen(false)} onSubmit={onSubmit} />

      <ConfirmDialog
        open={confirmOpen}
        title="Confirmar eliminación"
        description={`¿Eliminar la categoría "${toDelete?.name || ""}"?`}
        onCancel={() => { setConfirmOpen(false); setToDelete(null); }}
        onConfirm={confirmDelete}
      />
    </Stack>
  );
}