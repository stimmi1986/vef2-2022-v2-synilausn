import express from 'express';
import { createUser } from './users.js';

const router = express.Router();

router.get('/signup', (req, res) => {
  res.render('/signup');
});

router.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await createUser(username, password);
    req.login(user, err => {
      if (err) throw err;
      res.redirect('/');
    });
  } catch (err) {
    console.error(err);
    res.render('/admin/login', { error: 'Gat ekki búið til notanda' });
  }
});

export default router;
