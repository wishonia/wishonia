
const { PrismaClient } = require('@prisma/client');
const {expect} = require("@jest/globals");
const prisma = new PrismaClient();

describe('User functionality', () => {
  test('Create a new user', async () => {
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        // Add other required fields based on your schema
      },
    });
    expect(user.email).toBe('test@example.com');
    // Clean up if necessary
    await prisma.user.delete({ where: { email: 'test@example.com' } });
  });
});
