import {
  Alert, Button, IconButton, Pagination, Paper, Stack, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, TextField,
  Typography, InputAdornment, Breadcrumbs, Link, Card, 
<<<<<<< HEAD
  CardContent, Skeleton, Box, Avatar
} from "@mui/material";
import { type JSX, useEffect, useMemo, useState } from "react";
=======
  CardContent, Skeleton, Box, Avatar, Grid as Grid, Fade, Tooltip
} from "@mui/material";
import { type JSX, useEffect, useMemo, useState, useCallback } from "react";
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
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

<<<<<<< HEAD
=======
const styles = {
  container: { p: { xs: 2, md: 4 }, bgcolor: "#f8fafc", minHeight: "100vh" },
  statCard: { 
    borderRadius: "20px", 
    border: "none", 
    boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
    background: "white",
    transition: "transform 0.2s ease-in-out",
    "&:hover": { transform: "translateY(-4px)" }
  },
  searchField: {
    "& .MuiOutlinedInput-root": {
      bgcolor: "white",
      borderRadius: "16px",
      "& fieldset": { border: "1px solid #e2e8f0" },
      "&:hover fieldset": { borderColor: "#F55345" },
      "&.Mui-focused fieldset": { borderColor: "#F55345", borderWidth: "2px" }
    }
  },
  actionButton: {
    bgcolor: "#F55345", 
    color: "white",
    px: 3, 
    py: 1.2,
    borderRadius: "14px", 
    textTransform: "none",
    fontWeight: 700,
    boxShadow: "0 8px 16px rgba(245, 83, 69, 0.2)",
    "&:hover": { bgcolor: "#d44538" }
  }
};

>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
export default function CategoriesPage(): JSX.Element {
  const { notify } = useUi();
  const navigate = useNavigate();
  const [sp, setSp] = useSearchParams();

  const pageParam = Number(sp.get("page") || "1");
  const limitParam = Number(sp.get("limit") || "10");
  const searchParam = sp.get("search") || "";

  const [page, setPage] = useState(Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1);
  const [limit] = useState(Number.isFinite(limitParam) && limitParam > 0 ? limitParam : 10);
<<<<<<< HEAD

=======
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
  const [search, setSearch] = useState(searchParam);
  const debouncedSearch = useDebouncedValue(search, 450);

  const [items, setItems] = useState<CategoryDto[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [current, setCurrent] = useState<CategoryDto | null>(null);
<<<<<<< HEAD

=======
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
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

<<<<<<< HEAD
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
=======
  const load = useCallback(async () => {
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
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
<<<<<<< HEAD
  };

  useEffect(() => {
    load();
  }, [queryKey]);
=======
  }, [queryKey]);

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

  useEffect(() => { setPage(1); }, [debouncedSearch]);
  useEffect(() => { load(); }, [load]);
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e

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
<<<<<<< HEAD
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
=======
      if (mode === "create") {
        await createCategory(payload);
        notify({ message: "Categoría creada con éxito", severity: "success" });
        setPage(1);
      } else if (current) {
        await updateCategory(current.id, payload);
        notify({ message: "Categoría actualizada", severity: "success" });
      }
      setOpen(false);
      load();
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
    } catch (e) {
      notify({ message: getApiErrorMessage(e), severity: "error" });
    }
  };

<<<<<<< HEAD
  const askDelete = (c: CategoryDto) => {
    setToDelete(c);
    setConfirmOpen(true);
  };

=======
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await deleteCategory(toDelete.id);
      notify({ message: "Categoría eliminada", severity: "success" });
      setConfirmOpen(false);
      setToDelete(null);
<<<<<<< HEAD
      await load();
=======
      load();
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
    } catch (e) {
      notify({ message: getApiErrorMessage(e), severity: "error" });
    }
  };

  return (
<<<<<<< HEAD
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
=======
    <Box sx={styles.container}>
      <Box sx={{ mb: 5 }}>
        <Breadcrumbs separator={<NavigateNextIcon sx={{ fontSize: 16, opacity: 0.5 }} />} sx={{ mb: 1 }}>
          <Link underline="hover" color="inherit" onClick={() => navigate("/dashboard")} sx={{ cursor: 'pointer', fontSize: 12, fontWeight: 500 }}>
            Dashboard
          </Link>
          <Typography color="text.primary" sx={{ fontWeight: 600, fontSize: 12 }}>Categorías</Typography>
        </Breadcrumbs>
        
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: "#1e293b", letterSpacing: "-0.5px" }}>
              Categorías
            </Typography>
            <Typography variant="body2" color="text.secondary">Gestiona las clasificaciones de tus productos.</Typography>
          </Box>
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onCreate}
<<<<<<< HEAD
            sx={{ 
              bgcolor: "#F55345", 
              "&:hover": { bgcolor: "#d44538" }, 
              borderRadius: "12px", 
              px: 3 
            }}
