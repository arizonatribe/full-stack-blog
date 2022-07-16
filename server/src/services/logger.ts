import pino, { Logger } from "pino"
import { ServerConfig } from "../config"

function createLogger(config: ServerConfig): Logger {
  const { level, isProduction, appName, appVersion } = config

  const logger = pino({
    level,
    name: [appName, appVersion].join("@"),
    prettyPrint: isProduction,
    redact: [
      "token",
      "dbURI",
      "cacheURI",
      "accessToken",
      "refreshToken",
      "clientSecret",
      "authorization",
      "headers.authorization"
    ]
  })

  logger.debug(`Logger created and set to a threshold level of '${level}'`)

  return logger
}

export default createLogger
