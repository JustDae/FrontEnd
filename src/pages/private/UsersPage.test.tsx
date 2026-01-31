import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import UsersPage from "./UsersPage";
import * as usersService from "../../services/users.service";
import { UiProvider } from "../../context/UiContext";

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

jest.mock("../../services/users.service", () => ({
  getUsers: jest.fn(),
  getRoles: jest.fn(),
  getUserImageUrl: jest.fn()
}));

const renderComponent = () => render(
  <BrowserRouter>
    <UiProvider>
      <UsersPage />
    </UiProvider>
  </BrowserRouter>
);

describe("UsersPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (usersService.getRoles as jest.Mock).mockResolvedValue([]);
  });

  test("1. Renderizado: debe mostrar el encabezado de Gestión de Usuarios", async () => {
    (usersService.getUsers as jest.Mock).mockResolvedValue({ data: { items: [] } });
    renderComponent();
    expect(screen.getByText(/Gestión de Usuarios/i)).toBeInTheDocument();
  });

  test("2. Regla/Prop: debe listar los usuarios (username y email) del mock", async () => {
    const mockUsers = {
      data: {
        items: [
          { id: "1", username: "natanael", email: "natanael@mail.com", rol: { nombre: "ADMIN" } }
        ]
      }
    };
    (usersService.getUsers as jest.Mock).mockResolvedValue(mockUsers);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("natanael")).toBeInTheDocument();
      expect(screen.getByText("natanael@mail.com")).toBeInTheDocument();
    });
  });

  test("3. Interacción: debe permitir abrir el formulario de Nuevo Usuario", async () => {
    (usersService.getUsers as jest.Mock).mockResolvedValue({ data: { items: [] } });

    const user = userEvent.setup();
    renderComponent();

    const btn = screen.getByRole("button", { name: /nuevo usuario/i });
    await user.click(btn);

    const modalTitle = await screen.findByRole("heading", { name: /nuevo usuario/i });
    expect(modalTitle).toBeInTheDocument();
  });
});