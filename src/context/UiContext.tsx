import { Alert, Snackbar } from "@mui/material";
import { createContext, useContext, useMemo, useState, type JSX } from "react";

type UiState = {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info" | "warning";
};

type UiContextValue = {
  notify: (payload: { message: string; severity?: UiState["severity"] }) => void;
};

const UiContext = createContext<UiContextValue | null>(null);

export function UiProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [state, setState] = useState<UiState>({
    open: false,
    message: "",
    severity: "info",
  });

  const notify = (payload: { message: string; severity?: UiState["severity"] }) => {
    setState({
      open: true,
      message: payload.message,
      severity: payload.severity || "info",
    });
  };

  const value = useMemo(() => ({ notify }), []);

  return (
    <UiContext.Provider value={value}>
      {children}

      <Snackbar
        open={state.open}
        autoHideDuration={2500}
        onClose={() => setState((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setState((s) => ({ ...s, open: false }))}
          severity={state.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {state.message}
        </Alert>
      </Snackbar>
    </UiContext.Provider>
  );
}

export function useUi(): UiContextValue {
  const ctx = useContext(UiContext);
  if (!ctx) throw new Error("useUi debe usarse dentro de UiProvider");
  return ctx;
}