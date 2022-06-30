const path = require('path');
const { cleanEnv, str, port } = require('envalid');

function parseEnv(processEnv = process.env) {
  const dotEnvPath = /^production$/.test(processEnv.NODE_ENV)
    ? ".env.prod"
    : ".env"

  const result = require('dotenv').config({ path: dotEnvPath });

  if (result.error) {
    throw result.error
  }

  return cleanEnv(processEnv, {
    STATIC_ASSETS_PATH: str({
      default: path.resolve(process.cwd(), 'client', 'build'),
      desc: 'Root location of the browser (front-end) static assets'
    }),
    CLIENT_ID: str({
      docs: 'https://console.cloud.google.com/apis/credentials',
      desc: 'The OAuth2 Client ID (for third-party login)'
    }),
    CLIENT_SECRET: str({
      docs: 'https://console.cloud.google.com/apis/credentials',
      desc: 'The OAuth2 Client secret (for third-party login)'
    }),
    DB_URI: str({
      default: 'mongodb://localhost:27017/blog',
      desc: 'The connection string for the blog database'
    }),
    CACHE_URI: str({
      default: 'redis://127.0.0.1:6379',
      desc: 'The connection string for the cache'
    }),
    COOKIE_KEY: str({
      default: '',
      desc: 'The key to use to sign and verify cookies'
    }),
    NODE_ENV: str({
      desc: "The environment where this application is running",
      default: "development",
      choices: ["development", "production"]
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

module.exports = parseEnv;
