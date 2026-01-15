import { Box, Toolbar } from "@mui/material";
import { PublicHeader } from "../components/PublicHeader";
import { PublicFooter } from "../components/PublicFooter";
import { Outlet } from "react-router-dom";
import type { JSX } from "react";

const FOOTER_HEIGHT = 56;

export default function PublicLayout(): JSX.Element {
  return (
    <Box minHeight="100vh">
      <PublicHeader />
      <Toolbar />
      <Box sx={{ pb: `${FOOTER_HEIGHT}px` }}>
        <Outlet />
      </Box>

      <PublicFooter />
    </Box>
  );
}