import { Level } from "pino"
import * as path from "path"
import parseEnv from "./env"

const pkg = require("../../../package.json")

/**
 * The application configuration object
 *
 * @interface
 * @typedef {Object<string, number|boolean|string>} ServerConfig
 * @property {number} port The TCP port number on which the server runs
 * @property {string} appName The name of the application
 * @property {string} appVersion The semantic version of the application
 * @property {string} apiVersion The API version prefix used externally to hit any of the application's endpoints
 * @property {Level} level The logging threshold level
 * @property {string} dbURI The URL for the hosted database
 * @property {string} cacheURI The URL for the hosted caching layer
 * @property {string} cookieKey The identifier for the session cookie
 * @property {string} clientID The unique client ID (for third-party application auth)
 * @property {string} clientSecret The client secret (for third-party application auth)
 * @property {boolean} isProduction Whether or not this application is running in production
 * @property {string} staticAssetsPath The root directory path for the client-side application assets
 * @property {string} indexPath The file path for the client-side application entrypoint
 */
export interface ServerConfig {
  port: number
  appName: string
  appVersion: string
  apiVersion: string
  level: Level
  dbURI: string
  cacheURI: string
  cookieKey: string
  clientID: string
  clientSecret: string
  isProduction: boolean
  staticAssetsPath: string
  indexPath: string
}

function createConfig(): ServerConfig {
  const env = parseEnv(process.env)

  return {
    port: env.PORT,
    appName: pkg.name,
    appVersion: pkg.version,
    apiVersion: `v${pkg.version.split(".")[0]}`,
    level: env.LOG_LEVEL,
    dbURI: env.DB_URI,
    cacheURI: env.CACHE_URI,
    cookieKey: env.COOKIE_KEY,
    clientID: env.CLIENT_ID,
    clientSecret: env.CLIENT_SECRET,
    isProduction: env.NODE_ENV === "production",
    staticAssetsPath: env.STATIC_ASSETS_PATH,
    indexPath: path.resolve(env.STATIC_ASSETS_PATH, "index.html")
  } as ServerConfig
}

export default createConfig
