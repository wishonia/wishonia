const nextJest = require("next/jest")

const createJestConfig = nextJest({
  dir: "./",
})

const customJestConfig = {
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testEnvironment: "node",
  // __checks__ holds Checkly's Playwright specs, which Jest can't run.
  testPathIgnorePatterns: ["<rootDir>/__checks__/"],
}

module.exports = createJestConfig(customJestConfig)
