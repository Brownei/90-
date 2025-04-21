import type { User } from '../types/user';

export interface XAuthResponse {
  accessToken: string;
  username: string;
  id: string;
  profileImageUrl: string;
}

export interface XAuthError {
  message: string;
  code: string;
}

export class XAuthService {
  private static instance: XAuthService;
  private readonly clientId: string;
  private readonly redirectUri: string;

  private constructor() {
    this.clientId = process.env.X_CLIENT_ID || '';
    this.redirectUri = `${window.location.origin}/auth/callback`;
  }

  public static getInstance(): XAuthService {
    if (!XAuthService.instance) {
      XAuthService.instance = new XAuthService();
    }
    return XAuthService.instance;
  }

  public initiateLogin(): void {
    const scope = 'tweet.read users.read';
    const state = this.generateState();
    localStorage.setItem('x_auth_state', state);
    
    const authUrl = new URL('https://twitter.com/i/oauth2/authorize');
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('client_id', this.clientId);
    authUrl.searchParams.append('redirect_uri', this.redirectUri);
    authUrl.searchParams.append('scope', scope);
    authUrl.searchParams.append('state', state);
    authUrl.searchParams.append('code_challenge_method', 'S256');
    authUrl.searchParams.append('code_challenge', this.generateCodeChallenge());

    window.location.href = authUrl.toString();
  }

  public async handleCallback(code: string, state: string): Promise<XAuthResponse> {
    const savedState = localStorage.getItem('x_auth_state');
    if (state !== savedState) {
      throw new Error('Invalid state parameter');
    }

    try {
      const response = await fetch('/api/auth/x/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error('Failed to exchange code for token');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Authentication failed');
    }
  }

  private generateState(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  private generateCodeChallenge(): string {
    // In a real implementation, this would generate a proper PKCE code challenge
    return Math.random().toString(36).substring(2, 15);
  }
} 