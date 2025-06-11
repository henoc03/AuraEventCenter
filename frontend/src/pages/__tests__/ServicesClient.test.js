// src/pages/__tests__/ServicesClient.test.js
import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import ServicesClient from "../ServicesClient";
import { BrowserRouter } from "react-router-dom";

// Mock Hero y Footer para evitar errores de imagen y AOS
jest.mock("../../components/sections/ClientDefaultHero", () => () => <div>Mocked Hero</div>);
jest.mock("../../components/common/Footer", () => () => <div>Mocked Footer</div>);
jest.mock("../../components/common/LoadingPage", () => () => <div>Loading...</div>);

const mockServices = [
  {
    ADDITIONAL_SERVICE_ID: 1,
    name: "Decoración",
    description: "Servicio de decoración para eventos.",
    price: 50000,
    imagePath: "", // usa imagen por defecto
  },
  {
    ADDITIONAL_SERVICE_ID: 2,
    name: "Catering Premium",
    description: "Servicio de catering gourmet.",
    price: 150000,
    imagePath: "services/catering.jpg",
  },
];

describe("ServicesClient - Integración", () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockServices),
      })
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  function renderWithRouter(ui) {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
  }

  test("Carga y renderiza servicios correctamente", async () => {
    renderWithRouter(<ServicesClient />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Mocked Hero")).toBeInTheDocument();
      expect(screen.getByText("Conoce nuestros servicios")).toBeInTheDocument();
      expect(screen.getByText("Decoración")).toBeInTheDocument();
      expect(screen.getByText("Catering Premium")).toBeInTheDocument();
      expect(screen.getByText(/₡\s*50[ ,]?000/)).toBeInTheDocument();
      expect(screen.getByText(/₡\s*150[ ,]?000/)).toBeInTheDocument();
      expect(screen.getByText("Mocked Footer")).toBeInTheDocument();
    });
  });

  test("Filtra servicios por nombre y ordena por precio", async () => {
    renderWithRouter(<ServicesClient />);

    await waitFor(() => {
      expect(screen.getByText("Decoración")).toBeInTheDocument();
    });

    // Buscar servicio
    fireEvent.change(screen.getByLabelText(/Buscar/i), {
      target: { value: "catering" },
    });

    expect(screen.queryByText("Decoración")).not.toBeInTheDocument();
    expect(screen.getByText("Catering Premium")).toBeInTheDocument();

    // Cambiar orden a descendente
    fireEvent.change(screen.getByLabelText(/Ordenar/i), {
      target: { value: "desc" },
    });

    const prices = screen.getAllByText((text) => text.includes("₡"));
    expect(prices[0]).toHaveTextContent(/₡\s*150[ ,]?000/);
  });
});
