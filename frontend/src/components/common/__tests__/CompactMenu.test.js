import React from "react";
import { render, screen } from "@testing-library/react";
import CompactMenu from "../CompactMenu";
import defaultImage from "../../../assets/images/default_no_image.jpg";

// Mocks para evitar error de importación de imágenes en tests
jest.mock("../../../assets/images/default_no_image.jpg", () => "default-image.jpg");

describe("CompactMenu", () => {
  const baseMenu = {
    NAME: "Menú Ejecutivo",
    IMAGE_PATH: "uploads/menus/imagen.jpg",
  };

  test("renderiza correctamente con imagen personalizada", () => {
    render(<CompactMenu menu={baseMenu} />);

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "http://localhost:1522/uploads/menus/imagen.jpg");
    expect(img).toHaveAttribute("alt", "Imagen de Menú Ejecutivo");
    expect(screen.getByText(/Menú Ejecutivo/i)).toBeInTheDocument();
    expect(screen.getByText(/Ver más/i)).toBeInTheDocument();
  });

  test("renderiza la imagen por defecto si IMAGE_PATH está vacío", () => {
    const menuSinImagen = { ...baseMenu, IMAGE_PATH: "" };

    render(<CompactMenu menu={menuSinImagen} />);

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "default-image.jpg");
  });
});
