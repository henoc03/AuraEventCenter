import React from "react";
import { render, screen } from "@testing-library/react";
import Auth from "../Auth";

// Mock del logo (puedes ajustar la ruta si usas alias)
jest.mock("../../icons/Logo", () => (props) => (
  <svg data-testid="logo" {...props}></svg>
));

describe("Auth component", () => {
  test("renderiza el título y los children correctamente", () => {
    render(
      <Auth title="Iniciar sesión">
        <p>Formulario de login</p>
      </Auth>
    );

    // Verifica el título
    expect(screen.getByText(/Iniciar sesión/i)).toBeInTheDocument();

    // Verifica el contenido dentro del children
    expect(screen.getByText(/Formulario de login/i)).toBeInTheDocument();

    // Verifica que el logo esté dentro de un link hacia "/"
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/");

    // Verifica que el logo se haya renderizado
    expect(screen.getByTestId("logo")).toBeInTheDocument();
  });
});
