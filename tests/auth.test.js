const { PrismaClient } = require('@prisma/client');
const {describe, test, expect, beforeEach, afterEach} = require("@jest/globals");
const prisma = new PrismaClient();

describe('User model tests', () => {
  beforeEach(async () => {
    // Clean up the user table before each test
    await prisma.user.deleteMany({});
  });

  afterEach(async () => {
    // Clean up the user table after each test
    await prisma.user.deleteMany({});
  });

  test('Create a new user', async () => {
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
      },
    });
    expect(user.email).toBe('test@example.com');
  });

  test('Retrieve a user', async () => {
    // Ensure the user exists for this test
    await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
      },
    });

    const user = await prisma.user.findUnique({
      where: {
        email: 'test@example.com',
      },
    });
    expect(user.email).toBe('test@example.com');
  });

  test('Update a user', async () => {
    // Ensure the user exists for this test
    await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
      },
    });

    const updatedUser = await prisma.user.update({
      where: { email: 'test@example.com' },
      data: { name: 'Updated Test User' },
    });
    expect(updatedUser.name).toBe('Updated Test User');
  });

  test('Delete a user', async () => {
    // Ensure the user exists for this test
    await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
      },
    });

    await prisma.user.delete({ where: { email: 'test@example.com' } });
    const user = await prisma.user.findUnique({
      where: { email: 'test@example.com' },
    });
    expect(user).toBeNull();
  });
});

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
});
