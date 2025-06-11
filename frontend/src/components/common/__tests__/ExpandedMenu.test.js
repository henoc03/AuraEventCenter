import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ExpandedMenu from "../ExpandedMenu";
import menuDefaultImage from "../../../assets/images/default_no_image.jpg";

// Mock de la imagen por defecto
jest.mock("../../../assets/images/default_no_image.jpg", () => "default-menu.jpg");

describe("ExpandedMenu", () => {
  const baseMenu = {
    NAME: "Menú Ejecutivo",
    PRICE: 5000,
    AVAILABLE: 1,
    DESCRIPTION: "Un menú delicioso para ejecutivos.",
    IMAGE_PATH: "uploads/menus/menu_ejecutivo.jpg",
    PRODUCTS: [
      { NAME: "Arroz con pollo" },
      { NAME: "Refresco natural" },
    ],
  };

  test("renderiza todos los elementos correctamente", () => {
    render(<ExpandedMenu menu={baseMenu} onClose={jest.fn()} />);

    expect(screen.getByText(/Menú Ejecutivo/i)).toBeInTheDocument();
    expect(screen.getByText(/₡5.000/)).toBeInTheDocument();
    expect(screen.getByText(/Disponible/)).toBeInTheDocument();
    expect(screen.getByText(/Un menú delicioso/i)).toBeInTheDocument();
    expect(screen.getByText(/Arroz con pollo/i)).toBeInTheDocument();
    expect(screen.getByText(/Refresco natural/i)).toBeInTheDocument();

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "http://localhost:1522/uploads/menus/menu_ejecutivo.jpg");
    expect(img).toHaveAttribute("alt", "Imagen de Menú Ejecutivo");
  });

  test("usa imagen por defecto si IMAGE_PATH está vacío", () => {
    const menuSinImagen = { ...baseMenu, IMAGE_PATH: "" };
    render(<ExpandedMenu menu={menuSinImagen} onClose={jest.fn()} />);

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "default-menu.jpg");
  });

  test("muestra mensaje si no hay productos", () => {
    const menuSinProductos = { ...baseMenu, PRODUCTS: [] };
    render(<ExpandedMenu menu={menuSinProductos} onClose={jest.fn()} />);

    expect(screen.getByText(/No hay productos/i)).toBeInTheDocument();
  });

  test("ejecuta onClose al hacer clic en ✕", () => {
    const onCloseMock = jest.fn();
    render(<ExpandedMenu menu={baseMenu} onClose={onCloseMock} />);

    const closeButton = screen.getByRole("button");
    fireEvent.click(closeButton);

    expect(onCloseMock).toHaveBeenCalled();
  });
});