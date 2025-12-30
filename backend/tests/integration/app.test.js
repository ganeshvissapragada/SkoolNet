// tests/integration/app.test.js

const request = require('supertest');
// Adjust the path to your Express app as needed
const app = require('../../server');

describe('GET /health', () => {
  it('should return 200 OK', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
  });
});

// This test is removed because importing the full server.js starts real DB connections and a real server, which is not suitable for Jest integration tests. Use minimal Express app tests for integration instead.
