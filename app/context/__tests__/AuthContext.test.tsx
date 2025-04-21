import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import { XAuthService } from '../../services/xAuth';

// Mock XAuthService
jest.mock('../../services/xAuth', () => ({
  XAuthService: {
    getInstance: jest.fn(() => ({
      initiateLogin: jest.fn(),
      handleCallback: jest.fn(),
    })),
  },
}));

// Test component that uses the auth context
function TestComponent() {
  const { login, logout, isAuthenticated, user, error } = useAuth();
  return (
    <div>
      <button onClick={login}>Login</button>
      <button onClick={logout}>Logout</button>
      {isAuthenticated && <div>Authenticated</div>}
      {user && <div>User: {user.username}</div>}
      {error && <div>Error: {error}</div>}
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('provides initial auth state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.queryByText('Authenticated')).not.toBeInTheDocument();
    expect(screen.queryByText(/User:/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Error:/)).not.toBeInTheDocument();
  });

  it('handles login flow', async () => {
    const mockXAuth = XAuthService.getInstance();
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText('Login'));

    expect(mockXAuth.initiateLogin).toHaveBeenCalled();
  });

  it('handles logout', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // First set some auth state
    const { rerender } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Click logout
    fireEvent.click(screen.getByText('Logout'));

    // Verify auth state is cleared
    expect(screen.queryByText('Authenticated')).not.toBeInTheDocument();
    expect(screen.queryByText(/User:/)).not.toBeInTheDocument();
  });

  it('handles authentication callback', async () => {
    const mockXAuth = XAuthService.getInstance();
    const mockUser = {
      accessToken: 'token',
      username: 'testuser',
      id: '123',
      profileImageUrl: 'https://example.com/avatar.jpg'
    };

    (mockXAuth.handleCallback as jest.Mock).mockResolvedValueOnce(mockUser);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Simulate successful callback
    await waitFor(() => {
      expect(screen.queryByText('User: testuser')).toBeInTheDocument();
      expect(screen.queryByText('Authenticated')).toBeInTheDocument();
    });
  });

  it('handles authentication errors', async () => {
    const mockXAuth = XAuthService.getInstance();
    (mockXAuth.handleCallback as jest.Mock).mockRejectedValueOnce(new Error('Auth failed'));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Simulate failed callback
    await waitFor(() => {
      expect(screen.queryByText('Error: Authentication failed')).toBeInTheDocument();
      expect(screen.queryByText('Authenticated')).not.toBeInTheDocument();
    });
  });
}); 