// tests/integration/grades.integration.test.js

const request = require('supertest');
const express = require('express');
const gradesRoutes = express.Router();
const jwt = require('jsonwebtoken');

// Mock middleware for authentication
function authMiddleware(req, res, next) {
  const auth = req.headers['authorization'];
  if (!auth) return res.status(401).json({ message: 'No token provided' });
  const token = auth.split(' ')[1];
  if (token === 'student-jwt') {
    req.user = { id: 1, role: 'student' };
    return next();
  }
  if (token === 'teacher-jwt') {
    req.user = { id: 2, role: 'teacher' };
    return next();
  }
  return res.status(403).json({ message: 'Forbidden' });
}

gradesRoutes.post('/grades', authMiddleware, (req, res) => {
  if (req.user.role === 'student') return res.status(403).json({ message: 'Forbidden' });
  res.json({ success: true });
});

describe('Grades Integration', () => {
  let app;
  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/', gradesRoutes);
  });

  it('should return 403 Forbidden for student uploading grades', async () => {
    const res = await request(app)
      .post('/grades')
      .set('Authorization', 'Bearer student-jwt')
      .send({ grade: 'A' });
    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe('Forbidden');
  });

  it('should return 401 Unauthorized for missing token', async () => {
    const res = await request(app)
      .post('/grades')
      .send({ grade: 'A' });
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('No token provided');
  });
});
