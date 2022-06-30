const express = require('express');
const createAuthRoutes = require('./auth');
const createBlogRoutes = require('./blog');

function createRoutes(middleware) {
  const router = express.Router()

  return createBlogRoutes(
    createAuthRoutes(router, middleware),
    middleware
  );
}

module.exports = createRoutes;
