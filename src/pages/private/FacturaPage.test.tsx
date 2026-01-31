import { render, screen, waitFor, act } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import FacturaPage from "./FacturaPage";
import * as facturaService from "../../services/factura.service";
import { UiProvider } from "../../context/UiContext";

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

jest.mock("../../services/factura.service", () => ({
  getFacturas: jest.fn()
}));

const renderComponent = () => render(
  <BrowserRouter>
    <UiProvider>
      <FacturaPage />
    </UiProvider>
  </BrowserRouter>
);

describe("FacturaPage", () => {
  beforeEach(() => jest.clearAllMocks());

  test("1. Renderizado: debe mostrar el encabezado de historial", async () => {
    (facturaService.getFacturas as jest.Mock).mockResolvedValue({ data: { items: [] } });
    await act(async () => {
      renderComponent();
    });
    expect(screen.getByText(/Historial de Facturación/i)).toBeInTheDocument();
  });

  test("2. Regla/Prop: debe mostrar los datos del cliente y el total facturado", async () => {
    const mockData = {
      data: {
        items: [
          {
            id: 1,
            razonSocial: "Natanael Navarrete",
            ruc_cedula: "1713200910",
            total: 25.50,
            fechaEmision: new Date().toISOString()
          }
        ]
      }
    };
    (facturaService.getFacturas as jest.Mock).mockResolvedValue(mockData);

    await act(async () => {
      renderComponent();
    });

    await waitFor(() => {
      expect(screen.getByText("Natanael Navarrete")).toBeInTheDocument();
      expect(screen.getByText("$25.5")).toBeInTheDocument();
    });
  });

  test("3. Interacción: debe renderizar los botones de acción para cada factura", async () => {
    const mockData = {
      data: {
        items: [{ id: 1, razonSocial: "Dae", ruc_cedula: "123", total: 10, fechaEmision: new Date().toISOString() }]
      }
    };
    (facturaService.getFacturas as jest.Mock).mockResolvedValue(mockData);

    await act(async () => {
      renderComponent();
    });

    await waitFor(() => {
      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(0);
    });
  });
});