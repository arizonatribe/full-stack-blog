const redis = require('redis');

function createCacheClient(config) {
  const { cacheURI } = config;

  const client = redis.createClient(cacheURI);

  const cacheClient = {
    async saveBlogToCache(uid, blog) {
      let blogs = await cacheClient.getBlogs(uid);

      if (!blogs) {
        blogs = [];
      }

      return client.hset('Blog', uid, JSON.stringify([
        ...blogs,
        ...(Array.isArray(blog) ? blog : [blog])
      ]));
    },

    async getBlogs(uid, blogId) {
      return new Promise((resolve, reject) => {
        return client.hget('Blog', uid, (err, strResult) => {
          if (err) {
            return reject(err);
          }

          if (!strResult) {
            return resolve();
          }

          const blogs = JSON.parse(strResult);

          if (blogId) {
            return resolve(blogs.find(b => b._id === blogId));
          }

          return resolve(blogs);
        })
      });
    }
  };

  return cacheClient;
}

module.exports = createCacheClient;
