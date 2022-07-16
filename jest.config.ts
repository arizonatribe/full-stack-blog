import { Config } from "@jest/types"

const config: Config.InitialOptions = {
  preset: "ts-jest",
  verbose: true,
  testEnvironment: "node",
  testEnvironmentOptions: {
    url: "http://localhost/"
  }
}

export default config
