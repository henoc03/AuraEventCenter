import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import MenusAdmin from "../MenusAdmin";
import { BrowserRouter } from "react-router-dom";

// ✅ CORRECCIÓN: mock adecuado de jwtDecode
jest.mock("jwt-decode", () => ({
  jwtDecode: jest.fn(),
}));

import { jwtDecode } from "jwt-decode";

// Mocks de componentes comunes
jest.mock("../../components/common/Header", () => ({ name }) => <div>Mocked Header {name}</div>);
jest.mock("../../components/common/SideNav", () => () => <div>Mocked SideNav</div>);
jest.mock("../../components/common/LoadingPage", () => () => <div>Loading...</div>);
jest.mock("../../components/common/AlertMessage", () => ({ message }) => message ? <div>{message}</div> : null);
jest.mock("../../components/common/MenuAdminCard", () => ({ menu }) => <div>{menu.NAME}</div>);
jest.mock("../../components/common/AddEditMenuModal", () => () => <div>Mocked AddEditMenuModal</div>);
jest.mock("../../components/common/Pagination", () => ({ totalPages }) => <div>Total páginas: {totalPages}</div>);

// Mock de fetch global
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Helper para envolver en router
const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("MenusAdmin - Integración", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("Carga usuario, menús y renderiza correctamente", async () => {
    localStorage.setItem("token", "fake-token");
    jwtDecode.mockReturnValue({ id: 1, exp: Date.now() / 1000 + 100 });

    const userMock = {
      FIRST_NAME: "Laura",
      LAST_NAME_1: "Sánchez",
      USER_TYPE: "admin",
      EMAIL: "laura@test.com",
    };

    const menusMock = [
      { MENU_ID: 1, NAME: "Desayuno típico", TYPE: "desayuno", PRICE: 2500 },
      { MENU_ID: 2, NAME: "Almuerzo ejecutivo", TYPE: "almuerzo", PRICE: 3500 },
      { MENU_ID: 3, NAME: "Cena ligera", TYPE: "cena", PRICE: 3000 }
    ];

    mockFetch
      .mockResolvedValueOnce({ ok: true, json: async () => userMock })  // fetch /users/1
      .mockResolvedValueOnce({ ok: true, json: async () => menusMock }); // fetch /menus

    renderWithRouter(<MenusAdmin sections={["Menús", "Usuarios"]} />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Mocked Header Laura")).toBeInTheDocument();
      expect(screen.getByText("Desayuno típico")).toBeInTheDocument();
      expect(screen.getByText("Almuerzo ejecutivo")).toBeInTheDocument();
      expect(screen.getByText("Cena ligera")).toBeInTheDocument();
    });
  });

  test("Filtra correctamente los menús por nombre", async () => {
    localStorage.setItem("token", "fake-token");
    jwtDecode.mockReturnValue({ id: 1, exp: Date.now() / 1000 + 100 });

    const userMock = {
      FIRST_NAME: "Laura",
      LAST_NAME_1: "Sánchez",
      USER_TYPE: "admin",
      EMAIL: "laura@test.com",
    };

    const menusMock = [
      { MENU_ID: 1, NAME: "Desayuno típico", TYPE: "desayuno", PRICE: 2500 },
      { MENU_ID: 2, NAME: "Cena ligera", TYPE: "cena", PRICE: 3000 }
    ];

    mockFetch
      .mockResolvedValueOnce({ ok: true, json: async () => userMock })
      .mockResolvedValueOnce({ ok: true, json: async () => menusMock });

    renderWithRouter(<MenusAdmin sections={[]} />);

    await waitFor(() => {
      expect(screen.getByText("Desayuno típico")).toBeInTheDocument();
      expect(screen.getByText("Cena ligera")).toBeInTheDocument();
    });

    // Simula búsqueda
    const input = screen.getByPlaceholderText("Buscar por nombre...");
    fireEvent.change(input, { target: { value: "cena" } });

    expect(screen.queryByText("Desayuno típico")).not.toBeInTheDocument();
    expect(screen.getByText("Cena ligera")).toBeInTheDocument();
  });
});
