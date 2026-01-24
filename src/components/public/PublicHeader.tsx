import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import type { JSX } from "react";
import { Link as RouterLink } from "react-router-dom";

export default function PublicHeader(): JSX.Element {
  return (
    <AppBar position="fixed" sx={{ bgcolor: "#F55345" }}>
      <Toolbar>
        <Box display="flex" alignItems="center" gap={2}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/1996/1996055.png"
            alt="logo"
            width="32"
            height="32"
            style={{ display: "block" }}
          />
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Restaurante
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Box>
          <Button color="inherit" component={RouterLink} to="/">
            Home
          </Button>

          <Button color="inherit" component={RouterLink} to="/auth/login">
            Login
          </Button>

          <Button color="inherit" component={RouterLink} to="/auth/register">
            Register
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}