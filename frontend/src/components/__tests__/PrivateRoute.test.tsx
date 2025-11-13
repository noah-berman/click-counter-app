import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { PrivateRoute } from '../PrivateRoute';
import { AuthContext } from '../../contexts/AuthContext';

// Mock the useAuth hook
vi.mock('../../contexts/AuthContext', async () => {
  const actual = await vi.importActual('../../contexts/AuthContext');
  return {
    ...actual,
    useAuth: vi.fn(),
  };
});

describe('PrivateRoute', () => {
  it('should render children when authenticated', () => {
    const mockUseAuth = vi.fn(() => ({
      isAuthenticated: true,
      loading: false,
    }));

    vi.mocked(require('../../contexts/AuthContext').useAuth).mockImplementation(mockUseAuth);

    render(
      <BrowserRouter>
        <PrivateRoute>
          <div>Protected Content</div>
        </PrivateRoute>
      </BrowserRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should show loading when loading', () => {
    const mockUseAuth = vi.fn(() => ({
      isAuthenticated: false,
      loading: true,
    }));

    vi.mocked(require('../../contexts/AuthContext').useAuth).mockImplementation(mockUseAuth);

    render(
      <BrowserRouter>
        <PrivateRoute>
          <div>Protected Content</div>
        </PrivateRoute>
      </BrowserRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});

