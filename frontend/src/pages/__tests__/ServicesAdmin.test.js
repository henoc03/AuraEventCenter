// src/pages/__tests__/ServicesAdmin.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ServicesAdmin from '../ServicesAdmin';
import { MemoryRouter } from 'react-router-dom';

// Mock componentes hijos
jest.mock('../../components/common/Header', () => () => <div>Mocked Header</div>);
jest.mock('../../components/common/SideNav', () => () => <div>Mocked SideNav</div>);
jest.mock('../../components/common/ServiceCard', () => ({ service }) => (
  <div>{service.name}</div>
));
jest.mock('../../components/common/ServiceModal', () => ({ isOpen }) =>
  isOpen ? <div>Modal Abierto</div> : null
);
jest.mock('../../components/common/AlertMessage', () => ({ message }) => (
  <div>{message}</div>
));
jest.mock('../../components/common/LoadingPage', () => () => <div>Loading...</div>);
jest.mock('../../components/common/Pagination', () => () => <div>Paginación</div>);

// Simular jwtDecode
jest.mock('jwt-decode', () => ({
  jwtDecode: () => ({ id: '123' }),
}));

describe('ServicesAdmin - Integración', () => {
  const mockSections = [{ name: 'Sección 1', path: '/admin/seccion1' }];

  beforeEach(() => {
    global.fetch = jest.fn((url) => {
      if (url.includes('/users/')) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              FIRST_NAME: 'Ana',
              LAST_NAME_1: 'López',
              USER_TYPE: 'admin',
              EMAIL: 'ana@example.com',
            }),
        });
      }

      if (url.includes('/services')) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              { ID: 1, name: 'Decoración', active: 1 },
              { ID: 2, name: 'Catering', active: 0 },
            ]),
        });
      }

      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderPage = () =>
    render(
      <MemoryRouter>
        <ServicesAdmin sections={mockSections} />
      </MemoryRouter>
    );

  test('carga y renderiza los servicios correctamente', async () => {
    renderPage();

    // Esperar a que se carguen los datos
    await waitFor(() => {
      expect(screen.getByText('Mocked Header')).toBeInTheDocument();
      expect(screen.getByText('Mocked SideNav')).toBeInTheDocument();
      expect(screen.getByText('Decoración')).toBeInTheDocument();
      expect(screen.getByText('Catering')).toBeInTheDocument();
    });
  });

  test('abre el modal al hacer clic en "Agregar"', async () => {
    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Servicios')).toBeInTheDocument();
    });

    const agregarButton = screen.getByRole('button', { name: /Agregar/i });
    fireEvent.click(agregarButton);

    expect(screen.getByText('Modal Abierto')).toBeInTheDocument();
  });
});
