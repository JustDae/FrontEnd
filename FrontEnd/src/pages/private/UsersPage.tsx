import { useState, useEffect, useMemo, type JSX } from "react";
import {
  Box, Typography, TextField, IconButton, Button,
  List, ListItem, ListItemText, ListItemSecondaryAction, Paper, Avatar,
  Breadcrumbs, Link, Stack, Card, CardContent, Divider, Tooltip, InputAdornment, Chip
} from "@mui/material";
import {
  Search, Edit, Delete, NavigateNext,
  Add, Group, AdminPanelSettings, Person
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  getUsers, updateUser, deleteUser, createUser, uploadUserProfile,
  type User, getUserImageUrl
} from "../../services/users.service";
import UserFormDialog from "../../components/users/UserFormDialog";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { useUi } from "../../context/UiContext";

export default function UsersPage(): JSX.Element {
  const { notify } = useUi();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [filtro, setFiltro] = useState("");
  const [open, setOpen] = useState(false);
  const [editando, setEditando] = useState<User | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<User | null>(null);

  const fetchUsers = (): void => {
    getUsers()
      .then((res: any) => {
        let list = [];

        if (res.items && Array.isArray(res.items)) {
          list = res.items;
        } else if (res.data && Array.isArray(res.data)) {
          list = res.data;
        } else if (res.data && res.data.items && Array.isArray(res.data.items)) {
          list = res.data.items;
        } else if (Array.isArray(res)) {
          list = res;
        }

        setUsers(list);
      })
      .catch(() => {
        setUsers([]);
      });
  }

  useEffect(fetchUsers, []);

  const totalUsers = useMemo(() => users.length, [users]);
  const totalAdmins = useMemo(() => {
    return users.filter(u => u.rol?.nombre === 'ADMIN' || u.rol?.id === 1).length;
  }, [users]);

  const handleSave = async (formData: FormData) => { // Recibimos FormData
    try {
      const file = formData.get("file") as File | null;

      const userData: any = {
        username: formData.get("username"),
        rolId: Number(formData.get("rolId")),
      };

      if (!editando) {
        userData.email = formData.get("email");
        userData.password = formData.get("password");
      }

      let targetUserId = editando?.id;

      if (editando) {
        await updateUser(editando.id, userData);
        notify({ message: "Usuario actualizado correctamente", severity: "success" });
      } else {
        const res = await createUser(userData);
        targetUserId = res.id || res.data?.id || res.user?.id;
        notify({ message: "Usuario creado con éxito", severity: "success" });
      }

      if (file && targetUserId && file instanceof File) {
        try {
          await uploadUserProfile(targetUserId, file);
          notify({ message: "Foto de perfil actualizada", severity: "success" });
        } catch (imgError) {
          console.error("Error subiendo imagen:", imgError);
          notify({ message: "Usuario guardado, pero falló la imagen (Solo JPG/PNG)", severity: "warning" });
        }
      }

      setOpen(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
      notify({ message: "Error al guardar (Revisa si el usuario ya existe)", severity: "error" });
    }
  };

  const askDelete = (user: User): void => {
    setItemToDelete(user);
    setConfirmOpen(true);
  };

  const confirmDelete = async (): Promise<void> => {
    if (!itemToDelete) return;
    try {
      await deleteUser(itemToDelete.id);
      notify({ message: "Usuario eliminado", severity: "success" });
      fetchUsers();
    } catch {
      notify({ message: "Error al eliminar usuario", severity: "error" });
    } finally {
      setConfirmOpen(false);
      setItemToDelete(null);
    }
  };

  const filtrados = users.filter(u =>
    u.username.toLowerCase().includes(filtro.toLowerCase()) ||
    u.email.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <Box sx={{ p: 4, bgcolor: "#f9f9f9", minHeight: "100vh" }}>
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ mb: 1 }}>
          <Link underline="hover" color="inherit" onClick={() => navigate("/dashboard")} sx={{ cursor: "pointer" }}>
            Dashboard
          </Link>
          <Typography color="text.primary">Usuarios</Typography>
        </Breadcrumbs>

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" sx={{ fontWeight: 900, color: "#2d3436" }}>
            Gestión de Usuarios
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => { setEditando(null); setOpen(true); }}
            sx={{ bgcolor: "#F55345", "&:hover": { bgcolor: "#d44538" }, borderRadius: "12px", px: 3 }}
          >
            Nuevo Usuario
          </Button>
        </Stack>
      </Box>

      <Box sx={{ display: "flex", gap: 3, mb: 4, flexWrap: "wrap" }}>
        <Card variant="outlined" sx={{ flex: "1 1 300px", borderRadius: "16px", borderLeft: "6px solid #2196f3" }}>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: "rgba(33, 150, 243, 0.1)", color: "#2196f3" }}>
                <Group />
              </Avatar>
              <Box>
                <Typography variant="caption" color="text.secondary">Total Usuarios</Typography>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>{totalUsers}</Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ flex: "1 1 300px", borderRadius: "16px", borderLeft: "6px solid #ff9800" }}>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: "rgba(255, 152, 0, 0.1)", color: "#ff9800" }}>
                <AdminPanelSettings />
              </Avatar>
              <Box>
                <Typography variant="caption" color="text.secondary">Administradores</Typography>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>{totalAdmins}</Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Box>

      <TextField
        placeholder="Buscar por usuario o email..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        fullWidth
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search color="action" />
            </InputAdornment>
          ),
          sx: { borderRadius: "14px", bgcolor: "white" }
        }}
      />

      <Paper variant="outlined" sx={{ borderRadius: "16px", overflow: "hidden" }}>
        <List sx={{ p: 0 }}>
          {filtrados.length === 0 ? (
            <Box sx={{ p: 5, textAlign: "center" }}>
              <Typography color="text.secondary">No se encontraron usuarios.</Typography>
            </Box>
          ) : (
            filtrados.map((user, index) => (
              <Box key={user.id}>
                <ListItem sx={{ py: 2, px: 3, "&:hover": { bgcolor: "#fcfcfc" } }}>
                  <Avatar
                    src={getUserImageUrl(user.profile)}
                    sx={{ mr: 3, width: 50, height: 50, bgcolor: "#e0e0e0" }}
                  >
                    {!user.profile && <Person />}
                  </Avatar>

                  <ListItemText
                    primary={
                      <Typography sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                        {user.username}
                      </Typography>
                    }
                    secondary={
                      <Stack direction="column" spacing={0.5} sx={{ mt: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          {user.email}
                        </Typography>
                        <Box>
                          <Chip
                            label={user.rol?.nombre || "SIN ROL"}
                            size="small"
                            color={user.rol?.nombre === 'ADMIN' ? "warning" : "default"}
                            variant="outlined"
                            sx={{ fontWeight: "bold", fontSize: "0.75rem" }}
                          />
                        </Box>
                      </Stack>
                    }
                  />

                  <ListItemSecondaryAction sx={{ right: 24 }}>
                    <Tooltip title="Editar Rol/Usuario">
                      <IconButton onClick={() => { setEditando(user); setOpen(true); }} sx={{ color: "#2196f3", mr: 1 }}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton onClick={() => askDelete(user)} color="error">
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < filtrados.length - 1 && <Divider component="li" />}
              </Box>
            ))
          )}
        </List>
      </Paper>

      <UserFormDialog
        open={open}
        mode={editando ? "edit" : "create"}
        initial={editando}
        onClose={() => setOpen(false)}
        onSubmit={handleSave}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Confirmar eliminación"
        description={`¿Eliminar al usuario "${itemToDelete?.username}"?`}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
      />
    </Box>
  );
}