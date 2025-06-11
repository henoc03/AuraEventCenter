import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import ExpandedRoom from "../ExpandedRoom";
import defaultRoomImage from "../../../assets/images/salas/default_zone.jpg";

// Mock imagen por defecto
jest.mock("../../../assets/images/salas/default_zone.jpg", () => "default-room.jpg");

// Mock del carrusel (evita renderización real)
jest.mock("../../utils/CarouselFade", () => ({ imagePaths }) => (
  <div data-testid="carousel">Carrusel con {imagePaths.length} imágenes</div>
));

describe("ExpandedRoom", () => {
  const roomBase = {
    ZONE_ID: 1,
    NAME: "Sala Magna",
    TYPE: "Auditorio",
    CAPACITY: 100,
    PRICE: 250000,
    DESCRIPTION: "Espacio ideal para eventos grandes.",
    IMAGE_PATH: "uploads/zones/sala_main.jpg"
  };

  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            { id: "main", path: "uploads/zones/sala_main.jpg" },
            { id: "1", path: "uploads/zones/sala_sec1.jpg" },
            { id: "2", path: "uploads/zones/sala_sec2.jpg" }
          ])
      })
    );
  });

  test("renderiza la sala con carrusel si hay imágenes secundarias", async () => {
    render(<ExpandedRoom room={roomBase} onClose={jest.fn()} />);

    await waitFor(() => {
      expect(screen.getByTestId("carousel")).toHaveTextContent("Carrusel con 2 imágenes");
    });

    expect(screen.getByText(/Sala Magna/i)).toBeInTheDocument();
    expect(screen.getByText(/₡250.000/)).toBeInTheDocument();
    expect(screen.getByText(/100 personas/)).toBeInTheDocument();
    expect(screen.getByText(/eventos grandes/i)).toBeInTheDocument();
  });

  test("renderiza imagen por defecto si no hay imágenes secundarias ni IMAGE_PATH", async () => {
    const roomSinImagen = { ...roomBase, IMAGE_PATH: "", ZONE_ID: 2 };

    // fetch devuelve solo una imagen principal vacía
    fetch.mockImplementationOnce(() =>
      Promise.resolve({ json: () => Promise.resolve([]) })
    );

    render(<ExpandedRoom room={roomSinImagen} onClose={jest.fn()} />);

    await waitFor(() => {
      const img = screen.getByRole("img");
      expect(img).toHaveAttribute("src", "default-room.jpg");
      expect(img).toHaveAttribute("alt", "Imagen de Sala Magna");
    });
  });

  test("llama a onClose al hacer clic en ✕", async () => {
    const onCloseMock = jest.fn();
    render(<ExpandedRoom room={roomBase} onClose={onCloseMock} />);

    const closeButton = screen.getByRole("button", { name: /✕/ });
    fireEvent.click(closeButton);

    expect(onCloseMock).toHaveBeenCalled();
  });
});
