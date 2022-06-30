const express = require('express');

function createBlogMiddleware(config, { cache, logger, models }) {
  const { staticAssetsPath, indexPath } = config;

  return {
    serveStaticAssets: express.static(staticAssetsPath),

    serveIndexPage(_req, res) {
      res.sendFile(indexPath);
    },

    goHome(_req, res) {
      res.redirect('/blogs');
    },

    async resolveBlogsForUser(req, res, _next) {
      const blogs = await models.Blog.find({ _user: req.user.id });

      if (blogs) {
        await cache.saveBlogToCache(req.user.id, blogs);
      }

      res.send(blogs);
    },

    async createNewBlogEntry(req, res, _next) {
      const { title, content } = req.body;

      const blog = new models.Blog({
        title,
        content,
        _user: req.user.id
      });

      try {
        await blog.save();
        await cache.saveBlogToCache(req.user.id, blog);
        res.send(blog);
      } catch (err) {
        res.send(400, err);
      }
    },

    async resolveBlogsFromDb(req, res, _next) {
      const { params = {}, user = {} } = req;

      logger.debug(`Looking up Blog ID ${params.id} for user ${user.id}`);

      const blog = await models.Blog.findOne({
        _user: user.id,
        _id: params.id
      });

      logger.debug({ blog });

      if (blog) {
        logger.debug(`Found blog ${params.id}; saving to cache (for next time)`);
        await cache.saveBlogToCache(user.id, blog);
      }

      res.send(blog);
    },

    async resolveBlogsFromCache(req, res, next) {
      const { params = {}, user = {} } = req;

      const blogs = await cache.getBlogs(user.id, params.id);

      if (!blogs) {
        // Let it hit the DB
        return next();
      }

      return res.send(blogs);
    }
  }
}

module.exports = createBlogMiddleware;
