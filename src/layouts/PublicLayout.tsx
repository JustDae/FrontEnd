<<<<<<< HEAD
import { Box, Container, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";
import PublicHeader from "../components/public/PublicHeader";
import PublicFooter from "../components/public/PublicFooter";
import type { JSX } from "react/jsx-runtime";
=======
import { Box, Container, Toolbar, alpha } from "@mui/material";
import { Outlet } from "react-router-dom";
import PublicHeader from "../components/public/PublicHeader";
import PublicFooter from "../components/public/PublicFooter";
import ScrollToHash from "./ScrollToHash";
import type { JSX } from "react";
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e

export default function PublicLayout(): JSX.Element {
  return (
    <Box 
      sx={{ 
        display: "flex", 
        flexDirection: "column", 
        minHeight: "100vh", 
<<<<<<< HEAD
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
=======
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
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
    </Box>
  );
}