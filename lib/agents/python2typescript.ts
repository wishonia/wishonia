import fs from "fs"
import path from "path"

import { textCompletion } from "@/lib/llm"

function getOutputFilePath(
  filePath: string,
  pythonProjectDirectory: string,
  outputDirectory: string
) {
  const outputFilePath = filePath.replace(".py", ".ts")
  return outputFilePath.replace(pythonProjectDirectory, outputDirectory)
}
const convertPythonToGithubIssue = async (
  pythonCode: string
): Promise<{ title: string; body: string }> => {
  const prompt = `Generate a json object for a Github issue for implementing the following 
    Python code to Next.js 14 using the /app folder router with
         Prisma and TypeScript.
         
         the returned object should have the following properties:
            - title: string
            - body: string
         
        \n\nPython code:\n\n${pythonCode}
        \n\n${pythonCode}`
  const result = await textCompletion(prompt, "json_object")
  // if the result contains "```typescript" or "```tsx" get the code block between the backticks
  return JSON.parse(result)
}

function writeFile(filePath: string, content: string) {
  console.log(`Saving ${filePath}`)
  const outputDirectoryForFile = path.dirname(filePath)
  if (!fs.existsSync(outputDirectoryForFile)) {
    fs.mkdirSync(outputDirectoryForFile, { recursive: true })
  }
  fs.writeFileSync(filePath, content)
}

export async function convertPythonCodeToGithubIssues(
  pythonProjectDirectory: string,
  outputDirectory: string
): Promise<void> {
  // Get all Python files in the project directory
  const pythonFiles = getPythonFiles(pythonProjectDirectory)
  for (const file of pythonFiles) {
    const issue = await convertPythonToGithubIssue(readFileContent(file))
    let filePath = getOutputFilePath(
      file,
      pythonProjectDirectory,
      outputDirectory
    )
    filePath = filePath.replace(".py", ".json")
    writeFile(filePath, JSON.stringify(issue, null, 2))
  }
}

export const convertPythonProjectToNextJS = async (
  pythonProjectDirectory: string,
  outputDirectory: string
): Promise<void> => {
  const convertPythonToNextJS = async (pythonCode: string): Promise<string> => {
    const prompt = `Convert the following Python code to Next.js 14 using the /app folder router with
         Prisma and TypeScript.
        Only return the typescript code for a single file without any other instructions or comments.
        \n\nPython code:\n\n${pythonCode}
        \n\n${pythonCode}`
    const result = await textCompletion(prompt, "text")
    return getCodeFromBlocks(result)
  }
  const pythonFiles = getPythonFiles(pythonProjectDirectory)
  for (const file of pythonFiles) {
    const pythonCode = readFileContent(file)
    const outputFilePath = getOutputFilePath(
      file,
      pythonProjectDirectory,
      outputDirectory
    )
    if (fs.existsSync(outputFilePath)) {
      console.log(`File ${outputFilePath} already exists. Skipping.`)
      continue
    }
    const convertedCode = await convertPythonToNextJS(pythonCode)
    writeFile(outputFilePath, convertedCode)
  }
}

function getCodeFromBlocks(result: string) {
  const matchTypescript = result.match(/```typescript\n([\s\S]*?)\n```/)
  const matchTsx = result.match(/```tsx\n([\s\S]*?)\n```/)
  let codeBlock = result
  if (matchTypescript) {
    codeBlock = matchTypescript[1]
  } else if (matchTsx) {
    codeBlock = matchTsx[1]
  }
  return codeBlock
}

// Function to get all Python files in the project directory
const getPythonFiles = (directory: string): string[] => {
  const entries = fs.readdirSync(directory, { withFileTypes: true })

  const files = entries
    .filter((entry) => !entry.isDirectory())
    .map((entry) => path.join(directory, entry.name))
    .filter((file) => path.extname(file) === ".py")

  const folders = entries.filter((entry) => entry.isDirectory())

  for (const folder of folders) {
    const directory1 = path.join(directory, folder.name)
    files.push(...getPythonFiles(directory1))
  }

  return files
}
const readFileContent = (filePath: string): string => {
  return fs.readFileSync(filePath, "utf-8")
}
