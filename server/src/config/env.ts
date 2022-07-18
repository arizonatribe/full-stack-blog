import dotenv from "dotenv"
import { Level } from "pino"
import * as fs from "fs"
import * as path from "path"
import * as envalid from "envalid"

const { str, port } = envalid

/**
 * The minimum expected environment variables
 *
 * @interface
 * @typedef {Object<string, number|string>} ServerEnv
 * @property {number} [PORT=5000] The port on which this application runs
 * @property {string} [LOG_LEVEL='info'] The logging threshold level
 * @property {string} [NODE_ENV='development'] The environment where this application is running
 * @property {string} [COOKIE_KEY=''] The key to use to sign and verify cookies
 * @property {string} [CACHE_URI='redis://127.0.0.1:6379'] The connection string for the cache
 * @property {string} [DB_URI='mongodb://localhost:27017/blog'] The connection string for the blog database
 * @property {string} CLIENT_SECRET The OAuth2 Client secret (for third-party login)
 * @property {string} CLIENT_ID The OAuth2 Client ID (for third-party login)
 * @property {string} [STATIC_ASSETS_PATH='client/build/'] Root location of the browser (front-end) static assets
 */
export interface ServerEnv {
  PORT: number
  LOG_LEVEL: Level
  NODE_ENV: "development" | "production" | "test"
  COOKIE_KEY: string
  CACHE_URI: string
  DB_URI: string
  CLIENT_SECRET: string
  CLIENT_ID: string
  STATIC_ASSETS_PATH: string
}

function parseEnv(processEnv = process.env): ServerEnv {
  const dotEnvPath = /^production$/.test(processEnv.NODE_ENV as string)
    ? ".env.prod"
    : /^test$/.test(processEnv.NODE_ENV as string)
      ? ".env.test"
      : ".env"

  const result = dotenv.config(
    fs.existsSync(dotEnvPath)
      ? { path: dotEnvPath }
      : undefined
  )

  if (result.error) {
    throw result.error
  }

  return envalid.cleanEnv<ServerEnv>(processEnv, {
    STATIC_ASSETS_PATH: str({
      default: path.resolve(process.cwd(), "client", "build"),
      desc: "Root location of the browser (front-end) static assets"
    }),
    CLIENT_ID: str({
      docs: "https://console.cloud.google.com/apis/credentials",
      desc: "The OAuth2 Client ID (for third-party login)"
    }),
    CLIENT_SECRET: str({
      docs: "https://console.cloud.google.com/apis/credentials",
      desc: "The OAuth2 Client secret (for third-party login)"
    }),
    DB_URI: str({
      default: "mongodb://localhost:27017/blog",
      desc: "The connection string for the blog database"
    }),
    CACHE_URI: str({
      default: "redis://127.0.0.1:6379",
      desc: "The connection string for the cache"
    }),
    COOKIE_KEY: str({
      desc: "The (plain-text) key to use to sign and verify cookies"
    }),
    NODE_ENV: str({
      desc: "The environment where this application is running",
      default: "development",
      choices: ["development", "production", "test"]
    }),
    LOG_LEVEL: str({
      default: "info",
      desc: "The logging threshold level",
      choices: ["trace", "debug", "info", "warn", "error", "fatal"]
    }),
    PORT: port({
      default: 5000,
      example: "5000",
      desc: "The port on which this application runs"
    })
  })
}

export default parseEnv
