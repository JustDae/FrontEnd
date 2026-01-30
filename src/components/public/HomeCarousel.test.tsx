import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

jest.mock("swiper/react", () => ({
  Swiper: ({ children }: any) => <div data-testid="mock-swiper">{children}</div>,
  SwiperSlide: ({ children }: any) => <div data-testid="mock-slide">{children}</div>,
}));

jest.mock("swiper/modules", () => ({
  Autoplay: (props: any) => props,
  Pagination: (props: any) => props,
  EffectFade: (props: any) => props,
  Navigation: (props: any) => props,
}));

jest.mock("swiper/css", () => ({}));
jest.mock("swiper/css/pagination", () => ({}));
jest.mock("swiper/css/effect-fade", () => ({}));

import { HomeCarousel } from "./HomeCarousel";

const renderComponent = () => render(
  <BrowserRouter>
    <HomeCarousel />
  </BrowserRouter>
);

describe("HomeCarousel Component", () => {
  test("1. Renderizado: debe mostrar los títulos de las especialidades", () => {
    renderComponent();
    expect(screen.getByText(/Especialidad de la Casa/i)).toBeInTheDocument();
    expect(screen.getByText(/Postres Irresistibles/i)).toBeInTheDocument();
  });

  test("2. Regla/Props: debe renderizar las imágenes con sus nombres", () => {
    renderComponent();
    const images = screen.getAllByRole("img");
    expect(images[0]).toHaveAttribute("alt", "Especialidad de la Casa");
  });

  test("3. Interacción: debe permitir hacer clic en el botón de Explorar Menú", () => {
    renderComponent();
    const buttons = screen.getAllByRole("button", { name: /Explorar Menú/i });
    fireEvent.click(buttons[0]);
  });
});