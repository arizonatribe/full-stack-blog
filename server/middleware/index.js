const createAuthMiddleware = require('./auth');
const createBlogMiddleware = require('./blog');
const createBasicMiddeleware = require('./basic');

function createMiddleware(config, services) {
  return {
    ...createAuthMiddleware(config, services),
    ...createBasicMiddeleware(config, services),
    ...createBlogMiddleware(config, services)
  };
}

module.exports = createMiddleware;
