import { Request, Response, NextFunction } from "express"

import { Services } from "../services"
import { ServerConfig } from "../config"
import { ErrorWithExtensions } from "../types"

/**
 * A factory function which creates non-route specific middleware from the app's configuration settings.
 *
 * @function
 * @name createBasicMiddleware
 * @param {ServerConfig} config The application configuration settings
 * @param {Services} services The application's cross-cutting services
 * @param {Object<string, function>} services.logger An instance of a threshold-based logger
 * @returns {BasicMiddleware} The middleware functions ready to be bound to the app
 */
function createBasicMiddleware(config: ServerConfig, services: Services) {
  const { logger } = services

  return {
    /**
     * A piece of middleware which will allow inbound requests from _any_ source regardless of its origin.
     * This should only be used in local development or in cases where there is 100% guarantee that the source is trusted
     * (due to where the API sits in your infrastructure, most likely).
     *
     * @function
     * @name allowCrossDomainMiddleware
     * @param {Request} _ The connect middleware HTTP request object
     * @param {Response} res The connect middleware HTTP response object whose methods are used to resolve the middleware chain and send a true HTTP response back to the caller
     * @param {NextFunction} next The reserved Express/connect middleware helper function which pushes execution forward (or triggers your error handler if you pass it an `Error` instance)
     */
    allowCrossDomainMiddleware(_: Request, res: Response, next: NextFunction) {
      res.header("Access-Control-Allow-Origin", "*")
      res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE")
      res.header("Access-Control-Allow-Headers", "Content-Type")
      next()
    },

    /**
     * Displays application uptime and basic application metadata
     * @function
     * @name healthCheck
     * @param {Request} _req The connect middleware HTTP request object
     * @param {Response} res The connect middleware HTTP response object whose methods are used to resolve the middleware chain and send a true HTTP response back to the caller
     * @param {NextFunction} _ The `next` middleware function which normally pushes execution forward but is unused here at a catch-all function
     */
    healthCheck(_req: Request, res: Response, _: NextFunction) {
      res.status(200).json({
        version: config.appVersion,
        name: config.appName,
        success: true,
        status: "OK",
        timestamp: Date.now(),
        uptime: process.uptime()
      })
    },

    /**
     * The Express middleware global error handler middleware function (all express
     * applications should have one).
     *
     * @function
     * @name globalErrorHandler
     * @param {ErrorWithExtensions} err The error thrown (or rather pushed into `next(err)` elsewhere in the middleware chain)
     * @param {Request} _request The connect middleware HTTP request object, altered by previous middleware in various ways as sort of a shared context object pushed forward to the next middleware function
     * @param {Response} res The connect middleware HTTP response object whose methods are used to resolve the middleware chain and send a true HTTP response back to the caller
     * @param {NextFunction} _ The `next` middleware function which pushes execution forward in the chain (unused in a global error handler but necessary to name in the function params due to the way Express identifies this as an error handler - with four function params - rather than a normal middleware function)
     */
    globalErrorHandler(
      err: ErrorWithExtensions,
      _request: Request,
      res: Response,
      _: NextFunction
    ) {
      logger.error(err)

      res.status(err.extensions && err.extensions.code).json({
        success: false,
        message: err.message,
        data: err.extensions
      })
    },

    unsupportedEndpointHandler(req: Request, res: Response, _: NextFunction) {
      logger.warn(`${req.method.toUpperCase()} request for unsupported endpoint: ${req.originalUrl}`)

      res.status(404).json({
        success: false,
        message: `The endpoint '${
          req.originalUrl
        }' is not supported by this application (or isn't supported for ${
          req.method.toUpperCase()
        } requests like these)`
      })
    }
  }
}

export type BasicMiddleware = ReturnType<typeof createBasicMiddleware>

export default createBasicMiddleware
