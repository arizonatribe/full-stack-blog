import { Config } from "@jest/types"

const config: Config.InitialOptions = {
  preset: "ts-jest",
  verbose: true,
  setupFilesAfterEnv: ["<rootDir>/server/test/setup.ts"],
  globalTeardown: "<rootDir>/server/test/teardown.ts",
  testEnvironment: "node",
  testEnvironmentOptions: {
    url: "http://localhost/"
  }
}

export default config
