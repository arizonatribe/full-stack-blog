import startApp, { Server } from "./app"

startApp().then((server: Server) => {
  const { app, config, services } = server
  const { port, appName, appVersion, level } = config
  const { logger } = services

  app.listen(port, "0.0.0.0", () => {
    logger.debug(config)

    if (["trace", "debug", "info"].some(l => l === level)) {
      logger.info(`🚀 ${
        appName
      }@${
        appVersion
      } now running on port ${
        port
      } at logging 🌳 level '${
        level
      }'`)
    }
  })
})
