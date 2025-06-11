import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import RoomsClient from "../RoomsClient";

// Mocks de componentes secundarios
jest.mock("../../components/sections/ClientDefaultHero", () => () => <div>Mocked Hero</div>);
jest.mock("../../components/common/CompactRoom", () => ({ room }) => <div>{room.NAME}</div>);
jest.mock("../../components/common/ExpandedRoom", () => ({ room }) => <div>Expanded {room.NAME}</div>);
jest.mock("../../components/common/LoadingPage", () => () => <div>Loading...</div>);
jest.mock("../../components/common/Footer", () => () => <div>Mocked Footer</div>);
jest.mock("../../components/common/Pagination", () => ({ totalPages }) => <div>Páginas: {totalPages}</div>);

// Mock global de fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("RoomsClient - Integración", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Carga y renderiza salas correctamente", async () => {
    const mockZones = [
      { ZONE_ID: 1, NAME: "Sala A", TYPE: "conferencia", PRICE: 100 },
      { ZONE_ID: 2, NAME: "Sala B", TYPE: "banquete", PRICE: 200 }
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockZones
    });

    render(<RoomsClient />);

    // Primero se ve pantalla de carga
    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Mocked Hero")).toBeInTheDocument();
      expect(screen.getByText("Sala A")).toBeInTheDocument();
      expect(screen.getByText("Sala B")).toBeInTheDocument();
      expect(screen.getByText("Mocked Footer")).toBeInTheDocument();
    });
  });

  test("Filtra salas por nombre y tipo", async () => {
    const mockZones = [
      { ZONE_ID: 1, NAME: "Sala A", TYPE: "conferencia", PRICE: 100 },
      { ZONE_ID: 2, NAME: "Sala B", TYPE: "banquete", PRICE: 200 }
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockZones
    });

    render(<RoomsClient />);

    await waitFor(() => {
      expect(screen.getByText("Sala A")).toBeInTheDocument();
      expect(screen.getByText("Sala B")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText("Buscar por nombre..."), {
      target: { value: "Sala A" }
    });

    expect(screen.getByText("Sala A")).toBeInTheDocument();
    expect(screen.queryByText("Sala B")).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Filtrar:"), {
      target: { value: "banquete" }
    });

    expect(screen.queryByText("Sala A")).not.toBeInTheDocument();
    expect(screen.queryByText("Sala B")).not.toBeInTheDocument();
  });
});
