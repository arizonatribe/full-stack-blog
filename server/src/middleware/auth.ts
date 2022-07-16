import { Request, Response, NextFunction } from "express"

import { Services } from "../services"
import { ServerConfig } from "../config"

/**
 * A factory function which creates auth specific middleware from the app's configuration settings and cross-cutting services.
 * @function
 * @name createAuthMiddleware
 * @param {ServerConfig} _config The application configuration settings
 * @param {Services} services The application's cross-cutting services
 * @param {Object<string, function>} services.passport The passport auth handling instance
 * @param {Object<string, function>} services.logger The threshold-based logger instance
 * @param {function} services.passport.authenticate The auth handling function
 * @returns {AuthMiddleware} The middleware functions ready to be bound to the app
 */
function createAuthMiddleware(_config: ServerConfig, services: Services) {
  const { passport, logger } = services

  return {
    logout(req: Request, res: Response, _: NextFunction) {
      req.logout((err: any) => logger.error(err))
      res.redirect("/")
    },

    getCurrentUser(req: Request, res: Response, _: NextFunction) {
      res.send(req.user)
    },

    redirectToAuthProvider: passport.authenticate("google", {
      scope: ["profile", "email"]
    }),

    verifyAuth: passport.authenticate("google"),

    requireLogin(req: Request, res: Response, next: NextFunction) {
      if (!req.user) {
        res.status(401).send({ error: "You must log in!" })
      } else {
        next()
      }
    }
  }
}

export type AuthMiddleware = ReturnType<typeof createAuthMiddleware>

export default createAuthMiddleware
