import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UserModal from "../UserModal";

describe("UserModal", () => {
  const userMock = {
    name: "Laura Gómez",
    email: "laura@example.com",
    phone: "88885555",
    status: "Activo",
    image: "https://example.com/profile.jpg",
  };

  const setup = (mode = "add", overrides = {}) => {
    const props = {
      isOpen: true,
      mode,
      user: userMock,
      onClose: jest.fn(),
      onDelete: jest.fn(),
      onSubmit: jest.fn(),
      ...overrides,
    };

    render(<UserModal {...props} />);
    return props;
  };

  test("renderiza y valida campos en modo add", async () => {
    const { onSubmit } = setup("add");

    fireEvent.change(screen.getByLabelText(/Nombre completo/i), {
      target: { value: "Carlos Pérez" },
    });

    fireEvent.change(screen.getByLabelText(/Correo electrónico/i), {
      target: { value: "carlos@example.com" },
    });

    fireEvent.change(screen.getByLabelText(/Número telefónico/i), {
      target: { value: "88884444" },
    });

    fireEvent.change(screen.getByLabelText(/^Contraseña/i), {
      target: { value: "Test123!" },
    });

    fireEvent.change(screen.getByLabelText(/Confirmar contraseña/i), {
      target: { value: "Test123!" },
    });

    const submitBtn = screen.getByRole("button", { name: /Registrar/i });

    await waitFor(() => expect(submitBtn).not.toBeDisabled());
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Carlos Pérez",
          email: "carlos@example.com",
          phone: "88884444",
          password: "Test123!",
          confirmPassword: "Test123!",
        })
      );
    });
  });

  test("renderiza correctamente en modo view", () => {
    setup("view");
    expect(screen.getByText(/Laura Gómez/)).toBeInTheDocument();
    expect(screen.getByText(/laura@example.com/)).toBeInTheDocument();
    expect(screen.getByText(/88885555/)).toBeInTheDocument();
    expect(screen.getByText(/Activo/)).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("src", "https://example.com/profile.jpg");
  });

  test("renderiza correctamente en modo delete y ejecuta eliminación", () => {
    const { onDelete } = setup("delete");
    fireEvent.click(screen.getByRole("button", { name: /Eliminar/i }));

    expect(onDelete).toHaveBeenCalledWith(userMock);
  });

  test("llama a onClose con botón cerrar", () => {
    const { onClose } = setup("add");
    const closeBtn = screen.getByRole("button", { name: /Cerrar/i });
    fireEvent.click(closeBtn);

    expect(onClose).toHaveBeenCalled();
  });
});
