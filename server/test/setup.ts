import createConfig from "../src/config"
import connectDb from "../src/services/db"
import createLogger from "../src/services/logger"
import { createTestEnv } from "./utils"

jest.setTimeout(30000)

async function setupTests() {
  createTestEnv()
  const config = createConfig()
  const logger = createLogger(config)
  await connectDb(config, undefined, logger)
}

setupTests()
