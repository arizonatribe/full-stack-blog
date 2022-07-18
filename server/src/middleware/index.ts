import { Services } from "../services"
import { ServerConfig } from "../config"
import createAuthMiddleware, { AuthMiddleware } from "./auth"
import createBlogMiddleware, { BlogMiddleware } from "./blog"
import createBasicMiddleware, { BasicMiddleware } from "./basic"
import createUploadMiddleware, { UploadMiddleware } from "./upload"

export interface Middleware extends BasicMiddleware, AuthMiddleware, BlogMiddleware, UploadMiddleware { }

/**
 * A factory function which creates all the app and common middleware
 *
 * @function
 * @name createMiddleware
 * @param {ServerConfig} config The application configuration settings
 * @param {Services} services An instance of the application's cross-cutting services
 * @returns {Middleware} All the server's middleware functions
 */
function createMiddleware(config: ServerConfig, services: Services) {
  return {
    ...createAuthMiddleware(config, services),
    ...createBasicMiddleware(config, services),
    ...createBlogMiddleware(config, services),
    ...createUploadMiddleware(config, services)
  } as Middleware
}

export default createMiddleware
