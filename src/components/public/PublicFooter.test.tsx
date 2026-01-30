import { render, screen } from "@testing-library/react";
import PublicFooter from "./PublicFooter";
import { ThemeProvider, createTheme } from "@mui/material";

const theme = createTheme();

const renderComponent = () => render(
  <ThemeProvider theme={theme}>
    <PublicFooter />
  </ThemeProvider>
);

describe("PublicFooter Component", () => {
  test("1. Renderizado: debe mostrar el contenido del pie de página", () => {
    renderComponent();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  test("2. Regla/Props: debe mostrar el texto de derechos con el año actual", () => {
    renderComponent();
    const currentYear = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(currentYear))).toBeInTheDocument();
    expect(screen.getByText(/Todos los Derechos Reservados/i)).toBeInTheDocument();
  });

  test("3. Estilos: debe tener el color de fondo específico", () => {
    renderComponent();
    const footer = screen.getByRole("contentinfo");
    expect(footer).toHaveStyle("background-color: rgb(250, 230, 225)");
  });
});