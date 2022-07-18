import { Router } from "express"
import { Middleware } from "../middleware"

/**
 * Binds blog (domain) middleware to endpoints for an instance of the express application router.
 * @function
 * @name createBlogRoutes
 * @param {Router} router An instance of the ExpressJs router
 * @param {Middleware} middleware A set of domain middleware functions which will be bound to routes
 * @returns {Router} An instance of the [Express Router](https://expressjs.com/en/api.html#router)
 */
function createBlogRoutes(router: Router, middleware: Middleware) {
  const {
    requireLogin,
    createNewBlogEntry,
    resolveBlogsFromDb,
    resolveBlogsForUser
    // resolveBlogsFromCache
  } = middleware

  return router
    .get(
      "/api/blogs/:id",
      requireLogin,
      // resolveBlogsFromCache,
      resolveBlogsFromDb
    )
    .get(
      "/api/blogs",
      requireLogin,
      // resolveBlogsFromCache,
      resolveBlogsForUser
    )
    .post(
      "/api/blogs",
      requireLogin,
      createNewBlogEntry
    )
}

export default createBlogRoutes
