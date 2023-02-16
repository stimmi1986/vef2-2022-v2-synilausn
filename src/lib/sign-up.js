import { createUser } from './users.js';

export async function handleSignup(req, res) {
  const { username, password } = req.body;

  try {
    const user = await createUser(username, password);
    if (user) {
      req.login(user, err => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Internal server error' });
        }

        return res.json({ success: true });
      });
    } else {
      return res.status(400).json({ error: 'Could not create user' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
