import { 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  Typography 
} from "@mui/material";
import type { JSX } from "react";

type Props = {
  open: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmText = "Eliminar",
  cancelText = "Cancelar",
  onCancel,
  onConfirm,
}: Props): JSX.Element {
  return (
    <Dialog 
      open={open} 
      onClose={onCancel} 
      fullWidth 
      maxWidth="xs"
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ fontWeight: "bold", pt: 3, px: 3 }}>
        {title}
      </DialogTitle>
      
      <DialogContent sx={{ px: 3, pb: 2 }}>
        <Typography variant="body1" sx={{ color: "text.primary" }}>
          {description}
        </Typography>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button 
          onClick={onCancel}
          sx={{ 
            color: "#F55345", 
            fontWeight: "bold",
            textTransform: "none",
            "&:hover": { bgcolor: "transparent", opacity: 0.8 }
          }}
        >
          {cancelText}
        </Button>
        <Button 
          onClick={onConfirm} 
          variant="contained" 
          sx={{ 
            bgcolor: "#F55345", 
            color: "white",
            fontWeight: "bold",
            textTransform: "none",
            px: 3,
            "&:hover": { bgcolor: "#d44538" }
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}