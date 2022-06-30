function createBasicMiddleware(config, { logger }) {
  return {
    allowCrossDomainMiddleware(_, res, next) {
      res.header("Access-Control-Allow-Origin", "*")
      res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE")
      res.header("Access-Control-Allow-Headers", "Content-Type")
      next()
    },

    healthCheck(_req, res, _) {
      res.status(200).json({
        version: config.appVersion,
        name: config.appName,
        success: true,
        status: "OK",
        timestamp: Date.now(),
        uptime: process.uptime()
      })
    },

    globalErrorHandler(err, _request, res, _) {
      logger.error(err)

      res.status(err.extensions && err.extensions.code).json({
        success: false,
        message: err.message,
        data: err.extensions
      })
    },

    unsupportedEndpointHandler(req, res, _) {
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

module.exports = createBasicMiddleware;
