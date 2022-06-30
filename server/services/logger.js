const pino = require('pino');

function createLogger({ level, isProduction, appName, appVersion }) {
  const logger = pino({
    level,
    name: [appName, appVersion].join('@'),
    prettyPrint: isProduction,
    redact: [
      'token',
      'dbURI',
      'cacheURI',
      'accessToken',
      'refreshToken',
      'clientSecret',
      'authorization',
      'headers.authorization'
    ]
  });

  logger.debug(`Logger created and set to a threshold level of '${level}'`);

  return logger;
}

module.exports = createLogger;
