import request from 'supertest';
import app from '../app.js';
import { createUser, findByUsername } from '../lib/users.js';

describe('POST /register', () => {
  it('return 200 ef notandi var búinn til', async () => {
    const newUsername = 'password';
    const newPassword = '1337';

    findByUsername.mockReturnValue(null);
    createUser.mockReturnValue({ username: newUsername });

    const response = await request(app)
      .post('/register')
      .send({ username: newUsername, password: newPassword });

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/login');
  });
  
  it('return 400 ef notandi og password vantar', async () => {
    const invalidUsername = '';
    const invalidPassword = '';

    const response = await request(app)
      .post('/register')
      .send({ username: invalidUsername, password: invalidPassword });

    expect(response.status).toBe(400);
    expect(response.text).toContain('Nýskráning');
  });
  
  it('return 400 ef notandi er til', async () => {
    const existingUsername = 'password';
    const existingPassword = '1337';

    findByUsername.mockReturnValue({ username: existingUsername });

    const response = await request(app)
      .post('/register')
      .send({ username: existingUsername, password: existingPassword });

    expect(response.status).toBe(400);
    expect(response.text).toContain('Nýskráning');
  });
});
