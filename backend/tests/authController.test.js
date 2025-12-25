// tests/authController.test.js

const authController = require('../controllers/authController');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

jest.mock('../models/postgres', () => ({
  User: { findOne: jest.fn() }
}));
const { User } = require('../models/postgres');

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Auth Controller - login', () => {
  let req, res;
  beforeEach(() => {
    req = { body: { email: 'test@example.com', password: 'pass123' } };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    jest.clearAllMocks();
  });

  it('should return JWT for valid login', async () => {
    User.findOne.mockResolvedValue({ id: 1, role: 'student', password: 'hashed', name: 'Test', email: 'test@example.com' });
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('mocked-jwt');

    await authController.login(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ token: 'mocked-jwt', role: 'student', userId: 1 }));
  });

  it('should return 401 for invalid password', async () => {
    User.findOne.mockResolvedValue({ id: 1, role: 'student', password: 'hashed' });
    bcrypt.compare.mockResolvedValue(false);

    await authController.login(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
  });

  it('should return 401 for non-existent user', async () => {
    User.findOne.mockResolvedValue(null);
    await authController.login(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
  });

  it('should return 400 for missing email or password', async () => {
    req.body = { email: '' };
    await authController.login(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'email and password are required' });
  });
});
