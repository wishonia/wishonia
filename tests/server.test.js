const request = require('supertest');
const app = require('../server.js');
const {describe, expect, it} = require("@jest/globals"); // Assuming this is the correct path to your Express app

describe('User Registration and Login', () => {
  it('registers a new user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        email: 'testuser@example.com',
        name: 'Test User'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('email', 'testuser@example.com');
  });

  it('logs in the registered user', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'testuser@example.com',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});
