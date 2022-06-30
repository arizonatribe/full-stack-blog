const mongoose = require('mongoose');
const { Schema } = mongoose;

function createUserModel() {
  const userSchema = new Schema({
    googleId: String,
    displayName: String
  });

  mongoose.model('User', userSchema);

  return mongoose.model('User');
}

module.exports = createUserModel;
