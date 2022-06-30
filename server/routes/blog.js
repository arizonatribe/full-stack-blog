function createBlogRoutes(router, middleware) {
  const { 
    requireLogin,
    createNewBlogEntry,
    resolveBlogsFromDb,
    resolveBlogsForUser,
    resolveBlogsFromCache
  } = middleware;

  return router
    .get(
      '/api/blogs/:id',
      requireLogin,
      resolveBlogsFromCache,
      resolveBlogsFromDb
    )
    .get(
      '/api/blogs',
      requireLogin,
      resolveBlogsFromCache,
      resolveBlogsForUser
    )
    .post(
      '/api/blogs',
      requireLogin,
      createNewBlogEntry
    );
}

module.exports = createBlogRoutes;
