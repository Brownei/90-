export interface User {
  id: string;
  username: string;
  profileImageUrl: string;
  accessToken: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
} 