import { Router } from "express"
import { AuthMiddleware } from "../middleware/auth"
import { BlogMiddleware } from "../middleware/blog"

/**
 * Binds auth middleware to endpoints for an instance of the express application router.
 * @function
 * @name createAuthRoutes
 * @param {Router} router An instance of the ExpressJs router
 * @param {AuthMiddleware} middleware A set of auth middleware functions which will be bound to routes
 * @returns {Router} An instance of the [Express Router](https://expressjs.com/en/api.html#router)
 */
function createAuthRoutes(router: Router, middleware: AuthMiddleware & BlogMiddleware) {
  const {
    logout,
    goHome,
    verifyAuth,
    getCurrentUser,
    redirectToAuthProvider
  } = middleware

  return router
    .get("/auth/google", redirectToAuthProvider)
    .get("/auth/google/callback", verifyAuth, goHome)
    .get("/api/current_user", getCurrentUser)
    .get("/auth/logout", logout)
}

export default createAuthRoutes
