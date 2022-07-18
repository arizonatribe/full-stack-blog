import { URL } from "url"
import { Logger } from "pino"
import mongoose from "mongoose"

import { Cache } from "./cache"
import createModels from "../models"
import { ServerConfig } from "../config"
import { ErrorWithExtensions } from "../types"

const SECONDS_EXPIRES = 300

function enhanceMongoose(cache: Cache, logger: Logger) {
  mongoose.Promise = global.Promise

  const {exec} = mongoose.Query.prototype

  logger.trace("Overriding mongoose lazy-loaded query execution method (to implement caching)")

  mongoose.Query.prototype.cache = function CacheQuery(options) {
    this.useCache = true
    this.hashKey = typeof options?.key === "string" || typeof options?.key === "number"
      ? `${options.key}`
      : JSON.stringify(options?.key ?? "")

    logger.trace(`Enabled caching for ${
      this.model.collection.name
    } for records uniquely identified with '${
      this.hashKey
    }'`)

    return this
  }

  mongoose.Query.prototype.exec = async function EnhancedQuery() {
    const query = this.getQuery()
    const collection = this.model.collection.name

    if (!this.useCache) {
      logger.debug(`Executing query on ${collection} (no caching)`)
      logger.trace(query)

      return exec.apply(this)
    }

    const key = JSON.stringify({ collection, ...query })

    logger.debug(`Checking cache for any ${collection} with the key ${this.hashKey}`)
    logger.trace(query)

    const doc = await cache.hget(this.hashKey, key)

    if (doc) {
      logger.debug(`Found a cached ${collection} matching hash key ${this.hashKey}`)

      /* eslint-disable new-cap */
      return Array.isArray(doc)
        ? doc.map(d => new this.model(d))
        : new this.model(doc)
    }

    logger.debug(`No match in the cache for ${this.hashKey}. Now executing query on the DB`)

    const result = await exec.apply(this)

    if (result) {
      logger.debug(`Found a result for ${
        this.hashKey
      }. Adding to the cache for ${
        SECONDS_EXPIRES
      } seconds`)

      cache.hset(this.hashKey, key, result, { EX: SECONDS_EXPIRES })
    }

    return result
  }
}

async function connectDb(url: string, logger: Logger) {
  let dbURI: string

  try {
    dbURI = new URL(url).toString()
  } catch (err) {
    const message = "Invalid DB connection URL"

    logger.warn(message)
    logger.error(err)

    throw new ErrorWithExtensions(
      [message, "Check the logs for details"].join(". "),
      { code: 500 }
    )
  }

  logger.debug({ message: "Connecting to db instance", dbURI })

  try {
    await mongoose.connect(dbURI)
    logger.debug("✅ Connected to the db successfully")
  } catch (err) {
    logger.warn("⚠️  Failed to connect to the db")
    logger.error(err)
    throw err
  }

  return mongoose
}

async function createDbClient(
  config: ServerConfig,
  cache?: Cache,
  logger: Logger | typeof console = console
) {
  const { dbURI } = config

  logger.trace("Setting up DB models")

  const models = createModels()

  if (cache != null) {
    enhanceMongoose(cache, logger as Logger)
  }

  await connectDb(dbURI, logger as Logger)

  return models
}

export type Db = ReturnType<typeof createDbClient>;

export default createDbClient
