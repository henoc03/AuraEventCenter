import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import AddEditMenuModal from "../AddEditMenuModal";

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
);

describe("AddEditMenuModal", () => {
  const onCloseMock = jest.fn();
  const onSuccessMock = jest.fn();

  beforeEach(() => {
    fetch.mockClear();
    onCloseMock.mockClear();
    onSuccessMock.mockClear();
  });

  test("se muestra el modal con campos obligatorios", async () => {
    await act(async () => {
      render(
        <AddEditMenuModal
          isModalOpen={true}
          onClose={onCloseMock}
          onSuccess={onSuccessMock}
          isAdd={true}
        />
      );
    });

    expect(screen.getByText(/Agregar Menú/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Descripción/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Tipo de menú/i)).toBeInTheDocument();
  });

  test("muestra error si se intenta enviar sin completar campos", async () => {
    await act(async () => {
      render(
        <AddEditMenuModal
          isModalOpen={true}
          onClose={onCloseMock}
          onSuccess={onSuccessMock}
          isAdd={true}
        />
      );
    });

    const submitBtn = screen.getByRole("button", { name: /registrar/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Nombre requerido/i)).toBeInTheDocument();
      expect(screen.getByText(/Descripción requerida/i)).toBeInTheDocument();
      expect(screen.getByText(/Tipo requerido/i)).toBeInTheDocument();
    });
  });

  test("cierra el modal al presionar el botón cancelar", () => {
    render(
      <AddEditMenuModal
        isModalOpen={true}
        onClose={onCloseMock}
        onSuccess={onSuccessMock}
        isAdd={true}
      />
    );

    const cancelButton = screen.getByRole("button", { name: /cancelar/i });
    fireEvent.click(cancelButton);

    expect(onCloseMock).toHaveBeenCalled();
  });
});
