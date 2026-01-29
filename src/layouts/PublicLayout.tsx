import { Box, Container, Toolbar, alpha } from "@mui/material";
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
        bgcolor: "#f4f6f8",
        overflowX: "hidden"
      }}
    >
      <ScrollToHash />

      <PublicHeader />

      <Toolbar sx={{ mb: { xs: 1, md: 2 } }} />

      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          py: { xs: 3, md: 6 },
          animation: "fadeIn 0.6s ease-out",
          "@keyframes fadeIn": {
            from: { 
              opacity: 0, 
              transform: "translateY(15px)" 
            },
            to: { 
              opacity: 1, 
              transform: "translateY(0)" 
            }
          }
        }}
      >
        <Container 
          maxWidth="lg" 
          sx={{ 
            px: { xs: 2, sm: 3, md: 4 } 
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "100%",
              position: "relative"
            }}
          >
            <Outlet />
          </Box>
        </Container>
      </Box>

      <Box
        sx={{
          mt: "auto",
          borderTop: "1px solid",
          borderColor: alpha("#000", 0.05),
          bgcolor: "white"
        }}
      >
        <PublicFooter />
      </Box>
    </Box>
  );
}