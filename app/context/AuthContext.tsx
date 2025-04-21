import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthState } from '../types/user';
import { XAuthService } from '../services/xAuth';

interface AuthContextType extends AuthState {
  login: () => void;
  logout: () => void;
  handleAuthCallback: (code: string, state: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  });

  const login = useCallback(() => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      const xAuth = XAuthService.getInstance();
      xAuth.initiateLogin();
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to initiate login',
      }));
    }
  }, []);

  const handleAuthCallback = useCallback(async (code: string, state: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      const xAuth = XAuthService.getInstance();
      const response = await xAuth.handleCallback(code, state);
      
      setAuthState({
        user: response,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Authentication failed',
      });
    }
  }, []);

  const logout = useCallback(() => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    // Clear any stored tokens or state
    localStorage.removeItem('x_auth_state');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        handleAuthCallback,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 