import {
  Alert, Button, IconButton, Pagination, Paper, Stack, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, TextField,
  Typography, InputAdornment, Breadcrumbs, Link, Card, 
  CardContent, Skeleton, Box, Avatar
} from "@mui/material";
import { type JSX, useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import CategoryIcon from '@mui/icons-material/Category';
import ListAltIcon from '@mui/icons-material/ListAlt';

import CategoryFormDialog from "../../components/categories/CategoryFormDialog";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { useUi } from "../../context/UiContext";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";
import { type CategoryDto, createCategory, deleteCategory, getCategories, updateCategory } from "../../services/categories.service";

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
  const navigate = useNavigate();
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

  const queryKey = useMemo(() => ({
    page,
    limit,
    search: debouncedSearch.trim() || undefined,
    searchField: debouncedSearch.trim() ? "name" : undefined,
    sort: "name",
    order: "ASC" as const,
  }), [page, limit, debouncedSearch]);

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
        notify({ message: "Categoría creada", severity: "success" });
        await load();
        return;
      }
      if (!current) return;
      await updateCategory(current.id, payload);
      setOpen(false);
      notify({ message: "Categoría actualizada", severity: "success" });
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
      notify({ message: "Categoría eliminada", severity: "success" });
      setConfirmOpen(false);
      setToDelete(null);
      await load();
    } catch (e) {
      notify({ message: getApiErrorMessage(e), severity: "error" });
    }
  };

  return (
    <Box sx={{ p: 4, bgcolor: "#f9f9f9", minHeight: "100vh" }}>
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 1 }}>
          <Link underline="hover" color="inherit" onClick={() => navigate("/dashboard")} sx={{ cursor: 'pointer', fontSize: 13 }}>
            Dashboard
          </Link>
          <Typography color="text.primary" sx={{ fontWeight: 600, fontSize: 13 }}>Categorías</Typography>
        </Breadcrumbs>
        
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" sx={{ fontWeight: 900, color: "#2d3436" }}>
            Categorías
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onCreate}
            sx={{ 
              bgcolor: "#F55345", 
              "&:hover": { bgcolor: "#d44538" }, 
              borderRadius: "12px", 
              px: 3 
            }}
          >
            Nueva Categoría
          </Button>
        </Stack>
      </Box>

      <Box sx={{ display: "flex", gap: 3, mb: 4, flexWrap: "wrap" }}>
        <Card variant="outlined" sx={{ flex: "1 1 300px", borderRadius: "16px", borderLeft: "6px solid #F55345" }}>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: "rgba(245, 83, 69, 0.1)", color: "#F55345" }}>
                <CategoryIcon />
              </Avatar>
              <Box>
                <Typography variant="caption" color="text.secondary">Total Categorías</Typography>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>{items.length}</Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
        
        <Card variant="outlined" sx={{ flex: "1 1 300px", borderRadius: "16px", borderLeft: "6px solid #2065D1" }}>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: "rgba(32, 101, 209, 0.1)", color: "#2065D1" }}>
                <ListAltIcon />
              </Avatar>
              <Box>
                <Typography variant="caption" color="text.secondary">Estado</Typography>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>Activas</Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Box>

      <TextField
        placeholder="Buscar categorías..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (<InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>),
          sx: { borderRadius: "14px", bgcolor: "white" }
        }}
      />

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: "12px" }}>{error}</Alert>}

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: "16px", overflow: "hidden" }}>
        <Table>
          <TableHead sx={{ bgcolor: "#fcfcfc" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, py: 2 }}>NOMBRE DE CATEGORÍA</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>ACCIONES</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={2}><Skeleton height={40} /></TableCell>
                </TableRow>
              ))
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} align="center" sx={{ py: 5 }}>
                  <Typography color="text.secondary">No hay categorías disponibles.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              items.map((c) => (
                <TableRow key={c.id} hover>
                  <TableCell sx={{ fontWeight: 500 }}>{c.name}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <IconButton size="small" onClick={() => onEdit(c)} sx={{ color: "#F55345" }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => askDelete(c)} color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Pagination 
          count={totalPages} 
          page={page} 
          onChange={(_, v) => setPage(v)} 
          shape="rounded"
          sx={{ '& .Mui-selected': { bgcolor: '#F55345 !important', color: 'white' } }}
        />
      </Box>

      <CategoryFormDialog open={open} mode={mode} initial={current} onClose={() => setOpen(false)} onSubmit={onSubmit} />
      <ConfirmDialog open={confirmOpen} title="Eliminar categoría" description={`¿Quitar la categoría "${toDelete?.name}"?`} onCancel={() => setConfirmOpen(false)} onConfirm={confirmDelete} />
    </Box>
  );
}