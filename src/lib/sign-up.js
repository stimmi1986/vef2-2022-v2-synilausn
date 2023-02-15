import { registrationValidationMiddleware } from '../lib/validation.js';
import { createUser } from './users.js';

async function signup(req, res) {
  let message = '';

  if (req.method === 'POST') {
    const { name, password } = req.body;

    const validation = validationResult(req);

    if (!validation.isEmpty()) {
      return res.render('/index/signup', {
        message,
        title: 'Nýskráning',
        data: { name, password },
        errors: validation.errors,
      });
    }

    const hashedPassword = await hashPassword(password);
    const user = await createUser({ name, password: hashedPassword });

    if (user) {
      return res.redirect('/admin/login');

    }

    message = 'Villa kom upp við að nýskrá notanda';
  }

  return res.render('/index/signup', {
    message,
    title: 'Nýskráning',
    data: {},
    errors: [],
  });
}

async function handleSignup(req, res) {
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
export default handleSignup;

indexRouter.get('/index/signup', catchErrors(signup));
indexRouter.post('/index/signup', registrationValidationMiddleware, catchErrors(signup));