const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('Session management unit tests', () => {
  test('Create and delete a session', async () => {
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
      },
    });

    // Verify the session has been created with the correct properties
    expect(session).toHaveProperty('id');
    expect(session).toHaveProperty('userId', user.id);
    expect(new Date(session.expires)).toBeGreaterThan(new Date());

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