=======
            sx={styles.actionButton}
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
          >
            Nueva Categoría
          </Button>
        </Stack>
      </Box>

<<<<<<< HEAD
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
=======
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined" sx={{ ...styles.statCard, borderLeft: "6px solid #F55345" }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" spacing={3} alignItems="center">
                <Avatar sx={{ bgcolor: "#fff1f0", color: "#F55345", width: 56, height: 56, borderRadius: "14px" }}>
                  <CategoryIcon />
                </Avatar>
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>Total Categorías</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800 }}>{items.length}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined" sx={{ ...styles.statCard, borderLeft: "6px solid #2065D1" }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" spacing={3} alignItems="center">
                <Avatar sx={{ bgcolor: "#eef2ff", color: "#2065D1", width: 56, height: 56, borderRadius: "14px" }}>
                  <ListAltIcon />
                </Avatar>
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>Estado del Catálogo</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: "#2065D1" }}>Activo</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <TextField
        placeholder="Buscar categorías por nombre..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
        sx={{ ...styles.searchField, mb: 3 }}
        InputProps={{
          startAdornment: (<InputAdornment position="start" sx={{ pl: 1 }}><SearchIcon sx={{ color: "#94a3b8" }} /></InputAdornment>),
        }}
      />

      {error && <Fade in><Alert severity="error" sx={{ mb: 3, borderRadius: "12px" }}>{error}</Alert></Fade>}

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: "24px", overflow: "hidden", border: "1px solid #e2e8f0" }}>
        <Table>
          <TableHead sx={{ bgcolor: "#f8fafc" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 800, color: "#64748b", py: 2.5, fontSize: "0.75rem", textTransform: "uppercase" }}>Nombre de Categoría</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800, color: "#64748b", py: 2.5, fontSize: "0.75rem", textTransform: "uppercase" }}>Acciones</TableCell>
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
<<<<<<< HEAD
                  <TableCell colSpan={2}><Skeleton height={40} /></TableCell>
=======
                  <TableCell colSpan={2}><Skeleton height={50} variant="text" sx={{ mx: 2 }} /></TableCell>
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
                </TableRow>
              ))
            ) : items.length === 0 ? (
              <TableRow>
<<<<<<< HEAD
                <TableCell colSpan={2} align="center" sx={{ py: 5 }}>
                  <Typography color="text.secondary">No hay categorías disponibles.</Typography>
=======
                <TableCell colSpan={2} align="center" sx={{ py: 10 }}>
                  <Typography color="text.secondary" variant="body2">No se encontraron categorías disponibles.</Typography>
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
                </TableCell>
              </TableRow>
            ) : (
              items.map((c) => (
<<<<<<< HEAD
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
=======
                <TableRow key={c.id} sx={{ '&:hover': { bgcolor: '#f8fafc' }, transition: '0.2s' }}>
                  <TableCell sx={{ fontWeight: 600, color: "#334155" }}>{c.name}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Tooltip title="Editar">
                        <IconButton size="small" onClick={() => onEdit(c)} sx={{ color: "#94a3b8", '&:hover': { color: "#3b82f6", bgcolor: "#eff6ff" } }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton size="small" onClick={() => { setToDelete(c); setConfirmOpen(true); }} sx={{ color: "#94a3b8", '&:hover': { color: "#ef4444", bgcolor: "#fef2f2" } }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

<<<<<<< HEAD
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
=======
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
        <Pagination 
          count={totalPages} 
          page={page} 
          onChange={(_, v) => setPage(v)} 
          shape="rounded"
<<<<<<< HEAD
          sx={{ '& .Mui-selected': { bgcolor: '#F55345 !important', color: 'white' } }}
=======
          size="large"
          sx={{ 
            '& .MuiPaginationItem-root': { fontWeight: 600 },
            '& .Mui-selected': { bgcolor: '#F55345 !important', color: 'white', boxShadow: '0 4px 10px rgba(245, 83, 69, 0.3)' } 
          }}
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
        />
      </Box>

      <CategoryFormDialog open={open} mode={mode} initial={current} onClose={() => setOpen(false)} onSubmit={onSubmit} />
<<<<<<< HEAD
      <ConfirmDialog open={confirmOpen} title="Eliminar categoría" description={`¿Quitar la categoría "${toDelete?.name}"?`} onCancel={() => setConfirmOpen(false)} onConfirm={confirmDelete} />
=======
      <ConfirmDialog open={confirmOpen} title="Eliminar categoría" description={`¿Estás seguro de quitar "${toDelete?.name}"? Esta acción no se puede deshacer.`} onCancel={() => setConfirmOpen(false)} onConfirm={confirmDelete} />
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
    </Box>
  );
}