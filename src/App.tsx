import { useRoutes } from "react-router-dom";
import { appRoutes } from "./routes/app.routes";
import { AuthProvider } from "./context/AuthContext";
import { UiProvider } from "./context/UiContext";
import type { JSX } from "react/jsx-runtime";

export default function App(): JSX.Element {
  const element = useRoutes(appRoutes);

  return (
    <AuthProvider>
      <UiProvider>{element}</UiProvider>
    </AuthProvider>
  );
}