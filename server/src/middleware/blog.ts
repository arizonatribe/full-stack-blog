/// <reference path="../types/express.d.ts" />
/// <reference path="../types/mongoose.d.ts" />

import express, { Request, Response, NextFunction } from "express"

import { Services } from "../services"
import { ServerConfig } from "../config"
import { ErrorWithExtensions } from "../types"

/**
 * A factory function which creates domain specific middleware from the app's configuration settings & cross-cutting services.
 *
 * @function
 * @name createBlogMiddleware
 * @param {ServerConfig} config The application configuration settings
 * @param {Services} services The application's cross-cutting services
 * @param {Object<string, function>} services.logger An instance of a threshold-based logger
 * @param {Object<string, any>} services.cache An instance of a cache client
 * @param {Object<string, any>} services.models An instance of the ORM models
 * @returns {BlogMiddleware} The middleware functions ready to be bound to the app
 */
function createBlogMiddleware(config: ServerConfig, services: Services) {
  const { staticAssetsPath, indexPath } = config
  const { cache, logger, models } = services

  return {
    serveStaticAssets: express.static(staticAssetsPath),

    serveIndexPage(_req: Request, res: Response, _: NextFunction) {
      res.sendFile(indexPath)
    },

    goHome(_req: Request, res: Response, _: NextFunction) {
      res.redirect("/blogs")
    },

    async resolveBlogsForUser(req: Request, res: Response, _next: NextFunction) {
      const blogs = await models.Blog.find({ _user: req.user?.id }).cache({
        key: req.user?.id
      })

      // if (blogs) {
      //   await cache.saveBlogToCache(req.user.id, blogs);
      // }

      res.send(blogs)
    },

    async createNewBlogEntry(req: Request, res: Response, next: NextFunction) {
      const { title, content } = req.body

      const blog = new models.Blog({
        title,
        content,
        _user: req.user?.id
      })

      try {
        await blog.save()
        // await cache.saveBlogToCache(req.user.id, blog);
        await cache.clear(req.user?.id as string)
        res.send(blog)
      } catch (err: any) {
        next(new ErrorWithExtensions(err, { code: 400 }))
      }
    },

    async resolveBlogsFromDb(req: Request, res: Response, _next: NextFunction) {
      const { params = {}, user } = req

      logger.debug(`Looking up Blog ID ${params.id} for user ${user?.id}`)

      const blog = await models.Blog.findOne({
        _user: user?.id,
        _id: params.id
      })

      logger.debug({ blog })

      // if (blog) {
      //   logger.debug(`Found blog ${params.id}; saving to cache (for next time)`);
      //   await cache.saveBlogToCache(user.id, blog);
      // }

      res.send(blog)
    },

    async resolveBlogsFromCache(req: Request, res: Response, next: NextFunction) {
      const { params = {}, user } = req

      const blogs = await cache.getBlogs(user?.id as string, params.id)

      if (!blogs) {
        // Let it hit the DB
        return next()
      }

      return res.send(blogs)
    }
  }
}

export type BlogMiddleware = ReturnType<typeof createBlogMiddleware>

export default createBlogMiddleware
