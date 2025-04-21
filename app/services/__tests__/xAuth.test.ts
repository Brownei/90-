import { XAuthService } from '../xAuth';

describe('XAuthService', () => {
  let originalWindow: any;

  beforeEach(() => {
    originalWindow = { ...window };
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true
    });
    
    // Mock location
    Object.defineProperty(window, 'location', {
      value: {
        href: '',
        origin: 'http://localhost:3000'
      },
      writable: true
    });
  });

  afterEach(() => {
    window = originalWindow;
    jest.clearAllMocks();
  });

  describe('getInstance', () => {
    it('should return the same instance', () => {
      const instance1 = XAuthService.getInstance();
      const instance2 = XAuthService.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('initiateLogin', () => {
    it('should set state in localStorage and redirect to X auth URL', () => {
      const service = XAuthService.getInstance();
      service.initiateLogin();

      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        'x_auth_state',
        expect.any(String)
      );

      expect(window.location.href).toContain('https://twitter.com/i/oauth2/authorize');
      expect(window.location.href).toContain('response_type=code');
      expect(window.location.href).toContain('redirect_uri=http://localhost:3000/auth/callback');
    });
  });

  describe('handleCallback', () => {
    it('should throw error if state does not match', async () => {
      const service = XAuthService.getInstance();
      window.localStorage.getItem.mockReturnValue('saved-state');

      await expect(service.handleCallback('code', 'different-state'))
        .rejects
        .toThrow('Invalid state parameter');
    });

    it('should handle successful callback', async () => {
      const service = XAuthService.getInstance();
      window.localStorage.getItem.mockReturnValue('same-state');

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          accessToken: 'token',
          username: 'testuser',
          id: '123',
          profileImageUrl: 'https://example.com/avatar.jpg'
        })
      });

      const result = await service.handleCallback('code', 'same-state');

      expect(result).toEqual({
        accessToken: 'token',
        username: 'testuser',
        id: '123',
        profileImageUrl: 'https://example.com/avatar.jpg'
      });

      expect(fetch).toHaveBeenCalledWith('/api/auth/x/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: 'code' }),
      });
    });

    it('should handle failed callback', async () => {
      const service = XAuthService.getInstance();
      window.localStorage.getItem.mockReturnValue('same-state');

      global.fetch = jest.fn().mockResolvedValue({
        ok: false
      });

      await expect(service.handleCallback('code', 'same-state'))
        .rejects
        .toThrow('Failed to exchange code for token');
    });
  });
}); 