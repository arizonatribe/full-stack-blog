import { createUser } from "./user"
import { createTestEnv } from "./env"
import { createSession } from "./session"

async function createAnonymousUserSession() {
  const user = await createUser({ name: "testing" })
  return createSession(user._id.toString())
}

export {
  createAnonymousUserSession,
  createSession,
  createTestEnv,
  createUser
}
