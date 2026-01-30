import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import PublicHeader from "./PublicHeader";

const renderComponent = () => render(
  <BrowserRouter>
    <PublicHeader />
  </BrowserRouter>
);

describe("PublicHeader Component", () => {
  test("1. Renderizado: debe mostrar el logo y el nombre del restaurante MixBowls", () => {
    renderComponent();
    expect(screen.getByText(/MixBowls/i)).toBeInTheDocument();
    expect(screen.getByAltText(/logo/i)).toBeInTheDocument();
  });

  test("2. Regla/Props: debe mostrar los enlaces de navegación principales", () => {
    renderComponent();
    expect(screen.getByText(/Inicio/i)).toBeInTheDocument();
    expect(screen.getByText(/Menú/i)).toBeInTheDocument();
    expect(screen.getByText(/Nosotros/i)).toBeInTheDocument();
  });

  test("3. Interacción: debe mostrar botones de Login y Registro", () => {
    renderComponent();
    
    const loginBtn = screen.getByText(/Login/i);
    const registerBtn = screen.getByText(/Registro/i);
    
    expect(loginBtn).toBeInTheDocument();
    expect(registerBtn).toBeInTheDocument();

    fireEvent.click(loginBtn);
    expect(window.location.pathname).toBe("/auth/login");
  });
});