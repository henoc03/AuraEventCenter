import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Administrators from "../Administrator";
import jwtDecode from "jwt-decode";

// ✅ Mock correcto para default import
jest.mock("jwt-decode", () => jest.fn());

jest.mock("../../components/common/SideNav", () => () => <div>Mocked SideNav</div>);
jest.mock("../../components/common/Header", () => ({ name, lastname }) => (
  <div>Mocked Header {name} {lastname}</div>
));
jest.mock("../../components/common/LoadingPage", () => () => <div>Loading...</div>);
jest.mock("../../components/sections/Users", () => ({ users, title }) => (
  <div>
    <h2>{title}</h2>
    {users.map(user => (
      <div key={user.USER_ID}>{`${user.FIRST_NAME} ${user.LAST_NAME_1}${user.LAST_NAME_2 ? " " + user.LAST_NAME_2 : ""}`}</div>
    ))}
  </div>
));
jest.mock("../../components/common/UserModal", () => () => <div>Mocked UserModal</div>);
jest.mock("../../components/common/AlertMessage", () => ({ message }) =>
  message ? <div>{message}</div> : null
);
jest.mock("../../components/common/Pagination", () => ({ totalPages }) =>
  <div>{`Total páginas: ${totalPages}`}</div>
);

// Global fetch mock
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("Administrators Page - Integración", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("Carga y renderiza usuarios administradores correctamente", async () => {
    localStorage.setItem("token", "fake-token");
    jwtDecode.mockReturnValue({ id: 1, exp: Date.now() / 1000 + 100 });

    const mockLoggedUser = {
      FIRST_NAME: "Admin",
      LAST_NAME_1: "Test",
      USER_TYPE: "admin",
      EMAIL: "admin@test.com"
    };

    const mockAdmins = [
      {
        USER_ID: 100,
        FIRST_NAME: "Juan",
        LAST_NAME_1: "Pérez",
        LAST_NAME_2: "Ramírez",
        EMAIL: "juan@test.com",
        PHONE: "8888-8888",
        ACTIVE: 1
      },
      {
        USER_ID: 101,
        FIRST_NAME: "María",
        LAST_NAME_1: "López",
        LAST_NAME_2: null,
        EMAIL: "maria@test.com",
        PHONE: "7777-7777",
        ACTIVE: 0
      }
    ];

    mockFetch
      .mockResolvedValueOnce({ ok: true, json: async () => mockLoggedUser })
      .mockResolvedValueOnce({ ok: true, json: async () => mockAdmins });

    render(<Administrators sections={["Dashboard", "Usuarios"]} />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Mocked Header Admin Test")).toBeInTheDocument();
      expect(screen.getByText("Administradores")).toBeInTheDocument();

      // Verificación de nombres formateados
      expect(screen.getByText("Juan Pérez Ramírez")).toBeInTheDocument();
      expect(screen.getByText("María López")).toBeInTheDocument();

      expect(screen.getByText("Mocked SideNav")).toBeInTheDocument();
      expect(screen.getByText("Mocked UserModal")).toBeInTheDocument();
    });
  });

  test("Elimina token si está expirado", async () => {
    localStorage.setItem("token", "expired-token");
    jwtDecode.mockReturnValue({ id: 1, exp: Date.now() / 1000 - 10 });

    mockFetch.mockResolvedValue({ ok: true, json: async () => ({}) });

    render(<Administrators sections={[]} />);

    await waitFor(() => {
      expect(localStorage.getItem("token")).toBeNull();
    });
  });
});
