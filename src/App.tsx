import { useRoutes } from "react-router-dom";
import { appRoutes } from "./routes/app.routes";
import { AuthProvider } from "./context/AuthContext";
import { UiProvider } from "./context/UiContext";

export default function App(): JSX.Element {
  const element = useRoutes(appRoutes);

  return (
    <AuthProvider>
      <UiProvider>{element}</UiProvider>
    </AuthProvider>
  );
}