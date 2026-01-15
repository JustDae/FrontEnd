import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export function PublicHeader(): JSX.Element {
  return (
    <AppBar
      position="fixed"
      elevation={1}
      sx={{ left: 0, right: 0, top: 0 }}
    >
      <Toolbar disableGutters sx={{ minHeight: 64 }}>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            px: 2, /* sin espacio externo; solo padding interno controlado */
          }}
        >
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Blog App
          </Typography>

          <Button color="inherit" component={RouterLink} to="/">
            Inicio
          </Button>
          <Button color="inherit" component={RouterLink} to="/dashboard/posts">
            Dashboard
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
