import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PrivateRoute from '../PrivateRoute';
import { AuthContext } from '../../context/AuthContext';

test('renders component when user is authenticated', () => {
    const MockComponent = () => <div>Authenticated Component</div>;

    render(
        <AuthContext.Provider value={{ isAuthenticated: true }}>
            <MemoryRouter initialEntries={['/private']}>
                <PrivateRoute path="/private" component={MockComponent} />
            </MemoryRouter>
        </AuthContext.Provider>
    );

    expect(screen.getByText('Authenticated Component')).toBeInTheDocument();
});

test('redirects to login when user is not authenticated', () => {
    render(
        <AuthContext.Provider value={{ isAuthenticated: false }}>
            <MemoryRouter initialEntries={['/private']}>
                <PrivateRoute path="/private" component={() => <div>Authenticated Component</div>} />
            </MemoryRouter>
        </AuthContext.Provider>
    );

    expect(screen.queryByText('Authenticated Component')).not.toBeInTheDocument();
    expect(screen.getByText('Redirecting...')).toBeInTheDocument();
});