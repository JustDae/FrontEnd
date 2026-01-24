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
import {JSX, useEffect, useMemo, useState} from "react";
import { useSearchParams } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import UserFormDialog from "../../components/users/UserFormDialog";
import {type UserDto, createUser, deleteUser, getUsers, updateUser } from "../../services/users.service";

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}

export default function UsersPage(): JSX.Element {
  const [sp, setSp] = useSearchParams();

  const pageParam = Number(sp.get("page") || "1");
  const limitParam = Number(sp.get("limit") || "10");
  const searchParam = sp.get("search") || "";

  const [page, setPage] = useState(Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1);
  const [limit] = useState(Number.isFinite(limitParam) && limitParam > 0 ? limitParam : 10);

  const [search, setSearch] = useState(searchParam);
  const debouncedSearch = useDebouncedValue(search, 450);

  const [items, setItems] = useState<UserDto[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [current, setCurrent] = useState<UserDto | null>(null);

  const queryKey = useMemo(
    () => ({
      page,
      limit,
      search: debouncedSearch.trim() || undefined,
      searchField: debouncedSearch.trim() ? "username" : undefined,
      sort: "username",
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
      const res = await getUsers(queryKey);
      setItems(res.items);
      setTotalPages(res.meta.totalPages || 1);
    } catch {
      setError("No se pudieron cargar los usuarios.");
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

  const onEdit = (u: UserDto) => {
    setMode("edit");
    setCurrent(u);
    setOpen(true);
  };

  const onSubmit = async (payload: { username: string; email: string; password?: string; role?: string }) => {
    try {
      setError(null);
      if (mode === "create") {
        await createUser({
          username: payload.username,
          email: payload.email,
          password: payload.password || "",
          role: payload.role,
        });
        setOpen(false);
        setPage(1);
        await load();
        return;
      }
      if (!current) return;
      await updateUser(current.id, {
        username: payload.username,
        email: payload.email,
        role: payload.role,
      });
      setOpen(false);
      await load();
    } catch {
      setError("No se pudo guardar el usuario.");
    }
  };

  const onDelete = async (id: string) => {
    try {
      setError(null);
      await deleteUser(id);
      await load();
    } catch {
      setError("No se pudo eliminar el usuario.");
    }
  };

  const roleLabel = (u: UserDto) => u.role || "USER";

  return (
    <Stack spacing={2}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Users
        </Typography>

        <Button variant="contained" startIcon={<AddIcon />} onClick={onCreate}>
          Nuevo
        </Button>
      </Stack>

      {error ? <Alert severity="error">{error}</Alert> : null}

      <TextField
        label="Buscar (por username)"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
      />

      {loading ? (
        <CircularProgress />
      ) : items.length === 0 ? (
        <Alert severity="info">No hay usuarios para mostrar.</Alert>
      ) : (
        <>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Rol</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>{u.username}</TableCell>
                    <TableCell>{u.email || ""}</TableCell>
                    <TableCell>
                      <Chip size="small" label={roleLabel(u)} />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => onEdit(u)} aria-label="editar">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => onDelete(u.id)} aria-label="eliminar">
                        <DeleteIcon />
                      </IconButton>
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

      <UserFormDialog
        open={open}
        mode={mode}
        initial={current}
        onClose={() => setOpen(false)}
        onSubmit={onSubmit}
      />
    </Stack>
  );
}