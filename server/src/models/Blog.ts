import mongoose, { Schema, Document } from "mongoose"
import { User } from "./User"

export interface Blog extends Document {
  title: string,
  content: string
  createdAt: Date
  _user: User["_id"]
}

function createBlogModel() {
  const blogSchema = new Schema({
    title: String,
    content: String,
    createdAt: { type: Date, default: Date.now },
    _user: { type: Schema.Types.ObjectId, ref: "User" }
  })

  mongoose.model<Blog>("Blog", blogSchema)

  return mongoose.model<Blog>("Blog")
}

export default createBlogModel
