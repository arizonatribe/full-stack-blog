import { Logger } from "pino"
import { PassportStatic } from "passport"

import createDb from "./db"
import createLogger from "./logger"
import createPassport from "./passport"
import createCache, { Cache } from "./cache"

import { Models } from "../models"
import { ServerConfig } from "../config"

export interface Services {
  cache: Cache
  logger: Logger
  models: Models
  passport: PassportStatic
}

async function createServices(config: ServerConfig): Promise<Services> {
  const logger = createLogger(config)
  const cache = await createCache(config, logger)
  const models = await createDb(config, cache, logger)
  const passport = createPassport(config, models, logger)

  return { models, cache, logger, passport } as Services
}

export default createServices
