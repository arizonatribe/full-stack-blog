import parseEnv from "../../src/config/env"
import { AnyObject } from "../../src/types"

export function createTestEnv(env?: AnyObject) {
  process.env = {
    ...process.env,
    ...(parseEnv() as any),
    NODE_ENV: "test",
    LOG_LEVEL: "error",
    ...(env)
  }
}
