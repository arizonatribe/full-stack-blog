const createUserModel = require('./User');
const createBlogModel = require('./Blog');

function createModels() {
  const User = createUserModel();
  const Blog = createBlogModel();

  return { Blog, User };
}

module.exports = createModels;
