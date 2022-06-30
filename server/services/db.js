const mongoose = require('mongoose');
const createModels = require('../models');

function createDbClient(config) {
  const { dbURI } = config;

  const models = createModels();

  mongoose.Promise = global.Promise;
  mongoose.connect(dbURI, { useMongoClient: true });

  return models;
}

module.exports = createDbClient;
