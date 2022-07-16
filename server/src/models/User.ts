import mongoose, { Schema, Document } from "mongoose"

export interface User extends Document {
  displayName: string,
  googleId: string
}

function createUserModel() {
  const userSchema = new Schema({
    googleId: String,
    displayName: String
  })

  mongoose.model<User>("User", userSchema)

  return mongoose.model<User>("User")
}

export default createUserModel
