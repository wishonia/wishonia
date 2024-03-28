const request = require('supertest');
const app = require('../server.js');
const {describe, expect, it} = require("@jest/globals");
const {PrismaClient} = require("@prisma/client"); // Assuming this is the correct path to your Express app
const prisma = new PrismaClient();

describe('POST /auth/register', () => {
  it('should register a new user only once', async () => {
    await prisma.user.deleteMany();
    let email = 'testuser2@example.com';
    let res = await request(app)
      .post('/auth/register')
      .send({
        email: email,
        gdprConsent: true
      });
    if (res.statusCode !== 201) {
      console.error(`Status: ${res.statusCode}, Body:`, res.body);
    }
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('email', email);
    res = await request(app)
      .post('/auth/register')
      .send({
        email: email,
        gdprConsent: true
      });
    expect(res.statusCode).toEqual(409);
    expect(res.body).toHaveProperty('message', 'User already exists');
    res = await request(app)
      .post('/auth/login')
      .send({
        email: email,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(JSON.parse('{"message": "Magic link sent to your email."}'));
  });
});
