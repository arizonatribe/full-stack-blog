const startApp = require('./app');

const { app, config, services } = startApp();
const { port, appName, appVersion, level } = config;
const { logger } = services;

app.listen(port, '0.0.0.0', () => {
  logger.debug(config);

  logger.info(`${
    appName
  }@${
    appVersion
  } now running on port ${
    port
  } at logging level '${
    level
  }'`);
});
