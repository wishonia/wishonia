/**
 * @jest-environment node
 */
import {
  convertPythonCodeToGithubIssues,
  convertPythonProjectToNextJS,
} from "@/lib/agents/python2typescript"
import { absPathFromRepo } from "@/lib/fileHelper"

describe("convertPythonProjectToNextJS", () => {
  it("should convert Python files to Next.js with TypeScript", async () => {
    const outputDirectory = absPathFromRepo(".generated")
    await convertPythonProjectToNextJS(
      getInputProjectDirectory(),
      outputDirectory
    )
  })
  it("should convert Python files to github issues with TypeScript", async () => {
    const outputDirectory = absPathFromRepo(".generated")
    await convertPythonCodeToGithubIssues(
      getInputProjectDirectory(),
      outputDirectory + "\\issues"
    )
  })
})

function getInputProjectDirectory() {
  const pythonProjectDirectory = process.env.INPUT_PYTHON_PROJECT_DIRECTORY
  if (!pythonProjectDirectory) {
    throw new Error("process.env.INPUT_PYTHON_PROJECT_DIRECTORY not provided")
  }
  return pythonProjectDirectory
}
