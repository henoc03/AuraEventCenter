import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Navigation from "../Navigation";
import { BrowserRouter } from "react-router-dom";

// Mock del logo
jest.mock("../../icons/Logo", () => () => <div data-testid="logo">LOGO</div>);

// Mock del DropDownMenu
jest.mock("../DropDownMenu", () => ({ name, email, onLogout }) => (
  <div data-testid="dropdown-menu">
    <span>{name}</span>
    <span>{email}</span>
    <button onClick={onLogout}>Cerrar sesión</button>
  </div>
));

// Mock de navigationLinks
jest.mock("../../utils/content", () => [
  { id: 1, href: "/", link: "Inicio" },
  { id: 2, href: "/salas", link: "Salas" },
]);

// Mock de useNavigate y useLocation
const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const original = jest.requireActual("react-router-dom");
  return {
    ...original,
    useNavigate: () => mockedNavigate,
    useLocation: () => ({ pathname: "/" }),
  };
});

describe("Navigation", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

  test("renderiza logo, enlaces y botón de sesión si no hay usuario", () => {
    renderWithRouter(<Navigation />);
    expect(screen.getByTestId("logo")).toBeInTheDocument();
    expect(screen.getByText("Inicio")).toBeInTheDocument();
    expect(screen.getByText("Salas")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  test("muestra DropDownMenu si hay usuario cliente autenticado", () => {
    const fakeToken = {
      userType: "cliente",
      firstName: "Juan",
      email: "juan@example.com",
      exp: Math.floor(Date.now() / 1000) + 3600,
    };
    const encodedToken = `header.${btoa(JSON.stringify(fakeToken))}.signature`;
    localStorage.setItem("token", encodedToken);

    renderWithRouter(<Navigation />);
    expect(screen.getByTestId("dropdown-menu")).toBeInTheDocument();
    expect(screen.getByText("Juan")).toBeInTheDocument();
    expect(screen.getByText("juan@example.com")).toBeInTheDocument();
  });

  test("cambia estado de hamburguesa al hacer clic", () => {
    const { container } = renderWithRouter(<Navigation />);
    const lines = container.querySelectorAll(".line");

    const hamburger = screen.getByRole("button", { hidden: true });
    fireEvent.click(hamburger);

    expect(lines.length).toBeGreaterThan(0);
  });

  test("navega al iniciar sesión", () => {
    renderWithRouter(<Navigation />);
    const signInBtn = screen.getByRole("button", { name: /iniciar sesión/i });
    fireEvent.click(signInBtn);

    expect(mockedNavigate).toHaveBeenCalledWith("/iniciar-sesion");
  });

  test("agrega clase scrolled cuando se hace scroll", () => {
    renderWithRouter(<Navigation />);
    fireEvent.scroll(window, { target: { scrollY: 2000 } });

    fireEvent.scroll(window);
  });
});
