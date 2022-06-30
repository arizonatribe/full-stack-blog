function createAuthRoutes(router, middleware) {
  const {
    logout,
    goHome,
    verifyAuth,
    getCurrentUser,
    redirectToAuthProvider
  } = middleware;

  return router
    .get('/auth/google', redirectToAuthProvider)
    .get('/auth/google/callback', verifyAuth, goHome)
    .get('/api/current_user', getCurrentUser)
    .get('/auth/logout', logout);
}

module.exports = createAuthRoutes;
