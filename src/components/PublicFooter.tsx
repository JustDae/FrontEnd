import { Box, Typography } from "@mui/material";

export function PublicFooter(): JSX.Element {
  return (
    <Box
      component="footer"
      sx={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        height: 56,
        bgcolor: "background.paper",
        borderTop: "1px solid",
        borderColor: "divider",
        display: "flex",
        alignItems: "center",
        px: 2, /* sin espacio externo; solo padding interno controlado */
        zIndex: (theme) => theme.zIndex.appBar - 1,
      }}
    >
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ width: "100%", textAlign: "center" }}
      >
        © {new Date().getFullYear()} — Blog App
      </Typography>
    </Box>
  );
}
