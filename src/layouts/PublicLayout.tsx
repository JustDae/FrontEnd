import { Box, Container, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";
import PublicHeader from "../components/public/PublicHeader";
import PublicFooter from "../components/public/PublicFooter";
import type { JSX } from "react/jsx-runtime";

export default function PublicLayout(): JSX.Element {
  return (
    <Box 
      sx={{ 
        display: "flex", 
        flexDirection: "column", 
        minHeight: "100vh", 
        bgcolor: "#f9f9f9" 
      }}
    >
      <PublicHeader />

      <Toolbar />

      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="lg">
          <Outlet />
        </Container>
      </Box>

      <PublicFooter />
    </Box>
  );
}