const { PrismaClient } = require('@prisma/client');
const {expect, describe, test} = require("@jest/globals");
const prisma = new PrismaClient();

describe('User functionality', () => {
  let email = 'test@example.com';
  test('Create, retrieve, update, and delete a user', async () => {
    let user = await prisma.user.create({
      data: {
        email: email,
        name: 'Test User',
        // Add other required fields based on your schema
      },
    });
    expect(user.email).toBe(email);
    user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    expect(user.email).toBe(email);
    const updatedUser = await prisma.user.update({
      where: { email: email },
      data: { name: 'Updated Test User' },
    });
    expect(updatedUser.name).toBe('Updated Test User');
    await prisma.user.delete({ where: { email: email } });
    user = await prisma.user.findUnique({
      where: { email: email },
    });
    expect(user).toBeNull();
  });
});
describe('Session management unit tests', () => {
  test('Create and delete a session', async () => {
    // Delete any existing user with the same email
    await prisma.user.deleteMany({
      where: {
        email: 'test@example.com',
      },
    });

    // Create a new user for the session
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
      },
    });

    // Create a session linked to the user
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
        sessionToken: 'randomSessionTokenString', // Added as per instruction
      },
    });

    // Verify the session has been created with the correct properties
    expect(session).toHaveProperty('id');
    expect(session).toHaveProperty('userId', user.id);
    expect(new Date(session.expires).getTime()).toBeGreaterThan(new Date().getTime());

    // Clean up: delete the session and the user
    await prisma.session.delete({
      where: {
        id: session.id,
      },
    });

    await prisma.user.delete({
      where: {
        id: user.id,
      },
    });
  });
});
