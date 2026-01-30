import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import PedidosPage from "./PedidosPage";
import * as pedidosService from "../../services/pedidos.service";
import { UiProvider } from "../../context/UiContext";

const mockedNavigate = jest.fn();
jest.mock("../../services/pedidos.service", () => ({
  getPedidos: jest.fn(),
  createPedido: jest.fn()
}));
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

const renderComponent = () => render(
  <BrowserRouter><UiProvider><PedidosPage /></UiProvider></BrowserRouter>
);

describe("PedidosPage", () => {
  beforeEach(() => jest.clearAllMocks());

  test("1. Renderizado: debe mostrar el título de Órdenes", async () => {
    (pedidosService.getPedidos as jest.Mock).mockResolvedValue({ data: [] });
    renderComponent();
    expect(screen.getByText(/Órdenes/i)).toBeInTheDocument();
  });

  test("2. Regla/Prop: debe mostrar datos del servicio mockeado", async () => {
    const mockData = [{ id: "1", nombre_cliente: "Dae", total: 10, createdAt: new Date().toISOString() }];
    (pedidosService.getPedidos as jest.Mock).mockResolvedValue({ data: mockData });
    renderComponent();
    await waitFor(() => expect(screen.getByText("Dae")).toBeInTheDocument());
  });

  test("3. Interacción: debe abrir el modal al hacer clic en Abrir Mesa", async () => {
    (pedidosService.getPedidos as jest.Mock).mockResolvedValue({ data: [] });
    const user = userEvent.setup();
    renderComponent();
    await user.click(screen.getByRole("button", { name: /abrir mesa/i }));
    expect(screen.getByText(/Nueva Orden/i)).toBeInTheDocument();
  });
});