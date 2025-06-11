import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import AdminDashboard from "../AdminDashBoard";
import { jwtDecode } from "jwt-decode";

// ✅ Mocks necesarios
jest.mock("jwt-decode", () => ({
  jwtDecode: jest.fn(),
}));
jest.mock("../../components/common/SideNav", () => () => <div>Mocked SideNav</div>);
jest.mock("../../components/common/Header", () => ({ name, lastname }) => (
  <div>Mocked Header {name} {lastname}</div>
));
jest.mock("../../components/common/LoadingPage", () => () => <div>Loading...</div>);

// ✅ Mock explícito de react-chartjs-2
jest.mock("react-chartjs-2", () => ({
  Bar: () => <div>Mocked Chart</div>,
}));

// Simula fetch global
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("Integración - AdminDashboard.jsx", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("Renderiza correctamente datos del dashboard con datos reales", async () => {
    localStorage.setItem("token", "token-falso");
    jwtDecode.mockReturnValue({ id: 1, exp: Date.now() / 1000 + 60 });

    const stats = { users: 3, activeRooms: 2, eventsThisWeek: 1 };
    const topRooms = [
      { roomName: "Sala A", reservations: 5 },
      { roomName: "Sala B", reservations: 3 },
    ];
    const weeklyReservations = [
      { status: "Confirmado", owner: "Luis", date: "2025-06-10" },
    ];
    const user = {
      FIRST_NAME: "Ana",
      LAST_NAME_1: "García",
      USER_TYPE: "Admin",
      EMAIL: "ana@demo.com"
    };

    mockFetch
      .mockResolvedValueOnce({ ok: true, json: async () => stats })
      .mockResolvedValueOnce({ ok: true, json: async () => weeklyReservations })
      .mockResolvedValueOnce({ ok: true, json: async () => topRooms })
      .mockResolvedValueOnce({ ok: true, json: async () => user });

    render(<AdminDashboard sections={["Dashboard", "Reservas"]} />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Mocked Header Ana García")).toBeInTheDocument();
      expect(screen.getByText("Usuarios registrados")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
      expect(screen.getByText("Salas activas")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("Eventos esta semana")).toBeInTheDocument();
      expect(screen.getByText("1")).toBeInTheDocument();

      expect(screen.getByText("Mocked Chart")).toBeInTheDocument();
      expect(screen.getByText("Luis")).toBeInTheDocument();
      expect(screen.getByText("2025-06-10")).toBeInTheDocument();
      expect(screen.getByText("Ver todas las reservas")).toBeInTheDocument();
    });
  });
});
