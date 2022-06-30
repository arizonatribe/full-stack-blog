const path = require('path');
const parseEnv = require('./env');
const pkg = require('../../package.json');

function createConfig() {
  const env = parseEnv(process.env);

  return {
    port: env.PORT,
    appName: pkg.name,
    appVersion: pkg.version,
    level: env.LOG_LEVEL,
    dbURI: env.DB_URI,
    cacheURI: env.CACHE_URI,
    cookieKey: env.COOKIE_KEY,
    clientID: env.CLIENT_ID,
    clientSecret: env.CLIENT_SECRET,
    isProduction: env.NODE_ENV === 'production',
    staticAssetsPath: env.STATIC_ASSETS_PATH,
    indexPath: path.resolve(env.STATIC_ASSETS_PATH, 'index.html')
  };
}

module.exports = createConfig;
