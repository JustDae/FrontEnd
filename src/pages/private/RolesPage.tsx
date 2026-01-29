import { useState, useEffect, type JSX } from "react";
import {
  Box, Typography, Button, List, ListItem, ListItemText,
  ListItemSecondaryAction, Paper, Avatar, Breadcrumbs, Link,
  Stack, IconButton, Tooltip, Divider, Chip
} from "@mui/material";
import {
  NavigateNext, Add, Edit, Delete, Security
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useUi } from "../../context/UiContext";
import { getRoles, createRol, updateRol, deleteRol, type Rol } from "../../services/roles.service";
import RoleFormDialog from "../../components/roles/RoleFormDialog";
import ConfirmDialog from "../../components/common/ConfirmDialog";

export default function RolesPage(): JSX.Element {
  const { notify } = useUi();
  const navigate = useNavigate();
  const [roles, setRoles] = useState<Rol[]>([]);

  const [open, setOpen] = useState(false);
  const [editando, setEditando] = useState<Rol | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Rol | null>(null);

  const fetchRoles = () => {
    getRoles()
      .then((res: any) => {
        let list = [];
        if (res.items) list = res.items;
        else if (res.data?.items) list = res.data.items;
        else if (res.data) list = res.data;
        else if (Array.isArray(res)) list = res;

        setRoles(list);
      })
      .catch((err) => {
        console.error(err);
        notify({ message: "Error al cargar roles", severity: "error" });
      });
  };

  useEffect(() => { fetchRoles(); }, []);

  const handleSave = async (payload: any) => {
    try {
      if (editando) {
        await updateRol(editando.id, payload);
        notify({ message: "Rol actualizado", severity: "success" });
      } else {
        await createRol(payload);
        notify({ message: "Rol creado", severity: "success" });
      }
      setOpen(false);
      fetchRoles();
    } catch (err) {
      console.error(err);
      notify({ message: "Error al guardar rol", severity: "error" });
    }
  };

  const askDelete = (rol: Rol) => {
    setItemToDelete(rol);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteRol(itemToDelete.id);
      notify({ message: "Rol eliminado", severity: "success" });
      fetchRoles();
    } catch (error) {
      notify({ message: "No se puede eliminar (quizás tiene usuarios asignados)", severity: "error" });
    } finally {
      setConfirmOpen(false);
      setItemToDelete(null);
    }
  };

  return (
    <Box sx={{ p: 4, bgcolor: "#f9f9f9", minHeight: "100vh" }}>
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ mb: 1 }}>
          <Link underline="hover" color="inherit" onClick={() => navigate("/dashboard")} sx={{ cursor: "pointer" }}>
            Dashboard
          </Link>
          <Typography color="text.primary">Roles</Typography>
        </Breadcrumbs>

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" sx={{ fontWeight: 900, color: "#2d3436" }}>
            Roles y Permisos
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => { setEditando(null); setOpen(true); }}
            sx={{ bgcolor: "#F55345", "&:hover": { bgcolor: "#d44538" }, borderRadius: "12px", px: 3 }}
          >
            Nuevo Rol
          </Button>
        </Stack>
      </Box>

      <Paper variant="outlined" sx={{ borderRadius: "16px", overflow: "hidden" }}>
        <List sx={{ p: 0 }}>
          {roles.length === 0 ? (
            <Box sx={{ p: 5, textAlign: "center" }}>
              <Typography color="text.secondary">No hay roles creados.</Typography>
            </Box>
          ) : (
            roles.map((rol, index) => (
              <Box key={rol.id}>
                <ListItem sx={{ py: 2, px: 3, "&:hover": { bgcolor: "#fcfcfc" } }}>
                  <Avatar sx={{ mr: 3, bgcolor: "#E3F2FD", color: "#2196F3" }}>
                    <Security />
                  </Avatar>

                  <ListItemText
                    primary={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                          {rol.nombre}
                        </Typography>
                        {!rol.activo && <Chip label="Inactivo" size="small" color="default" />}
                      </Stack>
                    }
                    secondary={
                      rol.descripcion || "Sin descripción"
                    }
                  />

                  <ListItemSecondaryAction>
                    <Tooltip title="Editar">
                      <IconButton onClick={() => { setEditando(rol); setOpen(true); }} sx={{ color: "#2196f3", mr: 1 }}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton onClick={() => askDelete(rol)} color="error">
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < roles.length - 1 && <Divider component="li" />}
              </Box>
            ))
          )}
        </List>
      </Paper>

      <RoleFormDialog
        open={open}
        mode={editando ? "edit" : "create"}
        initial={editando}
        onClose={() => setOpen(false)}
        onSubmit={handleSave}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Eliminar Rol"
        description={`¿Estás seguro de eliminar el rol "${itemToDelete?.nombre}"?`}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
      />
    </Box>
  );
}