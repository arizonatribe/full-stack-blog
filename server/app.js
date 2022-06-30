const helmet = require('helmet');
const express = require('express');
const compression = require('compression');
const cookieSession = require('cookie-session');

const createConfig = require('./config');
const createRoutes = require('./routes');
const createServices = require('./services');
const createMiddleware = require('./middleware');

const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

function startApp() {
  const config = createConfig();
  const services = createServices(config);
  const middleware = createMiddleware(config, services);

  const app = express()
    .use(express.urlencoded({ extended: false, limit: '6mb' }))
    .use(express.json({ limit: '6mb' }))
    .use(cookieSession({ maxAge: THIRTY_DAYS, keys: [config.cookieKey] }))
    .use(compression())
    .use(helmet())
    .use(services.passport.initialize())
    .use(services.passport.session())
    .use(createRoutes(middleware))
    .use(middleware.globalErrorHandler);

  /*
   * Local development occurs with both client and server
   * being run on non-transpiled original source code
   * and with file watch (auto-reload)
   */
  if (config.isProduction) {
    app.use(middleware.serveStaticAssets);
    app.get('*', middleware.serveIndexPage);
  }

  return { app, config, services };
}

module.exports = startApp;
