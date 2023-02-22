/*
import passport from 'passport';
import { Strategy } from 'passport-local';
import { createUser, findById, findByUsername } from './users.js';

export async function signup(req, res) {
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

passport.use('/signup', new Strategy(async (username, password, done) => {
  try {
    const user = await findByUsername(username);
    if (user) {
      return done(null, false, { message: 'Notandanafn þegar í notkun' });
    }

    const newUser = await createUser(username, password);
    return done(null, newUser);
  } catch (err) {
    console.error(err);
    return done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export function ensureLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.redirect(`/signup`);
}

export const signUp = (req, res, next) => {
  passport.authenticate('/signup', (err, user, info) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    if (!user) {
      return res.status(400).json({ error: info.message });
    }
    return res.json(user);
  })(req, res, next);
};

export default passport;
*/