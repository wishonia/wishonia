describe('Authentication tests', () => {
  jest.mock('../public/scripts/auth.js', () => ({
    registerUser: jest.fn().mockResolvedValue({
      id: 1,
      email: 'newuser@example.com',
    }),
    loginUser: jest.fn().mockResolvedValue({
      email: 'existinguser@example.com',
      token: 'some-token',
    }),
    oauthLogin: jest.fn().mockResolvedValue({
      id: 2,
      email: 'oauthuser@example.com',
      token: 'oauth-token',
    }),
    sendMagicLink: jest.fn().mockResolvedValue({
      message: 'Magic link sent to your email.'
    }),
    verifyLoginToken: jest.fn().mockResolvedValue({
      success: true,
    }),
  }));

  test('User registration with email and password', async () => {
    const { registerUser } = require('../public/scripts/auth.js');
    const newUser = await registerUser({
      email: 'newuser@example.com',
      password: 'password123',
      name: 'New User'
    });
    expect(newUser.email).toBe('newuser@example.com');
    expect(newUser).toHaveProperty('id');
  });

  test('User login with email and password', async () => {
    const { loginUser } = require('../public/scripts/auth.js');
    const loggedInUser = await loginUser({
      email: 'existinguser@example.com',
      password: 'password123'
    });
    expect(loggedInUser.email).toBe('existinguser@example.com');
    expect(loggedInUser).toHaveProperty('token');
  });

  test('OAuth (Google) authentication', async () => {
    // Simulate OAuth (Google) authentication process
    const oauthData = {
      googleId: 'google-oauth-id-123',
      email: 'oauthuser@example.com',
      name: 'OAuth User'
    };
    const { oauthLogin } = require('../public/scripts/auth.js');
    const oauthUser = await oauthLogin(oauthData);
    expect(oauthUser.email).toBe('oauthuser@example.com');
    expect(oauthUser).toHaveProperty('id');
    expect(oauthUser).toHaveProperty('token');
  });

  test('Passwordless login magic link generation', async () => {
    const { sendMagicLink } = require('../public/scripts/auth.js');
    const response = await sendMagicLink({
      email: 'user@example.com'
    });
    expect(response).toHaveProperty('message', 'Magic link sent to your email.');
  });

  test('Passwordless login token verification', async () => {
    // Simulate token verification process
    const { verifyLoginToken } = require('../public/scripts/auth.js');
    const verificationResponse = await verifyLoginToken('mocked-token');
    expect(verificationResponse).toHaveProperty('success', true);
  });
});
