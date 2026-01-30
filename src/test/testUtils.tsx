import React, { type PropsWithChildren } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

type RouterOptions = {
  route?: string;
};

export function renderWithRouter(
  ui: React.ReactElement,
  { route = "/" }: RouterOptions = {},
  options?: Omit<RenderOptions, "wrapper">
) {
  function Wrapper({ children }: PropsWithChildren) {
    return <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>;
  }
  return render(ui, { wrapper: Wrapper, ...options });
}