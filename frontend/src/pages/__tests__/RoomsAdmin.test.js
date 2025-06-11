import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import RoomsAdmin from "../RoomsAdmin";
import { BrowserRouter } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

jest.mock("jwt-decode", () => ({
  jwtDecode: jest.fn()
}));

jest.mock("../../components/common/Header", () => ({ name, lastname }) => (
  <div>Mocked Header: {name} {lastname}</div>
));
jest.mock("../../components/common/SideNav", () => ({ sections }) => (
  <div>Mocked SideNav with {sections.length} sections</div>
));
jest.mock("../../components/common/RoomCard", () => ({ name }) => (
  <div data-testid="room-card">{name}</div>
));
jest.mock("../../components/common/AddEditRoomModal", () => ({ onClose }) => (
  <div>
    Mocked Modal <button onClick={onClose}>Cerrar</button>
  </div>
));
jest.mock("../../components/common/AlertMessage", () => ({ message }) =>
  message ? <div>{message}</div> : null
);
jest.mock("../../components/common/LoadingPage", () => () => <div>Loading...</div>);
jest.mock("../../components/common/Pagination", () => ({ totalPages }) => (
  <div>{`Total páginas: ${totalPages}`}</div>
));

const mockFetch = jest.fn();
global.fetch = mockFetch;

const renderComponent = () => {
  return render(
    <BrowserRouter>
      <RoomsAdmin sections={["Dashboard", "Salas"]} />
    </BrowserRouter>
  );
};

describe("RoomsAdmin - Integración", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("Carga datos de usuario y salas correctamente", async () => {
    localStorage.setItem("token", "fake-token");
    jwtDecode.mockReturnValue({ id: 1, exp: Date.now() / 1000 + 100 });

    const userMock = {
      FIRST_NAME: "Laura",
      LAST_NAME_1: "Gómez",
      EMAIL: "laura@example.com",
      USER_TYPE: "admin"
    };

    const roomsMock = [
      {
        ZONE_ID: 1,
        NAME: "Sala A",
        TYPE: "Taller",
        CAPACITY: 10,
        PRICE: 100,
        DESCRIPTION: "Descripción A",
        ACTIVE: 1,
        IMAGE_PATH: ""
      },
      {
        ZONE_ID: 2,
        NAME: "Sala B",
        TYPE: "Reunión",
        CAPACITY: 20,
        PRICE: 200,
        DESCRIPTION: "Descripción B",
        ACTIVE: 1,
        IMAGE_PATH: ""
      }
    ];

    mockFetch
      .mockResolvedValueOnce({ ok: true, json: async () => userMock })
      .mockResolvedValueOnce({ ok: true, json: async () => roomsMock });

    renderComponent();

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Mocked Header: Laura Gómez")).toBeInTheDocument();
      expect(screen.getByText("Sala A")).toBeInTheDocument();
      expect(screen.getByText("Sala B")).toBeInTheDocument();
      expect(screen.getByText("Agregar")).toBeInTheDocument();
    });
  });

  test("Abre modal al hacer clic en 'Agregar'", async () => {
    localStorage.setItem("token", "fake-token");
    jwtDecode.mockReturnValue({ id: 1, exp: Date.now() / 1000 + 100 });

    const userMock = {
      FIRST_NAME: "Laura",
      LAST_NAME_1: "Gómez",
      EMAIL: "laura@example.com",
      USER_TYPE: "admin"
    };

    const roomsMock = [];

    mockFetch
      .mockResolvedValueOnce({ ok: true, json: async () => userMock })
      .mockResolvedValueOnce({ ok: true, json: async () => roomsMock });

    renderComponent();

    await waitFor(() => expect(screen.getByText("Agregar")).toBeInTheDocument());

    fireEvent.click(screen.getByText("Agregar"));

    expect(screen.getByText("Mocked Modal")).toBeInTheDocument();
  });
});
