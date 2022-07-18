import express from "express"
import createAuthRoutes from "./auth"
import createBlogRoutes from "./blog"
import createUploadRoutes from "./upload"
import { Middleware } from "../middleware"

function createRoutes(middleware: Middleware) {
  const router = express.Router()

  const routerWithAuth = createAuthRoutes(router, middleware)
  const routerWithBlogAndAuth = createBlogRoutes(routerWithAuth, middleware)
  const allRoutes = createUploadRoutes(routerWithBlogAndAuth, middleware)

  return allRoutes
}

export type Routes = ReturnType<typeof createRoutes>;

export default createRoutes
