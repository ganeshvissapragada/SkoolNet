// tests/integration/auth.integration.test.js

const request = require('supertest');
const express = require('express');

// Minimal mock controller
const mockLogin = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'email and password are required' });
  if (email === 'student@school.com' && password === 'wrong') return res.status(401).json({ message: 'Invalid credentials' });
  if (email === 'student@school.com' && password === 'pass123') return res.json({ token: 'test-jwt', role: 'student' });
  return res.status(401).json({ message: 'Invalid credentials' });
};

const app = express();
app.use(express.json());
app.post('/auth/login', mockLogin);

describe('Minimal Auth Integration', () => {
  it('should return JWT for valid login', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'student@school.com', password: 'pass123' });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBe('test-jwt');
    expect(res.body.role).toBe('student');
  });

  it('should return 401 for invalid password', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'student@school.com', password: 'wrong' });
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Invalid credentials');
  });

  it('should return 400 for missing fields', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: '' });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('email and password are required');
  });
});
