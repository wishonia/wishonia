const { PrismaClient } = require('@prisma/client');
const {describe, test, expect} = require("@jest/globals");
const prisma = new PrismaClient();

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
