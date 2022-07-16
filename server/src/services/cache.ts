import { Logger } from "pino"
import * as redis from "redis"
import { ServerConfig } from "../config"
import { ErrorWithExtensions } from "../types"

async function connectCache(url: string, logger: Logger) {
  let cacheURI: string

  try {
    cacheURI = new URL(url).toString()
  } catch (err) {
    const message = "Invalid cache connection URL"

    logger.warn(message)
    logger.error(err)

    throw new ErrorWithExtensions(
      [message, "Check the logs for details"].join(". "),
      { code: 500 }
    )
  }

  const client = redis.createClient({ url: cacheURI })

  logger.debug({ message: "Connecting to cache instance", cacheURI })

  try {
    await client.connect()
    logger.debug("✅ Connected to the cache successfully")
  } catch (err) {
    logger.warn("⚠️  Failed to connect to the cache")
    logger.error(err)
    throw err
  }

  return client
}

async function createCacheClient(config: ServerConfig, logger: Logger) {
  const { cacheURI } = config

  const client = await connectCache(cacheURI, logger)

  const cacheClient = {
    async hget(hashKey: string, key: string) {
      logger.debug(`Querying cache for hashKey '${hashKey}' and key '${key}'`)

      const strResult = await client.HGET(hashKey, key)
      logger.debug(strResult)

      try {
        return JSON.parse(strResult as string)
      } catch (_e) {
        return strResult
      }
    },

    async get(key: string) {
      logger.debug(`Querying cache for key '${key}'`)

      const strResult = await client.get(key)
      logger.debug(strResult)

      try {
        return JSON.parse(strResult as string)
      } catch (_e) {
        return strResult
      }
    },

    async hset(hashKey: string, key: string, val: any, modifiers: any) {
      logger.debug(`Setting cache with hashKey of '${hashKey}' and key '${key}' and value of '${val}'`)
      // @ts-ignore
      return client.HSET(hashKey, key, JSON.stringify(val), modifiers)
    },

    async set(key: string, val: string, modifiers: any) {
      logger.debug(`Setting cache with key '${key}' and value of '${val}'`)
      return client.set(key, JSON.stringify(val), modifiers)
    },

    async clear(key: string) {
      logger.debug(`Clearing cache of key '${key}'`)
      return client.del(key)
    },

    // async saveBlogToCache(uid: string, blog) {
    //   let blogs = await cacheClient.getBlogs(uid);

    //   if (!blogs) {
    //     blogs = [];
    //   }

    //   return client.HSET('Blog', uid, JSON.stringify([
    //     ...blogs,
    //     ...(Array.isArray(blog) ? blog : [blog])
    //   ]));
    // },

    async getBlogs(uid: string, blogId?: string) {
      const strResult = await client.HGET("Blog", uid)

      try {
        const blogs = JSON.parse(strResult as string)

        if (blogId) {
          return blogs.find((b: any) => b._id === blogId)
        }

        return blogs
      } catch (_e) {
        return strResult
      }
    }
  }

  return cacheClient
}

export type Cache = Awaited<ReturnType<typeof createCacheClient>>;

export default createCacheClient
