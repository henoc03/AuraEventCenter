import React from "react";
import { render, screen } from "@testing-library/react";
import CompactRoom from "../CompactRoom";
import defaultImage from "../../../assets/images/salas/default_zone.jpg";

// Mock para evitar error de importación de imagen
jest.mock("../../../assets/images/salas/default_zone.jpg", () => "default-room.jpg");

describe("CompactRoom", () => {
  const roomBase = {
    NAME: "Sala Magna",
    IMAGE_PATH: "uploads/zones/sala.jpg",
  };

  test("renderiza correctamente con imagen personalizada", () => {
    render(<CompactRoom room={roomBase} />);

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "http://localhost:1522/uploads/zones/sala.jpg");
    expect(img).toHaveAttribute("alt", "Imagen de Sala Magna");
    expect(screen.getByText(/Sala Magna/i)).toBeInTheDocument();
    expect(screen.getByText(/Ver más/i)).toBeInTheDocument();
  });

  test("renderiza imagen por defecto si IMAGE_PATH está vacío", () => {
    const roomSinImagen = { ...roomBase, IMAGE_PATH: "" };
    render(<CompactRoom room={roomSinImagen} />);

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "default-room.jpg");
  });
});
