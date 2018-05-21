const passport = require('passport');

module.exports = app => {
  app.get(
    '/auth/google',
    // Authenticate user using 'google' passport strategy
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })
  );

  app.get(
    '/auth/google/callback',
    // Authenticate user using 'google' passport strategy
    passport.authenticate('google'),
    // Redirect to /surveys after authentication
    (req, res) => {
      res.redirect('/surveys');
    }
  );

  // Logout user and redirect to root
  app.get('/api/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  // Return current logged in user model
  app.get('/api/current_user', (req, res) => {
    res.send(req.user ? req.user : '');
  });
};
