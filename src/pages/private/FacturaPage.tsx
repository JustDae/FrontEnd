import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Chip } from "@mui/material";
import { Visibility, Print, ReceiptLong } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { getFacturas } from "../../services/factura.service";

export default function FacturaPage() {
  const [facturas, setFacturas] = useState([]);

  useEffect(() => {
    getFacturas().then(res => setFacturas(res.data.items || []));
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 900, mb: 4 }}>Historial de Facturación</Typography>

      <TableContainer component={Paper} sx={{ borderRadius: "15px" }}>
        <Table>
          <TableHead sx={{ bgcolor: "#2d3436" }}>
            <TableRow>
              <TableCell sx={{ color: "white" }}>ID</TableCell>
              <TableCell sx={{ color: "white" }}>Fecha</TableCell>
              <TableCell sx={{ color: "white" }}>Cliente</TableCell>
              <TableCell sx={{ color: "white" }}>RUC/CI</TableCell>
              <TableCell sx={{ color: "white" }}>Total</TableCell>
              <TableCell sx={{ color: "white" }} align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {facturas.map((f: any) => (
              <TableRow key={f.id}>
                <TableCell>#{f.id}</TableCell>
                <TableCell>{new Date(f.fechaEmision).toLocaleDateString()}</TableCell>
                <TableCell>{f.razonSocial}</TableCell>
                <TableCell>{f.ruc_cedula}</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>${f.total}</TableCell>
                <TableCell align="center">
                  <IconButton color="primary"><Visibility /></IconButton>
                  <IconButton><Print /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}