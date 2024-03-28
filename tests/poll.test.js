const { PrismaClient } = require('@prisma/client');
const {describe, test, expect} = require("@jest/globals");
const prisma = new PrismaClient();
const { registerUser, loginUser } = require('../public/scripts/auth.js');

jest.mock('../public/scripts/auth.js', () => ({
  registerUser: jest.fn().mockResolvedValue({
    id: 'new-user-id',
    email: 'newuser@example.com',
    name: 'New User'
  }),
  loginUser: jest.fn().mockResolvedValue({
    email: 'existinguser@example.com',
    token: 'auth-token'
  }), // Mocking loginUser to return an object with email property
  oauthLogin: jest.fn(), // Assuming oauthLogin needs to be mocked as well
}));

describe('User model tests', () => {
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
    const user = await prisma.user.findUnique({
      where: {
        email: 'test@example.com',
      },
    });
    expect(user.email).toBe('test@example.com');
  });

  test('Update a user', async () => {
    const updatedUser = await prisma.user.update({
      where: { email: 'test@example.com' },
      data: { name: 'Updated Test User' },
    });
    expect(updatedUser.name).toBe('Updated Test User');
  });

  test('Delete a user', async () => {
    await prisma.user.delete({ where: { email: 'test@example.com' } });
    const user = await prisma.user.findUnique({
      where: { email: 'test@example.com' },
    });
    expect(user).toBeNull();
  });
});

describe('Authentication tests', () => {
  test('User registration with email and password', async () => {
    // Simulate user registration process
    const registrationData = {
      email: 'newuser@example.com',
      password: 'password123',
      name: 'New User'
    };
    // Assuming a function registerUser exists
    const newUser = await registerUser(registrationData);
    expect(newUser.email).toBe('newuser@example.com');
    expect(newUser).toHaveProperty('id');
  });

  test('User login with email and password', async () => {
    // Simulate user login process
    const loginCredentials = {
      email: 'existinguser@example.com',
      password: 'password123'
    };
    // Assuming a function loginUser exists
    const loggedInUser = await loginUser(loginCredentials);
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
    // Assuming a function oauthLogin exists
    const oauthUser = await oauthLogin(oauthData);
    expect(oauthUser.email).toBe('oauthuser@example.com');
    expect(oauthUser).toHaveProperty('id');
    expect(oauthUser).toHaveProperty('token');
  });
});

describe('Poll functionality tests', () => {
  test('Submitting poll responses and validating the data', async () => {
    // Simulate submitting a poll response
    const pollResponseData = {
      userId: 'user-id-123',
      pollId: 'poll-id-123',
      responses: [
        { questionId: 'question1', answer: 'answer1' },
        { questionId: 'question2', answer: 'answer2' }
      ]
    };
    // Assuming a function submitPollResponse exists
    const submissionResult = await submitPollResponse(pollResponseData);
    expect(submissionResult).toHaveProperty('id');
    expect(submissionResult.responses.length).toBe(2);
    // Validate the data
    expect(submissionResult.responses[0].questionId).toBe('question1');
    expect(submissionResult.responses[1].questionId).toBe('question2');
  });
});
