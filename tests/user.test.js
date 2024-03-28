const { PrismaClient } = require('@prisma/client');
const {expect, describe, test} = require("@jest/globals");
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