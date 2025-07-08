/* eslint-env jest */

// Mock navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockResolvedValue(undefined),
  },
});

// Mock alert
global.alert = jest.fn();

describe('Steam URL Generation', () => {
  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
  });

  // Helper function to simulate the Steam URL generation logic
  const generateSteamUrl = (config) => {
    // Get server IP and port
    const serverIP = config.bindIP || 'localhost';
    const gamePort = config.hostPort || 0;

    if (!gamePort || gamePort === 0) {
      return null; // Invalid port
    }

    // Build the Steam URL
    let steamUrl = `steam://run/1066890//-connect ${serverIP}:${gamePort}`;
    
    // Add password if set
    if (config.password && config.password.trim() !== '') {
      steamUrl += ` -password ${config.password}`;
    }

    return steamUrl;
  };

  test('should generate Steam URL with localhost when bindIP is empty', () => {
    const config = {
      bindIP: '',
      hostPort: 27015,
      password: '',
    };

    const steamUrl = generateSteamUrl(config);
    expect(steamUrl).toBe('steam://run/1066890//-connect localhost:27015');
  });

  test('should generate Steam URL with custom IP when bindIP is set', () => {
    const config = {
      bindIP: '192.168.1.100',
      hostPort: 27015,
      password: '',
    };

    const steamUrl = generateSteamUrl(config);
    expect(steamUrl).toBe('steam://run/1066890//-connect 192.168.1.100:27015');
  });

  test('should include password in Steam URL when password is set', () => {
    const config = {
      bindIP: '192.168.1.100',
      hostPort: 27015,
      password: 'mypassword',
    };

    const steamUrl = generateSteamUrl(config);
    expect(steamUrl).toBe('steam://run/1066890//-connect 192.168.1.100:27015 -password mypassword');
  });

  test('should not include password in Steam URL when password is empty', () => {
    const config = {
      bindIP: '192.168.1.100',
      hostPort: 27015,
      password: '',
    };

    const steamUrl = generateSteamUrl(config);
    expect(steamUrl).toBe('steam://run/1066890//-connect 192.168.1.100:27015');
  });

  test('should not include password in Steam URL when password is only whitespace', () => {
    const config = {
      bindIP: '192.168.1.100',
      hostPort: 27015,
      password: '   ',
    };

    const steamUrl = generateSteamUrl(config);
    expect(steamUrl).toBe('steam://run/1066890//-connect 192.168.1.100:27015');
  });

  test('should return null when hostPort is 0', () => {
    const config = {
      bindIP: '192.168.1.100',
      hostPort: 0,
      password: 'mypassword',
    };

    const steamUrl = generateSteamUrl(config);
    expect(steamUrl).toBeNull();
  });

  test('should return null when hostPort is not set', () => {
    const config = {
      bindIP: '192.168.1.100',
      hostPort: undefined,
      password: 'mypassword',
    };

    const steamUrl = generateSteamUrl(config);
    expect(steamUrl).toBeNull();
  });

  test('should handle password with spaces correctly', () => {
    const config = {
      bindIP: '192.168.1.100',
      hostPort: 27015,
      password: 'my password with spaces',
    };

    const steamUrl = generateSteamUrl(config);
    expect(steamUrl).toBe('steam://run/1066890//-connect 192.168.1.100:27015 -password my password with spaces');
  });

  test('should use correct Steam app ID (1066890 for AMS2)', () => {
    const config = {
      bindIP: 'localhost',
      hostPort: 27015,
      password: '',
    };

    const steamUrl = generateSteamUrl(config);
    expect(steamUrl).toContain('steam://run/1066890//');
  });

  test('should use correct command line format', () => {
    const config = {
      bindIP: 'localhost',
      hostPort: 27015,
      password: 'testpass',
    };

    const steamUrl = generateSteamUrl(config);
    expect(steamUrl).toMatch(/^steam:\/\/run\/1066890\/\/-connect .+ -password .+$/);
  });
}); 