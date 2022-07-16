import createUserModel from "./User"
import createBlogModel from "./Blog"

function createModels() {
  const User = createUserModel()
  const Blog = createBlogModel()

  return { Blog, User }
}

export type Models = ReturnType<typeof createModels>

export default createModels
