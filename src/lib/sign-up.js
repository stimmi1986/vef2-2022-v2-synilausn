import { hash as _hash } from 'bcrypt';
import express, { urlencoded } from 'express';
const app = express();
const mixRemix = 11;

// Middleware to handle form data
app.use(urlencoded({ extended: true }));

// Route to show the sign-up form
app.get('/sign-up', (req, res) => {
  res.render('sign-up');
});

// Route to handle the sign-up process
app.post('/sign-up', (req, res) => {
  const { username, password } = req.body;

  _hash(password, mixRemix, (err, hash) => {
    if (err) {
      res.send('Error hashing password');
    } else {
      // Save the user to the database with the hashed password
      // Replace this with your database connection and query
      const query = `INSERT INTO users (username, password) VALUES ('${username}', '${hash}')`;
      // Execute the query

      // Redirect to the login page
      res.redirect('/login');
    }
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
