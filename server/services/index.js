const createDb = require('./db');
const createCache = require('./cache');
const createLogger = require('./logger');
const createPassport = require('./passport');

function createServices(config) {
  const logger = createLogger(config);
  const cache = createCache(config);
  const models = createDb(config);
  const passport = createPassport(config, models);

  return { models, cache, logger, passport };
}

module.exports = createServices;
