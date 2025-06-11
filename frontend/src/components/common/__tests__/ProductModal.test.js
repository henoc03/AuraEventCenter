import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProductModal from "../ProductModal";

describe("ProductModal", () => {
  const productMock = {
    name: "Galletas",
    description: "Galletas de avena",
    price: "1000",
    type: "Postre",
    active: 1,
  };

  const setup = (mode = "add", overrides = {}) => {
    const props = {
      isOpen: true,
      mode,
      product: productMock,
      onClose: jest.fn(),
      onDelete: jest.fn(),
      onSubmit: jest.fn(),
      ...overrides,
    };
    render(<ProductModal {...props} />);
    return props;
  };

  test("renderiza correctamente en modo add", () => {
    setup("add");
    expect(screen.getByText(/Agregar Producto/i)).toBeInTheDocument();
    expect(screen.getByText(/Nombre/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Registrar/i })).toBeInTheDocument();
  });

  test("envía formulario en modo add", async () => {
    const { onSubmit } = setup("add");

    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: "Agua" } });
    fireEvent.change(screen.getByLabelText(/Tipo/i), { target: { value: "Bebida" } });
    fireEvent.change(screen.getByLabelText(/Descripción/i), { target: { value: "Botella de agua" } });
    fireEvent.change(screen.getByLabelText(/Precio/i), { target: { value: "500" } });

    const submitBtn = screen.getByRole("button", { name: /Registrar/i });
    await waitFor(() => expect(submitBtn).not.toBeDisabled());
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: "Agua",
        unitary_price: 500,
        description: "Botella de agua",
        type: "Bebida",
        active: 1,
      });
    });
  });

  test("renderiza correctamente en modo view", () => {
    setup("view");
    expect(screen.getByText("Galletas")).toBeInTheDocument();
    expect(screen.getByText(/Galletas de avena/)).toBeInTheDocument();
    expect(screen.getByText(/₡1.000/)).toBeInTheDocument();
  });

  test("renderiza correctamente en modo delete y elimina producto", () => {
    const { onDelete } = setup("delete");

    expect(screen.getByText(/¿Eliminar producto?/i)).toBeInTheDocument();
    const eliminarBtn = screen.getByRole("button", { name: /Eliminar/i });
    fireEvent.click(eliminarBtn);

    expect(onDelete).toHaveBeenCalledWith(productMock);
  });

  test("llama a onClose al hacer clic en ×", () => {
    const { onClose } = setup("view");
    const closeBtn = screen.getByRole("button", { name: "×" });
    fireEvent.click(closeBtn);

    expect(onClose).toHaveBeenCalled();
  });
});
