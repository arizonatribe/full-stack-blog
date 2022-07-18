import mongoose from "mongoose"
import { createSession } from "./session"
import { AnyObject } from "../../src/types"

export async function createUser<T extends AnyObject>(options: T) {
  const User = mongoose.model("User")
  return new User(options).save()
}

export async function createAnonymousUserSession() {
  const user = await createUser({ name: "testing" })
  return createSession(user._id.toString())
}
