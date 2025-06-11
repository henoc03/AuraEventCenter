import React from "react";
import { render, screen } from "@testing-library/react";
import Footer from "../Footer";
import { BrowserRouter } from "react-router-dom"; // Si usa react-router

describe("Footer", () => {
  test("renderiza correctamente el nombre de la marca", () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );
    expect(screen.getByRole("heading", { name: /Centro de Eventos Aura/i })).toBeInTheDocument();
  });

  test("muestra todos los enlaces del footer", () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );

    expect(screen.getByRole("link", { name: /Inicio/i })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: /Salas/i })).toHaveAttribute("href", "/salas");
    expect(screen.getByRole("link", { name: /Servicios/i })).toHaveAttribute("href", "/servicios");
    expect(screen.getByRole("link", { name: /Cotizaciones/i })).toHaveAttribute("href", "/cotizaciones");
    expect(screen.getByRole("link", { name: /Contacto/i })).toHaveAttribute("href", "/contacto");
  });

  test("muestra el texto de derechos reservados", () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );
    expect(screen.getByText(/© 2025 Centro de Eventos Aura/i)).toBeInTheDocument();
  });
});
