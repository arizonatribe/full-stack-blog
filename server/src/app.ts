import helmet from "helmet"
import compression from "compression"
import cookieSession from "cookie-session"
import express, { Application } from "express"

import createRoutes from "./routes"
import createMiddleware from "./middleware"
import createConfig, { ServerConfig } from "./config"
import createServices, { Services } from "./services"

const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000

export interface Server {
  app: Application
  config: ServerConfig
  services: Services
}

async function startApp(): Promise<Server> {
  const config = createConfig()
  const services = await createServices(config)
  const middleware = createMiddleware(config, services)

  const app = express()
    .use(express.urlencoded({ extended: false, limit: "6mb" }))
    .use(express.json({ limit: "6mb" }))
    .use(cookieSession({ maxAge: THIRTY_DAYS, keys: [config.cookieKey] }))
    .use(compression())
    .use(helmet())
    .use(services.passport.initialize())
    .use(services.passport.session())
    .use(createRoutes(middleware))
    .use(middleware.globalErrorHandler)

  /*
   * Local development occurs with both client and server
   * being run on non-transpiled original source code
   * and with file watch (auto-reload)
   */
  if (config.isProduction) {
    app.use(middleware.serveStaticAssets)
    app.get("*", middleware.serveIndexPage)
  }

  return { app, config, services } as Server
}

export default startApp
