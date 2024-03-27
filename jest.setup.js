
require('dotenv').config({ path: '.env.testing' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

beforeAll(async () => {
  // Run any setup here if needed, like seeding the database
});

afterAll(async () => {
  await prisma.$disconnect();
});
