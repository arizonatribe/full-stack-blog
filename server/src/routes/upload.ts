import { Router } from "express"
import { Middleware } from "../middleware"

/**
 * Middleware which handles uploading of image files to a remote bucket
*
 * @function
 * @name createUploadRoutes
 * @param {Router} router An instance of the ExpressJs router
 * @param {Middleware} middleware A set of middleware functions which will be bound to routes
 * @returns {Router} An instance of the [Express Router](https://expressjs.com/en/api.html#router)
 */
function createUploadRoutes(router: Router, middleware: Middleware) {
  const { requireLogin, handleImageUpload } = middleware

  return router
    .get("/api/upload", requireLogin, handleImageUpload)
}

export default createUploadRoutes
