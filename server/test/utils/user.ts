import mongoose from "mongoose"
import { AnyObject } from "../../src/types"

export async function createUser<T extends AnyObject>(options: T) {
  const User = mongoose.model("User")
  return new User(options).save()
}
