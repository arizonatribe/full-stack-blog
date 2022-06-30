function createAuthMiddleware(_config, { passport }) {
  return {
    logout(req, res, _next) {
      req.logout();
      res.redirect('/');
    },

    getCurrentUser(req, res) {
      res.send(req.user);
    },

    redirectToAuthProvider: passport.authenticate('google', {
      scope: ['profile', 'email']
    }),

    verifyAuth: passport.authenticate('google'),

    requireLogin(req, res, next) {
      if (!req.user) {
        return res.status(401).send({ error: 'You must log in!' });
      }

      next();
    }
  }
}

module.exports = createAuthMiddleware;
