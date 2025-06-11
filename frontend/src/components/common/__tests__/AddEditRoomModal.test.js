import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddEditRoomModal from "../AddEditRoomModal";

// Mock global de fetch
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([]),
    })
  );
});

describe("AddEditRoomModal", () => {
  const onCloseMock = jest.fn();
  const onSuccessMock = jest.fn();

  beforeEach(() => {
    onCloseMock.mockClear();
    onSuccessMock.mockClear();
    fetch.mockClear();
  });

  test("muestra el modal con campos requeridos", () => {
    render(
      <AddEditRoomModal
        isModalOpen={true}
        isAdd={true}
        onClose={onCloseMock}
        onSuccess={onSuccessMock}
      />
    );

    expect(screen.getByText(/Agregar Sala/i)).toBeInTheDocument();
    expect(screen.getByText(/Nombre de la sala/i)).toBeInTheDocument();
    expect(screen.getByText(/Precio/i)).toBeInTheDocument();
  });

  test("muestra errores si se intenta enviar vacío", async () => {
    render(
      <AddEditRoomModal
        isModalOpen={true}
        isAdd={true}
        onClose={onCloseMock}
        onSuccess={onSuccessMock}
      />
    );

    const submitBtn = screen.getByRole("button", { name: /registrar/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Nombre de sala requerido/i)).toBeInTheDocument();
      expect(screen.getByText(/Precio requerido/i)).toBeInTheDocument();
      expect(screen.getByText(/Capacidad requerida/i)).toBeInTheDocument();
      expect(screen.getByText(/Descripción requerida/i)).toBeInTheDocument();
    });
  });

  test("llama a onClose al hacer clic en Cancelar", () => {
    render(
      <AddEditRoomModal
        isModalOpen={true}
        isAdd={true}
        onClose={onCloseMock}
        onSuccess={onSuccessMock}
      />
    );

    const cancelButton = screen.getByRole("button", { name: /cancelar/i });
    fireEvent.click(cancelButton);

    expect(onCloseMock).toHaveBeenCalled();
  });
});
