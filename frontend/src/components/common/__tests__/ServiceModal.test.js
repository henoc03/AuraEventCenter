import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ServiceModal from "../ServiceModal";
import { BrowserRouter } from "react-router-dom";

// Mock de imagen por defecto
jest.mock("../../../assets/images/salas/default_zone.jpg", () => "default-service.jpg");

// Mock de navegación
const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const original = jest.requireActual("react-router-dom");
  return {
    ...original,
    useNavigate: () => mockedNavigate,
  };
});

describe("ServiceModal", () => {
  const serviceMock = {
    name: "Servicio de Catering",
    description: "Servicio completo de alimentación para eventos.",
    price: "15000",
    imagePath: "uploads/services/catering.jpg",
    active: 1,
  };

  const setup = (mode = "add", overrides = {}) => {
    const props = {
      isOpen: true,
      mode,
      service: serviceMock,
      onClose: jest.fn(),
      onDelete: jest.fn(),
      onSave: jest.fn(),
      ...overrides,
    };

    render(
      <BrowserRouter>
        <ServiceModal {...props} />
      </BrowserRouter>
    );

    return props;
  };

  test("renderiza el formulario vacío en modo add", () => {
    setup("add");
    expect(screen.getByText(/Agregar Servicio/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Registrar/i })).toBeDisabled();
  });

  test("envía el formulario correctamente en modo add", async () => {
    const { onSave } = setup("add");

    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: "Agua" } });
    fireEvent.change(screen.getByLabelText(/Descripción/i), {
      target: { value: "Servicio de agua embotellada para eventos con logística completa disponible" },
    });
    fireEvent.change(screen.getByLabelText(/Precio/i), { target: { value: "5000" } });

    const submitBtn = screen.getByRole("button", { name: /Registrar/i });

    await waitFor(() => expect(submitBtn).not.toBeDisabled());
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Agua",
          description: expect.any(String),
          price: 5000,
          imagePath: null,
          active: 1,
        })
      );
    });
  });

  test("renderiza correctamente los detalles en modo view", () => {
    setup("view");
    expect(screen.getByText("Servicio de Catering")).toBeInTheDocument();
    expect(screen.getByText(/₡15.000/)).toBeInTheDocument();
    expect(screen.getByText(/Servicio completo de alimentación/)).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("src", "http://localhost:1522/uploads/services/catering.jpg");
  });

  test("muestra botones para menús y productos si incluye 'catering'", () => {
    setup("view");
    expect(screen.getByRole("button", { name: /Ver menús/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Ver productos/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Ver menús/i }));
    expect(mockedNavigate).toHaveBeenCalledWith("/admin/servicios/catering/menus");

    fireEvent.click(screen.getByRole("button", { name: /Ver productos/i }));
    expect(mockedNavigate).toHaveBeenCalledWith("/admin/servicios/catering/productos");
  });

  test("renderiza modo delete y ejecuta eliminación", () => {
    const { onDelete } = setup("delete");

    expect(screen.getByText(/¿Eliminar servicio?/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Eliminar/i }));

    expect(onDelete).toHaveBeenCalledWith(serviceMock);
  });

  test("botón cerrar llama a onClose", () => {
    const { onClose } = setup("view");
    fireEvent.click(screen.getByRole("button", { name: "×" }));
    expect(onClose).toHaveBeenCalled();
  });
});
