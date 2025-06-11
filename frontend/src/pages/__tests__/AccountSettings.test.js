import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AccountSettings from "../AccountSettings";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

jest.mock("jwt-decode", () => jest.fn());

jest.mock("../../components/common/SideNav.jsx", () => () => <div>Mocked SideNav</div>);
jest.mock("../../components/common/Header", () => () => <div>Mocked Header</div>);

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("AccountSettings Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("renders AccountSettings component", () => {
    render(<AccountSettings sections={[]} />);
    expect(screen.getByText("Mocked Header")).toBeInTheDocument();
    const sideNavs = screen.getAllByText("Mocked SideNav");
    expect(sideNavs.length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText("Configuración de la cuenta")).toBeInTheDocument();
  });

  test("fetches user info with valid token", async () => {
    const mockUser = {
      FIRST_NAME: "John",
      LAST_NAME_1: "Doe",
      USER_TYPE: "Admin",
      EMAIL: "john@example.com"
    };
    jwtDecode.mockReturnValue({ id: 1, exp: Date.now() / 1000 + 60 });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockUser),
    });

    localStorage.setItem("token", "fake-token");

    render(<AccountSettings sections={[]} />);

    await waitFor(() =>
      expect(mockFetch).toHaveBeenCalledWith("http://localhost:1522/users/1")
    );
    expect(screen.getByText("Mocked Header")).toBeInTheDocument();
  });

  test("handles expired token", async () => {
    jwtDecode.mockReturnValue({ exp: Date.now() / 1000 - 60 });
    render(<AccountSettings sections={[]} />);
    await waitFor(() => expect(localStorage.getItem("token")).toBeNull());
  });

  test("shows confirm modal on delete button click", () => {
    render(<AccountSettings sections={[]} />);
    const deleteButton = screen.getByText("Eliminar cuenta");
    fireEvent.click(deleteButton);
    expect(screen.getByText("¿Estás seguro?")).toBeInTheDocument();
  });

  test("shows password modal after confirming deletion", () => {
    render(<AccountSettings sections={[]} />);
    fireEvent.click(screen.getByText("Eliminar cuenta"));
    fireEvent.click(screen.getByText("Continuar"));
    expect(screen.getByText("Confirmar eliminación")).toBeInTheDocument();
  });

  test("handles invalid password during account deletion", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: jest.fn().mockResolvedValue({ message: "Invalid password" }),
    });

    render(<AccountSettings sections={[]} />);
    fireEvent.click(screen.getByText("Eliminar cuenta"));
    fireEvent.click(screen.getByText("Continuar"));

    const passwordInput = screen.getByPlaceholderText("Contraseña");
    fireEvent.change(passwordInput, { target: { value: "wrong-password" } });

    const deleteConfirmButtons = screen.getAllByText("Eliminar cuenta");
    fireEvent.click(deleteConfirmButtons[1]);

    await waitFor(() =>
      expect(screen.getByText("Invalid password")).toBeInTheDocument()
    );
  });
});
