import { Box, Container, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";
import PublicHeader from "../components/public/PublicHeader";
import PublicFooter from "../components/public/PublicFooter";
import ScrollToHash from "./ScrollToHash";
import type { JSX } from "react";

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
      <ScrollToHash />

      <PublicHeader />

      <Toolbar />

      <Box component="main" sx={{ flexGrow: 1, py: { xs: 2, md: 4 } }}>
        <Container maxWidth="lg">
          <Outlet />
        </Container>
      </Box>

      <PublicFooter />
    </Box>
  );
}